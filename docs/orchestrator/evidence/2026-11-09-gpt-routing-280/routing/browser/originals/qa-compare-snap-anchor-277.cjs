const fs = require('fs');
const crypto = require('crypto');
const { chromium } = require('C:/goi-pw-probe/node_modules/playwright');

const app = 'C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/routing-merge-276/routing-candidate-277.html';
const expectedSha = 'ed7d91fc990c0e3ae0e77ce28135aa6a56cb3bfc32859dae5ca4730072db21da';
const bytes = fs.readFileSync(app);
const sha = crypto.createHash('sha256').update(bytes).digest('hex');
if (sha !== expectedSha) throw new Error(`Unexpected candidate SHA: ${sha}`);

const O = { lat: 44.1024, lon: 9.8236 };
const S = { lat: O.lat + 150 / 111195.08, lon: O.lon };
const T = { lat: 44.107, lon: 9.829 };
const json = JSON.stringify;
const close = (a, b) => Math.abs(Number(a) - Number(b)) < 1e-9;

function graphhopperResponse(points) {
  const coordinates = points.map(point => [Number(point[0]), Number(point[1])]);
  const last = coordinates.length - 1;
  return { paths: [{
    distance: 1200,
    time: 900000,
    points: { type: 'LineString', coordinates },
    snapped_waypoints: { type: 'LineString', coordinates },
    details: { road_environment: [[0, last, 'road']] }
  }] };
}

function orsResponse(points) {
  const coordinates = points.map(point => [Number(point[0]), Number(point[1])]);
  const last = coordinates.length - 1;
  return { type: 'FeatureCollection', features: [{
    type: 'Feature',
    geometry: { type: 'LineString', coordinates },
    properties: {
      summary: { distance: 1250, duration: 910 },
      way_points: [0, last],
      extras: { waytype: { values: [[0, last, 1]] } }
    }
  }] };
}

