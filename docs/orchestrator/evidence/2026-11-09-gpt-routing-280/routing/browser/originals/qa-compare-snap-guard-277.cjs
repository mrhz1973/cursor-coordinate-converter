const fs = require('fs');
const crypto = require('crypto');
const { chromium } = require('C:/goi-pw-probe/node_modules/playwright');

const app = 'C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/routing-merge-276/routing-candidate-277-compare-snap.html';
const expectedSha = '97cf82211799cb107b3c3fa44bc461783cd2485a221cb6c10fbc478f40c61b60';
const bytes = fs.readFileSync(app);
const sha = crypto.createHash('sha256').update(bytes).digest('hex');
if (sha !== expectedSha) throw new Error(`Unexpected candidate SHA: ${sha}`);

const O = { lat: 44.1024, lon: 9.8236 };
const S = { lat: O.lat + 150 / 111195.08, lon: O.lon };
const T = { lat: 44.107, lon: 9.829 };
const R = { lat: S.lat, lon: S.lon + 0.0016 };
const json = JSON.stringify;
const close = (a, b) => Math.abs(Number(a) - Number(b)) < 1e-9;
function haversineMeters(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const la1 = a.lat * rad, la2 = b.lat * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371008.8 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function makeGhResponse(points) {
  const coordinates = points.map(point => point.map(Number));
  return { paths: [{
    distance: 1200, time: 900000,
    points: { type: 'LineString', coordinates },
    snapped_waypoints: { type: 'LineString', coordinates },
    details: { road_environment: [[0, coordinates.length - 1, 'road']] }
  }] };
}

function makeOrsResponse(points, scenario) {
  const coordinates = points.map(point => point.map(Number));
  if (scenario === 'ors-far') coordinates[0] = [R.lon, R.lat];
  const last = coordinates.length - 1;
  return { type: 'FeatureCollection', features: [{
    type: 'Feature', geometry: { type: 'LineString', coordinates },
    properties: {
      summary: { distance: 1250, duration: 910 },
      way_points: [0, last],
      extras: { waytype: { values: [[0, last, 1]] } }
    }
  }] };
}

async function runScenario(browser, scenario) {
  const context = await browser.newContext();
  const requests = [];
  let phase = 'startup';
  await context.route('**/*', async route => {
    const request = route.request();
    const url = request.url();
    if (url === 'https://app.invalid/')
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: bytes });
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
      return route.fulfill({ status: 200, contentType: 'application/json', body: json(makeGhResponse(body?.points || [])) });
    }
    if (url.includes('/ors/v2/directions/') && request.method() === 'POST') {
      let body = null;
      try { body = JSON.parse(request.postData()); } catch (_) {}
      requests.push({ phase, provider: 'ors', kind: 'route', method: request.method(), url, body });
      return route.fulfill({ status: 200, contentType: 'application/json', body: json(makeOrsResponse(body?.coordinates || [], scenario)) });
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
    const setup = await page.evaluate(({ O, S, T, scenario }) => {
      const r = state._routing;
      const [start, end] = r.points;
      routingSetPointCoordinates(start.id, O.lat, O.lon, 'map');
      routingSetPointCoordinates(end.id, T.lat, T.lon, 'map');
      const profile = routingGetSelectedGraphhopperProfile();
      const provider = routingProviderNormalize(r.provider);
      let startStatus = scenario === 'confirm-required' ? 'confirm-required'
        : scenario === 'stale' ? 'stale' : 'confirmed';
      let checkedProfile = profile;
      let checkedProvider = provider;
      if (scenario === 'mismatch-profile') checkedProfile = 'mtb_trail';
      if (scenario === 'mismatch-provider') checkedProvider = provider === 'vps' ? 'local' : 'vps';
      Object.assign(start, {
        snapLat: S.lat, snapLon: S.lon, snapDeltaM: 150, snapStatus: startStatus,
        snapSource: 'nearest', snapCheckedProfile: checkedProfile, snapCheckedProvider: checkedProvider,
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
      return { profile, provider, startStatus, checkedProfile, checkedProvider };
    }, { O, S, T, scenario });

    phase = 'compare';
    await page.locator('#routingCompareBtn').click();
    await page.waitForFunction(() => !_routingCompareSession.loading, null, { timeout: 30000 });

    const ui = await page.evaluate(() => ({
      points: state._routing.points.map(point => ({ lat: point.lat, lon: point.lon, snapLat: point.snapLat, snapLon: point.snapLon, snapDeltaM: point.snapDeltaM, snapStatus: point.snapStatus, snapCheckedProfile: point.snapCheckedProfile, snapCheckedProvider: point.snapCheckedProvider })),
      snapshotPoints: _routingCompareSession.snapshot?.points || null,
      routePoints: _routingCompareSession.snapshot?.routePoints || null,
      ghStatus: _routingCompareSession.gh?.status || null,
      ghError: _routingCompareSession.gh?.errKey || null,
      ghPreviewStart: _routingCompareSession.gh?.previewCoordinates?.[0] || null,
      orsStatus: _routingCompareSession.ors?.status || null,
      orsError: _routingCompareSession.ors?.errKey || null,
      orsPreviewStart: _routingCompareSession.ors?.previewCoordinates?.[0] || null,
      compareStatusText: document.querySelector('#routingCompareStatus')?.innerText || '',
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
    const usesAnchor = points => points.length >= 2 && close(points[0][0], S.lon) && close(points[0][1], S.lat);
    const usesOriginal = points => points.length >= 2 && close(points[0][0], O.lon) && close(points[0][1], O.lat);
    const endsAtTarget = points => points.length >= 2 && close(points[1][0], T.lon) && close(points[1][1], T.lat);
    const originalsPreserved = ui.points.length >= 2 &&
      close(ui.points[0].lat, O.lat) && close(ui.points[0].lon, O.lon) &&
      close(ui.points[1].lat, T.lat) && close(ui.points[1].lon, T.lon);
    const confirmedAnchorPreserved = close(ui.points[0]?.snapLat, S.lat) && close(ui.points[0]?.snapLon, S.lon) && ui.points[0]?.snapDeltaM === 150;
    const staleStatusPreserved = ui.points[0]?.snapStatus === 'stale';
    const anchorDistanceFromO = haversineMeters(O, S);
    const orsFarResponseDistanceFromS = haversineMeters(S, R);
    const routePosts = requests.filter(item => item.kind === 'route');

    let passed = false;
    if (scenario === 'confirmed-match') {
      passed = ui.ghStatus === 'pass' && ui.orsStatus === 'pass' && routePosts.length === 2 &&
        usesAnchor(ghPoints) && usesAnchor(orsPoints) && endsAtTarget(ghPoints) && endsAtTarget(orsPoints) &&
        originalsPreserved && confirmedAnchorPreserved && anchorDistanceFromO >= 149 && anchorDistanceFromO <= 151 &&
        setup.profile === setup.checkedProfile && setup.provider === setup.checkedProvider && ui.chooseGhEnabled && ui.chooseOrsEnabled;
    } else if (scenario === 'mismatch-profile' || scenario === 'mismatch-provider') {
      passed = routePosts.length === 0 && ui.ghStatus === 'fail' && ui.orsStatus === 'fail' &&
        ui.ghError === 'routing.snapStale' && ui.orsError === 'routing.snapStale' &&
        !ui.chooseGhEnabled && !ui.chooseOrsEnabled && originalsPreserved &&
        (scenario === 'mismatch-profile' ? setup.checkedProfile !== setup.profile : setup.checkedProvider !== setup.provider);
    } else if (scenario === 'confirm-required') {
      passed = routePosts.length === 0 && ui.ghStatus === 'fail' && ui.orsStatus === 'fail' &&
        ui.ghError === 'routing.snapBlocked' && ui.orsError === 'routing.snapBlocked' &&
        !ui.chooseGhEnabled && !ui.chooseOrsEnabled && originalsPreserved && ui.points[0]?.snapStatus === 'confirm-required';
    } else if (scenario === 'stale') {
      passed = ui.ghStatus === 'pass' && ui.orsStatus === 'pass' && routePosts.length === 2 &&
        usesOriginal(ghPoints) && usesOriginal(orsPoints) && !usesAnchor(ghPoints) && !usesAnchor(orsPoints) && originalsPreserved && staleStatusPreserved;
    } else if (scenario === 'ors-far') {
      passed = ui.ghStatus === 'pass' && ui.orsStatus === 'fail' && ui.orsError === 'routing.landSnapFar' &&
        routePosts.length === 2 && usesAnchor(ghPoints) && usesAnchor(orsPoints) &&
        orsFarResponseDistanceFromS > 50 && ui.chooseGhEnabled && !ui.chooseOrsEnabled && originalsPreserved && confirmedAnchorPreserved;
    }
    passed = passed && pageErrors.length === 0;

    return {
      scenario, passed, setup, requestPointsLonLat: { graphhopper: ghPoints, ors: orsPoints },
      distancesMeters: { originalOtoConfirmedS: anchorDistanceFromO, orsResponseRtoS: orsFarResponseDistanceFromS },
      requestCounts: { info: requests.filter(item => item.kind === 'info').length, ghPost: requests.filter(item => item.provider === 'graphhopper' && item.kind === 'route').length, orsPost: requests.filter(item => item.provider === 'ors' && item.kind === 'route').length },
      checks: { ghUsesS: usesAnchor(ghPoints), orsUsesS: usesAnchor(orsPoints), ghUsesO: usesOriginal(ghPoints), orsUsesO: usesOriginal(orsPoints), ghEndsAtT: endsAtTarget(ghPoints), orsEndsAtT: endsAtTarget(orsPoints), originalsPreserved, confirmedAnchorPreserved, staleStatusPreserved },
      ui, providerRequests: requests.filter(item => item.kind === 'info' || item.kind === 'status' || item.kind === 'route'),
      blockedOtherRequests: requests.filter(item => item.kind === 'blocked').length, pageErrors
    };
  } finally {
    await context.close();
  }
}

(async () => {
  let browser = null;
  let browserChannel = 'msedge';
  let edgeLaunchError = null;
  try { browser = await chromium.launch({ headless: true, channel: 'msedge' }); }
  catch (error) {
    edgeLaunchError = String(error).split('\n')[0];
    browserChannel = 'chrome';
    browser = await chromium.launch({ headless: true, channel: 'chrome' });
  }
  try {
    const scenarios = ['confirmed-match', 'mismatch-profile', 'mismatch-provider', 'confirm-required', 'stale', 'ors-far'];
    const results = [];
    for (const scenario of scenarios) results.push(await runScenario(browser, scenario));
    const output = {
      candidate: app, sha256: sha, browser: browserChannel, edgeLaunchError,
      networkPolicy: 'The candidate HTML was served from bytes; provider info and route APIs were deterministic mocks; other network requests were blocked.',
      coordinates: { originalO: O, confirmedSnapS: S, targetT: T, orsFarResponseR: R },
      results
    };
    fs.writeFileSync(__dirname + '/qa-compare-snap-guard-277-results.json', json(output, null, 2));
    console.log(json(results.map(({ scenario, passed, requestPointsLonLat, distancesMeters, requestCounts, checks, ui, pageErrors }) => ({
      scenario, passed, requestPointsLonLat, distancesMeters, requestCounts, checks,
      ghStatus: ui.ghStatus, ghError: ui.ghError, orsStatus: ui.orsStatus, orsError: ui.orsError,
      chooseGhEnabled: ui.chooseGhEnabled, chooseOrsEnabled: ui.chooseOrsEnabled,
      compareStatusText: ui.compareStatusText, pageErrors
    })), null, 2));
    if (results.some(result => !result.passed)) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
