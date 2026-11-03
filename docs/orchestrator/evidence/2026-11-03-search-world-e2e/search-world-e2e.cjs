const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const evidenceDir = __dirname;
const root = path.resolve(evidenceDir, '../../../..');
const runtime = path.join(root, 'coordinate_converter Claude.html');
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const profile = path.join(evidenceDir, `edge-profile-${process.pid}-${Date.now()}`);
const portFile = path.join(profile, 'DevToolsActivePort');
const runtimeBytes = fs.readFileSync(runtime);
const runtimeSha256 = crypto.createHash('sha256').update(runtimeBytes).digest('hex');
const expectedRuntimeSha256 = '32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28';
const external = (url) => /^https?:\/\//i.test(url) || /^wss?:\/\//i.test(url);
const isNominatim = (url) => /nominatim\.openstreetmap\.org/i.test(url);
const uniqueRequests = (items) => [...new Map(items.map((item) => [`${item.scenario}:${item.networkId || item.requestId}`, item])).values()];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const records = {
  networkRequests: [],
  fetchBlocked: [],
  loadingFailed: [],
  loadingFinished: [],
  pageExceptions: [],
  consoleErrors: []
};
let activeScenario = 'startup';
let proc;
let ws;
let cdpCall;

function near(actual, expected, tolerance) {
  return Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
}

function degreesDistanceKm(a, b) {
  const meanLat = (a.lat + b.lat) * Math.PI / 360;
  const dLat = (a.lat - b.lat) * Math.PI / 180;
  const dLon = (a.lon - b.lon) * Math.PI / 180;
  return 6371.0088 * Math.hypot(dLat, Math.cos(meanLat) * dLon);
}

function wgs84DistanceMeters(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && (lon1 === lon2 || Math.abs(Math.abs(lon1 - lon2) - 360) < 1e-12)) return 0;
  if (Math.abs(lat1) === 90 && Math.abs(lat2) === 90 && Math.sign(lat1) === Math.sign(lat2)) return 0;
  const a = 6378137;
  const f = 1 / 298.257223563;
  const b = (1 - f) * a;
  const rad = Math.PI / 180;
  const phi1 = lat1 * rad, phi2 = lat2 * rad;
  const U1 = Math.atan((1 - f) * Math.tan(phi1));
  const U2 = Math.atan((1 - f) * Math.tan(phi2));
  const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
  const L = Math.atan2(Math.sin((lon2 - lon1) * rad), Math.cos((lon2 - lon1) * rad));
  let lambda = L, sigma = 0, sinSigma = 0, cosSigma = 0, sinAlpha = 0, cosSqAlpha = 0, cos2SigmaM = 0;
  let converged = false;
  for (let i = 0; i < 100; i++) {
    const sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
    const x = cosU2 * sinLambda;
    const y = cosU1 * sinU2 - sinU1 * cosU2 * cosLambda;
    sinSigma = Math.hypot(x, y);
    if (sinSigma === 0) return 0;
    cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
    sigma = Math.atan2(sinSigma, cosSigma);
    sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
    cosSqAlpha = 1 - sinAlpha * sinAlpha;
    cos2SigmaM = cosSqAlpha === 0 ? 0 : cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
    const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    const previous = lambda;
    lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    if (Math.abs(lambda - previous) < 1e-13) { converged = true; break; }
  }
  if (!converged) throw new Error(`WGS84 distance did not converge for ${lat1},${lon1} → ${lat2},${lon2}`);
  const uSq = cosSqAlpha * (a * a - b * b) / (b * b);
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const cos2Sq = cos2SigmaM * cos2SigmaM;
  const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2Sq)
    - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2Sq)));
  return b * A * (sigma - deltaSigma);
}

function metricSummary(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((total, value) => total + value, 0);
  return {
    max: sorted.at(-1), mean: sum / sorted.length,
    median: sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2,
    p95: sorted[Math.ceil(0.95 * sorted.length) - 1]
  };
}