(async () => {
  let browser = null;
  let browserChannel = 'msedge';
  let edgeLaunchError = null;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
  } catch (error) {
    edgeLaunchError = String(error).split('\n')[0];
    browserChannel = 'chrome';
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  }

  const context = await browser.newContext();
  const requests = [];
  let phase = 'startup';
  await context.route('**/*', async route => {
    const request = route.request();
    const url = request.url();
    if (url === 'https://app.invalid/') {
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: bytes });
    }
    if (url.endsWith('/info') && request.method() === 'GET') {
      requests.push({ phase, provider: 'graphhopper', kind: 'info', method: request.method(), url });
      return route.fulfill({ status: 200, contentType: 'application/json', body: json({
        profiles: ['hiking', 'hiking_easy', 'mtb_touring', 'mtb_trail'].map(name => ({ name })),
        bbox: [-180, -90, 180, 90]
      }) });
    }
    if (url.endsWith('/ors/status') && request.method() === 'GET') {
      requests.push({ phase, provider: 'ors', kind: 'status', method: request.method(), url });
      return route.fulfill({ status: 200, contentType: 'application/json', body: json({
        status: 'ready', secret: 'PRESENT', profiles: ['foot-hiking', 'foot-walking', 'cycling-mountain']
      }) });
    }
    if (url.endsWith('/route') && request.method() === 'POST') {
      let body = null;
      try { body = JSON.parse(request.postData()); } catch (_) {}
      requests.push({ phase, provider: 'graphhopper', kind: 'route', method: request.method(), url, body });
      return route.fulfill({ status: 200, contentType: 'application/json', body: json(graphhopperResponse(body?.points || [])) });
    }
    if (url.includes('/ors/v2/directions/') && request.method() === 'POST') {
      let body = null;
      try { body = JSON.parse(request.postData()); } catch (_) {}
      requests.push({ phase, provider: 'ors', kind: 'route', method: request.method(), url, body });
      return route.fulfill({ status: 200, contentType: 'application/json', body: json(orsResponse(body?.coordinates || [])) });
    }
    requests.push({ phase, provider: 'other', kind: 'blocked', method: request.method(), url });
    return route.abort();
  });

  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto('https://app.invalid/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluate(() => openRoutingPlannerPanel('graphhopper'));
    await page.waitForSelector('#routingPlannerPanel[open]');
    await page.locator('#routingProfileSelect').selectOption('hiking');
    await page.evaluate(({ O, S, T }) => {
      const r = state._routing;
      const [start, end] = r.points;
      routingSetPointCoordinates(start.id, O.lat, O.lon, 'map');
      routingSetPointCoordinates(end.id, T.lat, T.lon, 'map');
      const profile = routingGetSelectedGraphhopperProfile();
      const provider = routingProviderNormalize(r.provider);
      Object.assign(start, {
        snapLat: S.lat, snapLon: S.lon, snapDeltaM: 150, snapStatus: 'confirmed',
        snapSource: 'nearest', snapCheckedProfile: profile, snapCheckedProvider: provider,
        snapCheckedAt: Date.now()
      });
      Object.assign(end, {
        snapLat: T.lat, snapLon: T.lon, snapDeltaM: 0, snapStatus: 'verified',
        snapSource: 'nearest', snapCheckedProfile: profile, snapCheckedProvider: provider,
        snapCheckedAt: Date.now()
      });
      routingSyncPointsFeedback();
      routingRenderList();
      routingSyncCalculateBtnUi();
      routingSyncCompareUi();
    }, { O, S, T });

    phase = 'compare';
    await page.locator('#routingCompareBtn').click();
    await page.waitForFunction(() => !_routingCompareSession.loading, null, { timeout: 30000 });

    const ui = await page.evaluate(() => ({
      points: state._routing.points.map(point => ({ lat: point.lat, lon: point.lon, snapLat: point.snapLat, snapLon: point.snapLon, snapDeltaM: point.snapDeltaM, snapStatus: point.snapStatus })),
      snapshotPoints: _routingCompareSession.snapshot?.points || null,
      ghStatus: _routingCompareSession.gh?.status || null,
      ghError: _routingCompareSession.gh?.errKey || null,
      ghPreviewStart: _routingCompareSession.gh?.previewCoordinates?.[0] || null,
      orsStatus: _routingCompareSession.ors?.status || null,
      orsError: _routingCompareSession.ors?.errKey || null,
      orsPreviewStart: _routingCompareSession.ors?.previewCoordinates?.[0] || null,
      compareStatusText: document.querySelector('#routingCompareStatus')?.innerText || '',
      plannerStatusText: document.querySelector('#routingPlannerStatus')?.innerText || '',
      pointsFeedbackText: document.querySelector('#routingPointsFeedback')?.innerText || '',
      pointsListText: document.querySelector('#routingPointsList')?.innerText || '',
      ghPanelText: document.querySelector('#routingCompareGhBody')?.innerText || '',
      orsPanelText: document.querySelector('#routingCompareOrsBody')?.innerText || '',
      chooseGhEnabled: !document.querySelector('#routingCompareChooseGh')?.disabled,
      chooseOrsEnabled: !document.querySelector('#routingCompareChooseOrs')?.disabled
    }));

    const ghPost = requests.find(item => item.provider === 'graphhopper' && item.kind === 'route');
    const orsPost = requests.find(item => item.provider === 'ors' && item.kind === 'route');
    const ghPoints = ghPost?.body?.points || [];
    const orsPoints = orsPost?.body?.coordinates || [];
    const pointStartsAtS = points => points.length >= 2 && close(points[0][0], S.lon) && close(points[0][1], S.lat);
    const pointEndsAtT = points => points.length >= 2 && close(points[1][0], T.lon) && close(points[1][1], T.lat);
    const ghUsesS = pointStartsAtS(ghPoints);
    const orsUsesS = pointStartsAtS(orsPoints);
    const originalsPreserved = ui.points.length >= 2 &&
      close(ui.points[0].lat, O.lat) && close(ui.points[0].lon, O.lon) &&
      close(ui.points[1].lat, T.lat) && close(ui.points[1].lon, T.lon);
    const snapsPreserved = ui.points[0]?.snapStatus === 'confirmed' &&
      close(ui.points[0].snapLat, S.lat) && close(ui.points[0].snapLon, S.lon) &&
      ui.points[0]?.snapDeltaM === 150;
    const providerResultsPass = ui.ghStatus === 'pass' && ui.orsStatus === 'pass';
    const passed = providerResultsPass && requests.filter(item => item.kind === 'route').length === 2 &&
      ghUsesS && orsUsesS && pointEndsAtT(ghPoints) && pointEndsAtT(orsPoints) && originalsPreserved && snapsPreserved &&
      ui.chooseGhEnabled && ui.chooseOrsEnabled && pageErrors.length === 0;

    const output = {
      candidate: app,
      sha256: sha,
      browser: browserChannel,
      edgeLaunchError,
      networkPolicy: 'The app was fulfilled from the candidate bytes. Provider info and both route APIs used deterministic mocks; all other requests were blocked.',
      coordinates: { originalO: O, confirmedSnapS: S, targetT: T, OtoS_m: 150.0000003151764 },
      expectation: 'Both comparison requests should use confirmed S while the stored original remains O.',
      passed,
      checks: { ghUsesS, orsUsesS, ghEndsAtT: pointEndsAtT(ghPoints), orsEndsAtT: pointEndsAtT(orsPoints), originalsPreserved, snapsPreserved, providerResultsPass },
      ui,
      mockedProviderRequests: requests.filter(item => item.kind === 'info' || item.kind === 'status' || item.kind === 'route'),
      blockedOtherRequests: requests.filter(item => item.kind === 'blocked').length,
      pageErrors
    };
    fs.writeFileSync(__dirname + '/qa-compare-snap-anchor-277-results.json', json(output, null, 2));
    console.log(json({ passed, browser: browserChannel, edgeLaunchError, checks: output.checks, ghRequestPointsLonLat: ghPoints, orsRequestPointsLonLat: orsPoints, ghStatus: ui.ghStatus, orsStatus: ui.orsStatus, compareStatusText: ui.compareStatusText, pageErrors }, null, 2));
    if (!passed) process.exitCode = 1;
  } finally {
    await context.close();
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