async function main() {
  assert.equal(runtimeSha256, expectedRuntimeSha256, 'candidate runtime hash differs from the assigned QA target');
  assert(fs.existsSync(edge), `Edge executable missing: ${edge}`);
  fs.mkdirSync(profile, { recursive: true });
  proc = spawn(edge, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-background-networking', '--disable-extensions', '--disable-sync',
    '--host-resolver-rules=MAP * ~NOTFOUND',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
  ], { windowsHide: true, stdio: 'ignore' });

  for (let i = 0; i < 300 && !fs.existsSync(portFile); i++) await sleep(100);
  assert(fs.existsSync(portFile), 'Edge DevTools did not start');
  const port = Number(fs.readFileSync(portFile, 'utf8').split(/\r?\n/)[0]);
  const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page = pages.find((entry) => entry.type === 'page');
  assert(page, 'Edge did not expose a page target');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

  let nextId = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.method === 'Network.requestWillBeSent' && external(message.params.request.url)) {
      records.networkRequests.push({
        scenario: activeScenario,
        requestId: message.params.requestId,
        url: message.params.request.url,
        timestamp: message.params.timestamp
      });
    } else if (message.method === 'Fetch.requestPaused' && external(message.params.request.url)) {
      records.fetchBlocked.push({
        scenario: activeScenario,
        requestId: message.params.requestId,
        networkId: message.params.networkId || null,
        url: message.params.request.url
      });
      void cdpCall('Fetch.failRequest', {
        requestId: message.params.requestId,
        errorReason: 'BlockedByClient'
      }).catch(() => {});
    } else if (message.method === 'Network.loadingFailed') {
      const prior = records.networkRequests.find((item) => item.requestId === message.params.requestId);
      if (prior) records.loadingFailed.push({
        scenario: prior.scenario,
        requestId: message.params.requestId,
        url: prior.url,
        blockedReason: message.params.blockedReason || null,
        errorText: message.params.errorText
      });
    } else if (message.method === 'Network.loadingFinished') {
      const prior = records.networkRequests.find((item) => item.requestId === message.params.requestId);
      if (prior) records.loadingFinished.push({
        scenario: prior.scenario,
        requestId: message.params.requestId,
        url: prior.url
      });
    } else if (message.method === 'Runtime.exceptionThrown') {
      records.pageExceptions.push({
        scenario: activeScenario,
        text: message.params.exceptionDetails && message.params.exceptionDetails.text
      });
    } else if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      records.consoleErrors.push({
        scenario: activeScenario,
        text: (message.params.args || []).map((arg) => arg.value || arg.description || '').join(' ')
      });
    }
    if (message.id && pending.has(message.id)) {
      const [resolve, reject] = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
    }
  };

  cdpCall = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, [resolve, reject]);
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await cdpCall('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: true
    });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
    }
    return response.result.value;
  };

  await cdpCall('Runtime.enable');
  await cdpCall('Log.enable');
  await cdpCall('Page.enable');
  await cdpCall('Network.enable');
  await cdpCall('Network.setBlockedURLs', { urls: ['http://*', 'https://*', 'ws://*', 'wss://*'] });
  await cdpCall('Fetch.enable', {
    patterns: [
      { urlPattern: 'http://*/*', requestStage: 'Request' },
      { urlPattern: 'https://*/*', requestStage: 'Request' },
      { urlPattern: 'ws://*/*', requestStage: 'Request' },
      { urlPattern: 'wss://*/*', requestStage: 'Request' }
    ]
  });
  await cdpCall('Emulation.setDeviceMetricsOverride', {
    width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false
  });
  const pageUrl = `${pathToFileURL(runtime).href}?search_world_e2e=${Date.now()}`;
  await cdpCall('Page.navigate', { url: pageUrl });

  let ready = false;
  for (let i = 0; i < 400; i++) {
    await sleep(100);
    try {
      ready = await evaluate(`document.readyState === 'complete' &&
        document.body.classList.contains('gis-mode') &&
        !!document.getElementById('topbarConvertBtn') &&
        typeof state === 'object' && !!document.getElementById('btnConvert')`);
    } catch (_) {}
    if (ready) break;
  }
  assert(ready, 'GIS tool did not become ready in Edge');
  const privacyInitial = await evaluate(`(()=>({
    geocodeEnabled:state.geocodeEnabled,
    geocodeReverseAuto:state.geocodeReverseAuto,
    opsecStrict:state.opsecStrict,
    forceOffline:state.forceOffline
  }))()`);

  const openSearchUi = await evaluate(`(()=>{
    const tab=document.querySelector('#appTopbar .app-tab[data-tab="geocoding"]');
    if (!tab) throw Error('topbar Cerca tab missing');
    tab.click();
    const card=document.getElementById('geocodeCard');
    if (card && !card.open) card.querySelector('summary').click();
    const input=document.getElementById('geoInput');
    const btn=document.getElementById('btnGeoSearch');
    if (!input || !btn || !input.getClientRects().length || !btn.getClientRects().length)
      throw Error('Cerca controls are not visible after opening the Cerca panel');
    return {visible:true, tabSelected:tab.classList.contains('is-active'), open:!!card.open};
  })()`);
  assert(openSearchUi.visible && openSearchUi.open, 'Cerca UI did not open');

  const validSearch = [
    {
      id: 'search-dd', format: 'DD', input: '12.345678, -45.678912',
      expected: { lat: 12.345678, lon: -45.678912, tol: 0.5e-6 },
      publicFixture: 'synthetic decimal degrees; six decimal places'
    },
    {
      id: 'search-ddm', format: 'DDM', input: 'DDM 33 55.200 S 151 12.600 E',
      expected: { lat: -(33 + 55.2 / 60), lon: 151 + 12.6 / 60, tol: 0.5 * 0.001 / 60 },
      publicFixture: 'synthetic signed hemispheres; three decimal places of minutes'
    },
    {
      id: 'search-dms', format: 'DMS', input: 'DMS 68 12 34.5 N 21 30 15.2 E',
      expected: { lat: 68 + 12 / 60 + 34.5 / 3600, lon: 21 + 30 / 60 + 15.2 / 3600, tol: 0.5 * 0.1 / 3600 },
      publicFixture: 'synthetic; one decimal place of seconds'
    },
    {
      id: 'search-utm-geotrans', format: 'UTM', input: 'UTM 46 S 389603 6540383',
      expectedMgrs: '46JCL8960340383',
      publicFixture: 'GEOTRANS vector 46 S / 389603 / 6540383 → 46J CL 89603 40383; 1 m grid units'
    },
    {
      id: 'search-mgrs-geographiclib', format: 'MGRS', input: '38VLS0000000000',
      expectedSource: '38VLS0000000000',
      publicFixture: 'GeographicLib 2.5 published valid cell; 5+5 digits = 1 m cell'
    }
  ];

  const validConvert = [
    {
      id: 'convert-dd-antimeridian', format: 'DD',
      fields: { subtab: 'dd', lat: '12.345678', latHem: 'S', lon: '179.876543', lonHem: 'W' },
      expected: { lat: -12.345678, lon: -179.876543, tol: 0.5e-6 },
      publicFixture: 'synthetic decimal degrees; six decimal places; western antimeridian side'
    },
    {
      id: 'convert-ddm', format: 'DDM',
      fields: { subtab: 'ddm', latD: '12', latM: '34.567', latHem: 'S', lonD: '101', lonM: '23.456', lonHem: 'W' },
      expected: { lat: -(12 + 34.567 / 60), lon: -(101 + 23.456 / 60), tol: 0.5 * 0.001 / 60 },
      publicFixture: 'synthetic; three decimal places of minutes'
    },
    {
      id: 'convert-dms-origin', format: 'DMS',
      fields: { subtab: 'dms', latD: '0', latM: '0', latS: '0', latHem: 'N', lonD: '0', lonM: '0', lonS: '0', lonHem: 'E' },
      expected: { lat: 0, lon: 0, tol: 0.5 / 3600 },
      publicFixture: 'synthetic exact equator and prime-meridian boundary'
    },
    {
      id: 'convert-utm-equator', format: 'UTM',
      fields: { zone: '32', hemisphere: 'N', easting: '166109', northing: '0' },
      expectedMgrs: '32NJF6610900000',
      publicFixture: 'existing integrated fixture 32 N / 166109 / 0 → 32NJF6610900000; 1 m grid units'
    },
    {
      id: 'convert-mgrs-geographiclib', format: 'MGRS',
      fields: { mgrs: '38NPF0000000000' },
      expectedSource: '38NPF0000000000',
      publicFixture: 'GeographicLib 2.5 published valid cell; 5+5 digits = 1 m cell'
    }
  ];

  const validResults = [];
  const scenarioAudits = [];

  const runSearch = async (testCase) => {
    activeScenario = testCase.id;
    const result = await evaluate(`(async()=>{
      const input=document.getElementById('geoInput');
      const btn=document.getElementById('btnGeoSearch');
      const prior=state.lastResult;
      input.focus(); input.value=${JSON.stringify(testCase.input)};
      input.dispatchEvent(new Event('input',{bubbles:true}));
      btn.click();
      await new Promise(resolve=>setTimeout(resolve,120));
      const r=state.lastResult;
      const map=document.querySelector('#miniMap');
      const marker=map && map.querySelector('.tile-marker:not(.tile-marker-draft)');
      let visual=null;
      if (map && marker){
        const mr=map.getBoundingClientRect(), style=marker.getAttribute('style')||'';
        const left=Number((style.match(/left:([^p]+)px/)||[])[1]);
        const top=Number((style.match(/top:([^p]+)px/)||[])[1]);
        visual={map:{width:mr.width,height:mr.height},marker:{left,top},
          centerDeltaPx:{x:left-mr.width/2,y:top-mr.height/2},
          centered:Math.abs(left-mr.width/2)<2&&Math.abs(top-mr.height/2)<2};
      }
      return {
        changed:r!==prior, lat:r&&r.lat, lon:r&&r.lon,
        metaType:r&&r.meta&&r.meta.type, metaSource:r&&r.meta&&r.meta.source,
        mgrsSource:r&&r.mgrsSource, utmSource:r&&r.utmSource,
        center:state.viewCenter&&{lat:state.viewCenter.lat,lon:state.viewCenter.lon},
        lastPoint:state.lastPoint&&{lat:state.lastPoint.lat,lon:state.lastPoint.lon},
        feedback:document.getElementById('geoSearchFeedback').textContent,
        resultText:document.getElementById('results').innerText,
        mapPresent:!!map, markerPresent:!!marker, visual
      };
    })()`);
    await sleep(120);
    activeScenario = 'between-scenarios';
    return result;
  };

  const runConvert = async (testCase) => {
    activeScenario = testCase.id;
    const result = await evaluate(`(async()=>{
      const top=document.getElementById('topbarConvertBtn');
      const dlg=document.getElementById('convertModal');
      if (!dlg.open) top.click();
      const manual=document.getElementById('manualInputDetails');
      if (manual && !manual.open) manual.querySelector('summary').click();
      const choose=(selector)=>{const el=document.querySelector(selector);if(!el)throw Error('missing UI '+selector);el.click();};
      const fill=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('missing input '+id);el.focus();el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));};
      const select=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('missing select '+id);el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));};
      const prior=state.lastResult;
      const fields=${JSON.stringify(testCase.fields)};
      if (${JSON.stringify(testCase.format)}==='DD'){
        choose('.tab[data-tab="latlon"]'); choose('.subtab[data-sub="dd"]');
        fill('dd-lat',fields.lat);select('dd-lat-hem',fields.latHem);fill('dd-lon',fields.lon);select('dd-lon-hem',fields.lonHem);
      } else if (${JSON.stringify(testCase.format)}==='DDM'){
        choose('.tab[data-tab="latlon"]'); choose('.subtab[data-sub="ddm"]');
        for(const [id,v] of [['ddm-lat-d',fields.latD],['ddm-lat-m',fields.latM],['ddm-lon-d',fields.lonD],['ddm-lon-m',fields.lonM]])fill(id,v);
        select('ddm-lat-hem',fields.latHem);select('ddm-lon-hem',fields.lonHem);
      } else if (${JSON.stringify(testCase.format)}==='DMS'){
        choose('.tab[data-tab="latlon"]'); choose('.subtab[data-sub="dms"]');
        for(const [id,v] of [['dms-lat-d',fields.latD],['dms-lat-m',fields.latM],['dms-lat-s',fields.latS],['dms-lon-d',fields.lonD],['dms-lon-m',fields.lonM],['dms-lon-s',fields.lonS]])fill(id,v);
        select('dms-lat-hem',fields.latHem);select('dms-lon-hem',fields.lonHem);
      } else if (${JSON.stringify(testCase.format)}==='UTM'){
        choose('.tab[data-tab="utm"]');
        for(const [id,v] of [['utm-zone',fields.zone],['utm-e',fields.easting],['utm-n',fields.northing]])fill(id,v);
        select('utm-hem',fields.hemisphere);
      } else if (${JSON.stringify(testCase.format)}==='MGRS'){
        choose('.tab[data-tab="mgrs"]');fill('mgrs-input',fields.mgrs);
      } else throw Error('unsupported Converti fixture format');
      document.getElementById('btnConvert').click();
      await new Promise(resolve=>setTimeout(resolve,120));
      const r=state.lastResult;
      const map=document.querySelector('#miniMap');
      const marker=map && map.querySelector('.tile-marker:not(.tile-marker-draft)');
      let visual=null;
      if (map && marker){
        const mr=map.getBoundingClientRect(), style=marker.getAttribute('style')||'';
        const left=Number((style.match(/left:([^p]+)px/)||[])[1]);
        const top=Number((style.match(/top:([^p]+)px/)||[])[1]);
        visual={map:{width:mr.width,height:mr.height},marker:{left,top},
          centerDeltaPx:{x:left-mr.width/2,y:top-mr.height/2},
          centered:Math.abs(left-mr.width/2)<2&&Math.abs(top-mr.height/2)<2};
      }
      return {
        changed:r!==prior, lat:r&&r.lat, lon:r&&r.lon,
        metaType:r&&r.meta&&r.meta.type, metaSource:r&&r.meta&&r.meta.source,
        mgrsSource:r&&r.mgrsSource, utmSource:r&&r.utmSource,
        center:state.viewCenter&&{lat:state.viewCenter.lat,lon:state.viewCenter.lon},
        lastPoint:state.lastPoint&&{lat:state.lastPoint.lat,lon:state.lastPoint.lon},
        errorHidden:document.getElementById('errorBox').hidden,
        errorText:document.getElementById('errorBox').textContent,
        resultText:document.getElementById('results').innerText,
        mapPresent:!!map, markerPresent:!!marker, visual,
        modalOpen:!!dlg.open, controlsVisible:!!document.getElementById('btnConvert').getClientRects().length
      };
    })()`);
    await sleep(120);
    activeScenario = 'between-scenarios';
    return result;
  };

  const assertMapAndResult = (testCase, result) => {
    assert(result.changed, `${testCase.id}: the clicked UI did not produce a new result`);
    assert(Number.isFinite(result.lat) && Number.isFinite(result.lon), `${testCase.id}: result coordinates are not finite`);
    const expectedType = testCase.format === 'DD' || testCase.format === 'DDM' || testCase.format === 'DMS'
      ? (testCase.id.startsWith('convert-') ? null : 'LatLon')
      : testCase.format;
    assert.equal(result.metaType, expectedType,
      `${testCase.id}: result type does not match the entered format`);
    if (testCase.id.startsWith('convert-')) {
      assert(result.metaSource == null, `${testCase.id}: unexpected result source ${result.metaSource}`);
    } else {
      assert.equal(result.metaSource, 'search-coord', `${testCase.id}: unexpected result source`);
    }
    assert(result.mapPresent && result.markerPresent, `${testCase.id}: rendered map or point marker is missing`);
    assert(result.center && near(result.center.lat, result.lat, 1e-12) && near(result.center.lon, result.lon, 1e-12),
      `${testCase.id}: map view center differs from converted point`);
    assert(result.lastPoint && near(result.lastPoint.lat, result.lat, 1e-12) && near(result.lastPoint.lon, result.lon, 1e-12),
      `${testCase.id}: map marker point differs from converted point`);
    assert(result.visual && result.visual.centered,
      `${testCase.id}: visible marker tip is not centered in the rendered map: ${JSON.stringify(result.visual)}`);
    if (testCase.expected) {
      assert(near(result.lat, testCase.expected.lat, testCase.expected.tol),
        `${testCase.id}: latitude ${result.lat} differs from expected ${testCase.expected.lat} beyond ${testCase.expected.tol}°`);
      assert(near(result.lon, testCase.expected.lon, testCase.expected.tol),
        `${testCase.id}: longitude ${result.lon} differs from expected ${testCase.expected.lon} beyond ${testCase.expected.tol}°`);
    }
    if (testCase.expectedMgrs) {
      const text = result.resultText.replace(/\s/g, '').toUpperCase();
      assert(text.includes(testCase.expectedMgrs), `${testCase.id}: result cards do not include fixture MGRS ${testCase.expectedMgrs}`);
    }
    if (testCase.expectedSource) {
      assert(result.mgrsSource && result.mgrsSource.raw.replace(/\s/g, '').toUpperCase() === testCase.expectedSource,
        `${testCase.id}: the entered MGRS source/precision was not preserved`);
      assert.equal(result.mgrsSource.precision, 5, `${testCase.id}: expected MGRS 1 m cell precision`);
      assert.equal(result.mgrsSource.cellSize, 1, `${testCase.id}: expected MGRS cell size 1 m`);
    }
  };

  const auditFor = (id) => {
    const attempted = records.networkRequests.filter((item) => item.scenario === id);
    const paused = records.fetchBlocked.filter((item) => item.scenario === id);
    const failed = records.loadingFailed.filter((item) => item.scenario === id);
    const completed = records.loadingFinished.filter((item) => item.scenario === id);
    const nominatim = uniqueRequests([...attempted, ...paused].filter((item) => isNominatim(item.url)));
    return { scenario: id, externalAttempts: attempted.length, fetchIntercepted: paused.length, blockedFailures: failed.length,
      externalCompletions: completed.length, nominatimAttempts: nominatim.length };
  };
  const assertNoEgress = (id) => {
    const audit = auditFor(id);
    assert.equal(audit.externalCompletions, 0, `${id}: external request completed`);
    scenarioAudits.push(audit);
  };
  const assertNoNominatimAttempts = (id) => {
    const count = auditFor(id).nominatimAttempts;
    assert.equal(count, 0, `${id}: coordinate flow attempted Nominatim ${count} time(s)`);
  };

  for (const testCase of validSearch) {
    const result = await runSearch(testCase);
    assertMapAndResult(testCase, result);
    const record = { ...testCase, result: { lat: result.lat, lon: result.lon, metaType: result.metaType,
      mgrsSource: result.mgrsSource || null, center: result.center, visual: result.visual } };
    validResults.push(record);
    assertNoEgress(testCase.id);
    assertNoNominatimAttempts(testCase.id);
    if (testCase.id === 'search-dms') {
      const shot = await cdpCall('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(evidenceDir, 'search-valid-dms-map.png'), Buffer.from(shot.data, 'base64'));
    }
  }

  const worldCases = JSON.parse(fs.readFileSync(path.join(evidenceDir, 'baseline-geodesy-cases.json'), 'utf8'));
  assert(worldCases.length >= 60, `existing world fixture has only ${worldCases.length} points`);
  const worldRows = [];
  const worldFailures = [];
  for (const fixture of worldCases) {
    const testCase = { id: `world-search-dd-${fixture.name}`, format: 'DD', input: fixture.inputs.DD };
    const result = await runSearch(testCase);
    const errorMeters = wgs84DistanceMeters(fixture.lat, fixture.lon, result.lat, result.lon);
    assert(errorMeters <= 0.01, `${testCase.id}: ${errorMeters} m exceeds existing 0.01 m DD criterion`);
    let flowError = null;
    try { assertMapAndResult(testCase, result); } catch (error) { flowError = error.message; }
    const row = { name: fixture.name, input: fixture.inputs.DD, expected: { lat: fixture.lat, lon: fixture.lon },
      point: { lat: result.lat, lon: result.lon }, errorMeters, centered: result.visual, pass: !flowError && errorMeters <= 0.01,
      failure: flowError };
    worldRows.push(row);
    if (flowError) worldFailures.push({ name: fixture.name, input: fixture.inputs.DD, failure: flowError, result: row });
    assertNoEgress(testCase.id);
    assertNoNominatimAttempts(testCase.id);
    if (['AntiWest', 'AntiMinus180', 'NorthPole', 'UTMLeft'].includes(fixture.name)) {
      const shot = await cdpCall('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(evidenceDir, `world-${fixture.name}.png`), Buffer.from(shot.data, 'base64'));
    }
  }
  const worldErrors = worldRows.map((row) => row.errorMeters);

  const searchInvalid = [
    ...['38VMS', '38NPE', '38MPF', '32NNA0000000000', '32MNF0000050000', '32MNF0000000000']
      .map((mgrs) => ({ id: `search-invalid-mgrs-${mgrs}`, input: `MGRS ${mgrs}` })),
    { id: 'search-invalid-dd-range', input: 'DD 95 10' },
    { id: 'search-invalid-utm-zone', input: 'UTM 61 N 500000 1000000' }
  ];
  for (const testCase of searchInvalid) {
    activeScenario = testCase.id;
    const result = await evaluate(`(async()=>{
      const input=document.getElementById('geoInput'),btn=document.getElementById('btnGeoSearch');
      const prior=state.lastResult;
      input.focus();input.value=${JSON.stringify(testCase.input)};input.dispatchEvent(new Event('input',{bubbles:true}));btn.click();
      await new Promise(resolve=>setTimeout(resolve,120));
      const r=state.lastResult;
      return {sameResult:r===prior,feedback:document.getElementById('geoSearchFeedback').textContent,
        mapCenter:state.viewCenter&&{lat:state.viewCenter.lat,lon:state.viewCenter.lon}};
    })()`);
    await sleep(120);
    activeScenario = 'between-scenarios';
    assert(result.sameResult, `${testCase.id}: invalid search replaced the previous converted result`);
    assert(result.feedback.trim(), `${testCase.id}: invalid search did not show local validation feedback`);
    assertNoEgress(testCase.id);
    assertNoNominatimAttempts(testCase.id);
  }

  // Re-open Converti through the visible topbar button, then click its real UI controls.
  activeScenario = 'convert-open';
  const convertOpened = await evaluate(`(()=>{
    const btn=document.getElementById('topbarConvertBtn');
    if (!btn.getClientRects().length) throw Error('topbar Converti button is not visible');
    btn.click();
    const dlg=document.getElementById('convertModal');
    if (!dlg.open) throw Error('Converti panel did not open');
    const manual=document.getElementById('manualInputDetails');
    if (manual && !manual.open) manual.querySelector('summary').click();
    return {open:!!dlg.open,manualOpen:!manual||!!manual.open};
  })()`);
  assert(convertOpened.open && convertOpened.manualOpen, 'Converti form did not become available');

  const defaultConvert = validConvert[0];
  const defaultConvertResult = await runConvert(defaultConvert);
  // Keep this scenario open through the documented 1 s + 2 s retry backoff window.
  activeScenario = defaultConvert.id;
  await sleep(4500);
  activeScenario = 'between-scenarios';
  assert(defaultConvertResult.errorHidden, `${defaultConvert.id}: Converti displayed a validation error`);
  assert(defaultConvertResult.controlsVisible, `${defaultConvert.id}: Converti controls were not visible`);
  assertMapAndResult(defaultConvert, defaultConvertResult);
  validResults.push({ ...defaultConvert, result: { lat: defaultConvertResult.lat, lon: defaultConvertResult.lon,
    metaType: defaultConvertResult.metaType, mgrsSource: defaultConvertResult.mgrsSource || null,
    utmSource: defaultConvertResult.utmSource || null, center: defaultConvertResult.center, visual: defaultConvertResult.visual } });
  assertNoEgress(defaultConvert.id);
  const defaultConvertAudit = auditFor(defaultConvert.id);
  const defaultNominatimUrls = uniqueRequests([...records.networkRequests, ...records.fetchBlocked]
    .filter((item) => item.scenario === defaultConvert.id && isNominatim(item.url))).map((item) => item.url);
  const defaultReverseShouldRun = privacyInitial.geocodeEnabled && privacyInitial.geocodeReverseAuto && !privacyInitial.opsecStrict;
  if (defaultReverseShouldRun) {
    assert(defaultConvertAudit.nominatimAttempts >= 1,
      `${defaultConvert.id}: auto-reverse was enabled but no provider attempt was observed`);
  } else {
    assert.equal(defaultConvertAudit.nominatimAttempts, 0,
      `${defaultConvert.id}: provider attempt occurred while initial reverse-geocoding was disabled`);
  }

  // Make the privacy choice through the visible Help > Geocoding settings controls.
  activeScenario = 'privacy-auto-reverse-off';
  await evaluate(`(()=>{
    const top=document.getElementById('topbarConvertBtn');if(document.getElementById('convertModal').open)top.click();
    const settings=document.getElementById('btnHeaderSettings');if(!settings||!settings.getClientRects().length)throw Error('Settings button is not visible');
    settings.click();
    const helpBtn=document.getElementById('btnHelp');if(!helpBtn||!helpBtn.getClientRects().length)throw Error('Help button is not visible');
    helpBtn.click();
    const help=document.getElementById('helpOverlay');if(!help.open)throw Error('Help settings panel did not open');
    const reverse=document.getElementById('setGeoReverseAuto');
    if(!reverse||!reverse.getClientRects().length)throw Error('Reverse-auto setting is not visible');
    if(reverse.checked)reverse.click();
    if(state.geocodeReverseAuto!==false||reverse.checked)throw Error('Reverse-auto did not switch off through the visible checkbox');
    document.getElementById('helpClose').click();
    return true;
  })()`);
  const privacyAutoReverseOff = await evaluate(`(()=>({geocodeEnabled:state.geocodeEnabled,geocodeReverseAuto:state.geocodeReverseAuto,opsecStrict:state.opsecStrict,forceOffline:state.forceOffline}))()`);
  assert.equal(privacyAutoReverseOff.geocodeReverseAuto, false, 'visible auto-reverse setting is not off');

  await evaluate(`(()=>{const top=document.getElementById('topbarConvertBtn'),dlg=document.getElementById('convertModal');if(!dlg.open)top.click();const manual=document.getElementById('manualInputDetails');if(manual&&!manual.open)manual.querySelector('summary').click();return !!dlg.open})()`);

  for (const testCase of validConvert.slice(1)) {
    const result = await runConvert(testCase);
    assert(result.errorHidden, `${testCase.id}: Converti displayed a validation error`);
    assert(result.controlsVisible, `${testCase.id}: Converti controls were not visible`);
    assertMapAndResult(testCase, result);
    validResults.push({ ...testCase, result: { lat: result.lat, lon: result.lon, metaType: result.metaType,
      mgrsSource: result.mgrsSource || null, utmSource: result.utmSource || null, center: result.center, visual: result.visual } });
    assertNoEgress(testCase.id);
    assertNoNominatimAttempts(testCase.id);
    if (testCase.id === 'convert-mgrs-geographiclib') {
      const shot = await cdpCall('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(evidenceDir, 'convert-valid-mgrs-map.png'), Buffer.from(shot.data, 'base64'));
    }
  }

  // Turn on OPSEC strict visibly and verify a coordinate conversion remains local.
  activeScenario = 'privacy-opsec-strict-on';
  await evaluate(`(()=>{
    const top=document.getElementById('topbarConvertBtn');if(document.getElementById('convertModal').open)top.click();
    document.getElementById('btnHeaderSettings').click();document.getElementById('btnHelp').click();
    const op=document.getElementById('setOpsecStrict');if(!op||!op.getClientRects().length)throw Error('OPSEC strict setting is not visible');
    if(!op.checked)op.click();
    if(state.opsecStrict!==true||!op.checked)throw Error('OPSEC strict did not switch on through the visible checkbox');
    document.getElementById('helpClose').click();return true;
  })()`);
  const privacyStrict = await evaluate(`(()=>({geocodeEnabled:state.geocodeEnabled,geocodeReverseAuto:state.geocodeReverseAuto,opsecStrict:state.opsecStrict,forceOffline:state.forceOffline}))()`);
  assert(privacyStrict.opsecStrict && privacyStrict.geocodeReverseAuto === false, 'strict privacy settings are not active');
  const strictCase = { id: 'convert-strict-dd', format: 'DD', fields: { subtab: 'dd', lat: '47.123456', latHem: 'S', lon: '88.654321', lonHem: 'W' },
    expected: { lat: -47.123456, lon: -88.654321, tol: 0.5e-6 } };
  const strictResult = await runConvert(strictCase);
  assert(strictResult.errorHidden, `${strictCase.id}: validation error`);
  assertMapAndResult(strictCase, strictResult);
  assertNoEgress(strictCase.id);assertNoNominatimAttempts(strictCase.id);
  validResults.push({ ...strictCase, result: { lat: strictResult.lat, lon: strictResult.lon, metaType: strictResult.metaType, center: strictResult.center } });

  // Force offline through the visible map offline panel toggle.
  activeScenario = 'privacy-forced-offline-on';
  const privacyOffline = await evaluate(`(()=>{
    const top=document.getElementById('topbarConvertBtn');if(document.getElementById('convertModal').open)top.click();
    const layersTab=document.querySelector('#appTopbar .app-tab[data-tab="layers"]');
    if(!layersTab||!layersTab.getClientRects().length)throw Error('visible Mappe Offline tab missing');
    layersTab.click();
    const layersDialog=document.getElementById('layersPanel');
    if(!layersDialog||!layersDialog.open)throw Error('Mappe Offline panel did not open');
    const panel=document.getElementById('offlineTilePanel');
    if(!panel)throw Error('offline panel missing');
    if(!panel.open)panel.querySelector('summary').click();
    const checkbox=document.getElementById('chkForceOffline');
    if(!checkbox||!checkbox.getClientRects().length)throw Error('forced-offline checkbox is not visible');
    if(!checkbox.checked)checkbox.click();
    if(state.forceOffline!==true||!checkbox.checked)throw Error('forced-offline did not switch on through the visible checkbox');
    return {geocodeEnabled:state.geocodeEnabled,geocodeReverseAuto:state.geocodeReverseAuto,opsecStrict:state.opsecStrict,forceOffline:state.forceOffline};
  })()`);
  assert(privacyOffline.forceOffline && privacyOffline.opsecStrict && privacyOffline.geocodeReverseAuto === false,
    'forced-offline privacy settings are not active');
  await evaluate(`(()=>{const top=document.getElementById('topbarConvertBtn'),dlg=document.getElementById('convertModal');if(!dlg.open)top.click();const manual=document.getElementById('manualInputDetails');if(manual&&!manual.open)manual.querySelector('summary').click();return !!dlg.open})()`);
  const offlineCase = { id: 'convert-forced-offline-ddm', format: 'DDM', fields: { subtab: 'ddm', latD: '76', latM: '52.593', latHem: 'S', lonD: '22', lonM: '20.741', lonHem: 'E' },
    expected: { lat: -(76 + 52.593 / 60), lon: 22 + 20.741 / 60, tol: 0.5 * 0.001 / 60 } };
  const offlineResult = await runConvert(offlineCase);
  assert(offlineResult.errorHidden, `${offlineCase.id}: validation error`);
  assertMapAndResult(offlineCase, offlineResult);
  assertNoEgress(offlineCase.id);assertNoNominatimAttempts(offlineCase.id);
  validResults.push({ ...offlineCase, result: { lat: offlineResult.lat, lon: offlineResult.lon, metaType: offlineResult.metaType, center: offlineResult.center } });

  const convertInvalid = [
    ...['38VMS', '38NPE', '38MPF', '32NNA0000000000', '32MNF0000050000', '32MNF0000000000']
      .map((mgrs) => ({ id: `convert-invalid-mgrs-${mgrs}`, format: 'MGRS', fields: { mgrs } })),
    { id: 'convert-invalid-dd-range', format: 'DD', fields: { subtab: 'dd', lat: '91', latHem: 'N', lon: '10', lonHem: 'E' } },
    { id: 'convert-invalid-ddm-minute', format: 'DDM', fields: { subtab: 'ddm', latD: '12', latM: '60', latHem: 'N', lonD: '34', lonM: '0', lonHem: 'E' } },
    { id: 'convert-invalid-dms-second', format: 'DMS', fields: { subtab: 'dms', latD: '12', latM: '0', latS: '60', latHem: 'N', lonD: '34', lonM: '0', lonS: '0', lonHem: 'E' } },
    { id: 'convert-invalid-utm-zone', format: 'UTM', fields: { zone: '61', hemisphere: 'N', easting: '500000', northing: '1000000' } }
  ];
  for (const testCase of convertInvalid) {
    activeScenario = testCase.id;
    const result = await evaluate(`(async()=>{
      const manual=document.getElementById('manualInputDetails');if(manual&&!manual.open)manual.querySelector('summary').click();
      const fields=${JSON.stringify(testCase.fields)};
      const choose=(selector)=>{const el=document.querySelector(selector);if(!el)throw Error('missing UI '+selector);el.click();};
      const fill=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('missing input '+id);el.focus();el.value=String(value);el.dispatchEvent(new Event('input',{bubbles:true}));};
      const select=(id,value)=>{const el=document.getElementById(id);if(!el)throw Error('missing select '+id);el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));};
      const prior=state.lastResult;
      if (${JSON.stringify(testCase.format)}==='MGRS'){choose('.tab[data-tab="mgrs"]');fill('mgrs-input',fields.mgrs);}
      else if (${JSON.stringify(testCase.format)}==='DD'){choose('.tab[data-tab="latlon"]');choose('.subtab[data-sub="dd"]');fill('dd-lat',fields.lat);select('dd-lat-hem',fields.latHem);fill('dd-lon',fields.lon);select('dd-lon-hem',fields.lonHem);}
      else if (${JSON.stringify(testCase.format)}==='DDM'){choose('.tab[data-tab="latlon"]');choose('.subtab[data-sub="ddm"]');for(const [id,v] of [['ddm-lat-d',fields.latD],['ddm-lat-m',fields.latM],['ddm-lon-d',fields.lonD],['ddm-lon-m',fields.lonM]])fill(id,v);select('ddm-lat-hem',fields.latHem);select('ddm-lon-hem',fields.lonHem);}
      else if (${JSON.stringify(testCase.format)}==='DMS'){choose('.tab[data-tab="latlon"]');choose('.subtab[data-sub="dms"]');for(const [id,v] of [['dms-lat-d',fields.latD],['dms-lat-m',fields.latM],['dms-lat-s',fields.latS],['dms-lon-d',fields.lonD],['dms-lon-m',fields.lonM],['dms-lon-s',fields.lonS]])fill(id,v);select('dms-lat-hem',fields.latHem);select('dms-lon-hem',fields.lonHem);}
      else if (${JSON.stringify(testCase.format)}==='UTM'){choose('.tab[data-tab="utm"]');for(const [id,v] of [['utm-zone',fields.zone],['utm-e',fields.easting],['utm-n',fields.northing]])fill(id,v);select('utm-hem',fields.hemisphere);}
      else throw Error('unsupported invalid Converti fixture format');
      document.getElementById('btnConvert').click();await new Promise(resolve=>setTimeout(resolve,120));
      return {sameResult:state.lastResult===prior,errorHidden:document.getElementById('errorBox').hidden,errorText:document.getElementById('errorBox').textContent};
    })()`);
    await sleep(120);
    activeScenario = 'between-scenarios';
    assert(result.sameResult, `${testCase.id}: invalid Converti replaced the previous result`);
    assert(!result.errorHidden && result.errorText.trim(), `${testCase.id}: Converti did not show a validation error`);
    assertNoEgress(testCase.id);
    assertNoNominatimAttempts(testCase.id);
  }

  // All generated examples must resolve to distinct map locations; neighboring band aliases are intentionally avoided.
  const locations = validResults.map((item) => ({ id: item.id, lat: item.result.lat, lon: item.result.lon }));
  const closePairs = [];
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const distanceKm = degreesDistanceKm(locations[i], locations[j]);
      if (distanceKm < 10) closePairs.push({ a: locations[i].id, b: locations[j].id, distanceKm });
    }
  }
  assert.equal(closePairs.length, 0, `valid sample points are not geographically distinct: ${JSON.stringify(closePairs)}`);

  const unmatchedNetworkAttempts = records.networkRequests.filter((request) => {
    const blocked = records.fetchBlocked.some((item) => item.url === request.url && item.scenario === request.scenario);
    const failed = records.loadingFailed.some((item) => item.requestId === request.requestId && item.blockedReason);
    return !blocked && !failed;
  });
  assert.equal(unmatchedNetworkAttempts.length, 0, `external request not accounted as blocked: ${JSON.stringify(unmatchedNetworkAttempts)}`);
  assert.equal(records.loadingFinished.length, 0, 'at least one external HTTP(S)/WS(S) request completed');
  assert.equal(records.pageExceptions.length, 0, `uncaught browser exceptions: ${JSON.stringify(records.pageExceptions)}`);
  const searchNominatimAttempts = uniqueRequests([...records.networkRequests, ...records.fetchBlocked].filter((item) =>
    isNominatim(item.url) && (item.scenario.startsWith('search-') || item.scenario.startsWith('world-search-')))).length;
  const reverseOffScenarios = [...validConvert.slice(1), strictCase, offlineCase, ...convertInvalid];
  const autoReverseOffNominatimAttempts = reverseOffScenarios.reduce((sum, item) => sum + auditFor(item.id).nominatimAttempts, 0);
  const blockReasonCounts = records.loadingFailed.reduce((counts, item) => {
    const reason = item.blockedReason || 'unclassified';
    counts[reason] = (counts[reason] || 0) + 1;
    return counts;
  }, {});

  const output = {
    status: worldFailures.length ? 'FAIL' : 'PASS',
    runtimeSha256,
    browser: 'Microsoft Edge headless; DevTools Protocol only; fresh profile isolated under this evidence folder',
    page: 'local file URL with cache-busting query; no localhost web server',
    interaction: 'visible topbar Cerca/Converti controls; typed DOM inputs dispatch input/change; actual Cerca and Converti buttons clicked; no direct call to classifier, parser, or conversion handlers',
    networkPolicy: {
      interception: 'CDP Fetch.failRequest on HTTP/HTTPS/WS/WSS; Network.setBlockedURLs on same schemes; Chrome host resolver maps every hostname to NOTFOUND; background networking/extensions/sync disabled',
      externalAttempts: records.networkRequests.length,
      fetchIntercepted: records.fetchBlocked.length,
      blockedFailures: records.loadingFailed.length,
      blockedByReason: blockReasonCounts,
      externalCompleted: records.loadingFinished.length,
      nominatimAttempts: uniqueRequests([...records.networkRequests, ...records.fetchBlocked].filter((item) => isNominatim(item.url))).length,
      perScenario: scenarioAudits
    },
    privacy: {
      freshProfileInitial: privacyInitial,
      defaultConvert: {
        scenario: defaultConvert.id,
        settings: privacyInitial,
        nominatimAttemptCount: defaultConvertAudit.nominatimAttempts,
        shouldRunByInitialSettings: defaultReverseShouldRun,
        attemptedUrls: defaultNominatimUrls,
        externalCompletions: defaultConvertAudit.externalCompletions,
        retryBehavior: `${defaultConvertAudit.nominatimAttempts} same-URL attempts captured across a 4.5 s window covering the documented 1 s and 2 s retry backoff`,
        classification: defaultConvertAudit.nominatimAttempts > 0
          ? 'default auto-reverse attempted provider access; request intercepted before completion; separate privacy finding, not a zero-attempt pass'
          : 'no provider attempt observed under initial settings'
      },
      afterVisibleAutoReverseOff: privacyAutoReverseOff,
      strictVisibleSettings: privacyStrict,
      strictForcedOfflineVisibleSettings: privacyOffline,
      coordinateSearchNominatimAttempts: searchNominatimAttempts,
      autoReverseOffNominatimAttempts: autoReverseOffNominatimAttempts,
      coordinateSearchRequirement: 'zero Nominatim attempts for every valid and invalid Cerca coordinate input',
      autoReverseOffRequirement: 'zero Nominatim attempts for Converti checks after visible auto-reverse OFF',
      networkOutcome: 'all external HTTP(S)/WS(S) requests intercepted and blocked; no external completion'
    },
    validCoordinates: validResults,
    worldUiMatrix: {
      pointCount: worldRows.length,
      coordinateAccuracyPassed: worldRows.filter((row) => row.errorMeters <= 0.01).length,
      endToEndPassed: worldRows.filter((row) => row.pass).length,
      endToEndFailures: worldFailures,
      sourceFixture: 'baseline-geodesy-cases.json (the existing 72-point global fixture; PROJ/GEOTRANS/GeographicLib provenance retained in baseline-geodesy-report.md)',
      interaction: 'Cerca text input + actual Cerca button for every point; visible result map, marker, state center, and point checked',
      toleranceMeters: 0.01,
      distanceMethod: 'WGS84 Vincenty inverse between fixture lat/lon and Cerca result; independent of the app projection/parser code',
      metricsMeters: metricSummary(worldErrors),
      rows: worldRows
    },
    invalidSearchCount: searchInvalid.length,
    invalidConvertCount: convertInvalid.length,
    distinctLocationsKm: { minimumSeparation: Math.min(...locations.flatMap((a, i) => locations.slice(i + 1).map((b) => degreesDistanceKm(a, b)))) },
    screenshots: ['search-valid-dms-map.png', 'convert-valid-mgrs-map.png', 'world-AntiWest.png', 'world-AntiMinus180.png', 'world-NorthPole.png', 'world-UTMLeft.png'],
    browserExceptions: records.pageExceptions,
    consoleErrors: records.consoleErrors,
    limits: [
      'Synthetic coordinates and the listed pre-existing public fixtures only; no exhaustive coordinate grid or world-wide geodesic certification.',
      'DD/ DDm/ DMS expectations are independently computed from the entered sexagesimal numbers; angular tolerances are half the last displayed unit.',
      'UTM/MGRS points use pre-existing GEOTRANS and GeographicLib fixtures; the UTM/MGRS UI cases assert the published grid result/source and exact map-to-result center equality, not an independent world-wide inverse-projection oracle.',
      'Map marker centering reuses FIX8 world-ui criterion (<2 CSS px between marker CSS left/top and mini-map center); coordinate map center is compared to the produced point within 1e-12 degrees.',
      'External providers and basemap tiles were deliberately unavailable; this verifies only local coordinate behavior and that no coordinate search was sent to Nominatim.'
    ]
  };
  fs.writeFileSync(path.join(evidenceDir, 'results.json'), JSON.stringify(output, null, 2));
  fs.writeFileSync(path.join(evidenceDir, 'network-events.json'), JSON.stringify(records, null, 2));
  const report = [
    '# Cerca / Converti global E2E',
    '',
    `Esito: **${output.status}** (scope centratura visiva della mappa).`,
    `Runtime SHA-256: \`${runtimeSha256}\`.`,
    `Cerca UI globale: ${output.worldUiMatrix.coordinateAccuracyPassed}/${output.worldUiMatrix.pointCount} coordinate entro 0,01 m; ${output.worldUiMatrix.endToEndPassed}/${output.worldUiMatrix.pointCount} flussi completi con marker centrato.`,
    `Errore DD WGS84 (m): max ${output.worldUiMatrix.metricsMeters.max}; media ${output.worldUiMatrix.metricsMeters.mean}; mediana ${output.worldUiMatrix.metricsMeters.median}; P95 ${output.worldUiMatrix.metricsMeters.p95}.`,
    `Input Cerca validi: ${validSearch.length}; Converti validi: ${validConvert.length + 2} (inclusi strict e offline); invalidi: Cerca ${searchInvalid.length}, Converti ${convertInvalid.length}.`,
    `Tentativi Nominatim di Cerca: ${searchNominatimAttempts} su input validi, invalidi e 72 punti mondiali.`,
    `Converti fresco: input DD \`12.345678 S, 179.876543 W\`; auto-reverse iniziale ${privacyInitial.geocodeReverseAuto}; geocoding ${privacyInitial.geocodeEnabled}; OPSEC strict ${privacyInitial.opsecStrict}; Nominatim tentato ${defaultConvertAudit.nominatimAttempts} volte, completamenti esterni ${defaultConvertAudit.externalCompletions}. URL: \`${defaultNominatimUrls[0] || 'nessuno'}\`.`,
    `Dopo auto-reverse OFF visibile: ${autoReverseOffNominatimAttempts} tentativi Nominatim nei Converti validi/invalidi, strict e forced-offline.`,
    `Dopo l’azione visibile auto-reverse OFF: ${privacyAutoReverseOff.geocodeReverseAuto}; configurazione OPSEC strict: ${privacyStrict.opsecStrict}; forced offline: ${privacyOffline.forceOffline}.`,
    `HTTP(S)/WS(S) tentate: ${records.networkRequests.length}; bloccate con reason \`inspector\`: ${blockReasonCounts.inspector || 0}; Fetch.requestPaused: ${records.fetchBlocked.length}; completate: ${records.loadingFinished.length}.`,
    '',
    '## Fallimenti E2E',
    '',
    ...(worldFailures.length ? worldFailures.map((item) => `- **${item.name}** — input \`${item.input}\`: ${item.failure}; delta marker-centro ${JSON.stringify(item.result.centered.centerDeltaPx)} CSS px.`) : ['- Nessun fallimento del centraggio nel campione.']),
    '',
    '## Criteri e limiti',
    '',
    '- Precisione delle coordinate: criterio DD di 0,01 m già adottato dalla matrice geodetica esistente. La distanza è calcolata con Vincenty inverso WGS84 nel runner, tra fixture e risultato del pulsante Cerca.',
    '- Marker: criterio CSS già usato dalla suite FIX8 `world-ui.cjs`, scarto strettamente minore di 2 px tra `left/top` del marker e centro di `#miniMap`.',
    '- Cerca ha zero tentativi Nominatim per input coordinati validi e invalidi. Tutto l’HTTP(S)/WS(S) è stato intercettato; nessuna richiesta esterna è stata completata.',
    '- Il caso Converti col profilo fresco conserva separato il comportamento auto-reverse predefinito. Un tentativo bloccato è un finding di default privacy, non una prova di zero tentativi. Le conversioni successive sono state ripetute con auto-reverse spento visibilmente, poi con OPSEC strict e forced offline visibili.',
    '- Le fonti e la matrice esistente sono documentate in `baseline-geodesy-report.md`; le metriche PROJ/GEOTRANS/GeographicLib in quel report appartengono ai byte storici indicati dal report, non sono state riattribuite a questo runtime. Non è una certificazione geodetica mondiale.',
    '- I controlli Cercai/Converti sono stati aperti nell’interfaccia, input compilati e pulsanti effettivi cliccati; nessun parser o handler è stato invocato direttamente.',
    '',
    'Artefatti dettagliati: `results.json`, `network-events.json`, screenshot elencati nel JSON.'
  ].join('\n');
  fs.writeFileSync(path.join(evidenceDir, 'REPORT.md'), report + '\n');
  console.log(JSON.stringify({
    status: output.status,
    runtimeSha256,
    searchValid: validSearch.length,
    convertValid: validConvert.length,
    invalidSearch: searchInvalid.length,
    invalidConvert: convertInvalid.length,
    externalAttempts: output.networkPolicy.externalAttempts,
    fetchIntercepted: output.networkPolicy.fetchIntercepted,
    blockedFailures: output.networkPolicy.blockedFailures,
    externalCompleted: output.networkPolicy.externalCompleted,
    nominatimAttempts: output.networkPolicy.nominatimAttempts,
    worldAccuracyPassed: output.worldUiMatrix.coordinateAccuracyPassed,
    worldE2ePassed: output.worldUiMatrix.endToEndPassed,
    worldFailures: worldFailures.map((item) => item.name),
    defaultConvertNominatimAttempts: defaultConvertAudit.nominatimAttempts,
    screenshots: output.screenshots
  }, null, 2));
  if (worldFailures.length) process.exitCode = 1;
}

main().catch((error) => {
  try { fs.writeFileSync(path.join(evidenceDir, 'network-events.json'), JSON.stringify(records, null, 2)); } catch (_) {}
  console.error(error.stack || error);
  process.exitCode = 1;
}).finally(() => {
  try { if (ws && ws.readyState === WebSocket.OPEN) ws.close(); } catch (_) {}
  try { if (proc && !proc.killed) proc.kill(); } catch (_) {}
});
