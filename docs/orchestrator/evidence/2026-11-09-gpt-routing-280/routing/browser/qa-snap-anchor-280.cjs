const fs = require('fs');
const crypto = require('crypto');
const { chromium } = require('C:/goi-pw-probe/node_modules/playwright');

const app = 'C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/gpt-resume-20261109/candidate-280-1e6c11cf.html';
const expectedSha = '1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a';
const APP_URL = 'https://ionos-n8n-new.tailc01234.ts.net/';
const bytes = fs.readFileSync(app);
const sha = crypto.createHash('sha256').update(bytes).digest('hex');
if (sha !== expectedSha) throw new Error(`Unexpected candidate SHA: ${sha}`);

const O = { lat: 44.1024, lon: 9.8236 };
const S = { lat: O.lat + 150 / 111195.08, lon: O.lon };
const T = { lat: 44.107, lon: 9.829 };
const R = { lat: S.lat, lon: S.lon + 0.0016 };
const json = JSON.stringify;
function haversineMeters(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const la1 = a.lat * rad, la2 = b.lat * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371008.8 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function routeResponse(snappedStart) {
  return {
    paths: [{
      distance: 1200,
      time: 900000,
      points: { type: 'LineString', coordinates: [[snappedStart.lon, snappedStart.lat], [T.lon, T.lat]] },
      snapped_waypoints: { type: 'LineString', coordinates: [[snappedStart.lon, snappedStart.lat], [T.lon, T.lat]] },
      details: { road_environment: [[0, 1, 'road']] }
    }]
  };
}

async function runScenario(browser, scenario) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const records = [];
  let phase = 'startup';
  await context.route('**/*', async route => {
    const request = route.request();
    const url = request.url();
    if (url === APP_URL) {
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: bytes });
    }
    if (url.endsWith('/info')) {
      records.push({ phase, method: request.method(), kind: 'info', url });
      return route.fulfill({ status: 200, contentType: 'application/json', body: json({
        profiles: ['hiking', 'hiking_easy', 'mtb_touring', 'mtb_trail'].map(name => ({ name })),
        bbox: [-180, -90, 180, 90]
      }) });
    }
    if (url.includes('/nearest?')) {
      records.push({ phase, method: request.method(), kind: 'nearest', url });
      const point = new URL(url).searchParams.get('point').split(',').map(Number);
      return route.fulfill({ status: 200, contentType: 'application/json', body: json({ coordinates: [point[1], point[0]], distance: 0 }) });
    }
    if (url.endsWith('/route') && request.method() === 'POST') {
      let body = null;
      try { body = JSON.parse(request.postData()); } catch (_) {}
      records.push({ phase, method: request.method(), kind: 'route', url, body });
      return route.fulfill({ status: 200, contentType: 'application/json', body: json(routeResponse(scenario === 'valid' ? S : R)) });
    }
    records.push({ phase, method: request.method(), kind: 'blocked', url });
    return route.abort();
  });

  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  try {
    await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
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
      r.infoCache = { bbox: [-180, -90, 180, 90], profiles: null, fetchedAt: Date.now(), provider };
      routingSyncCalculateBtnUi();
    }, { O, S, T });
    phase = 'action';
    await page.locator('#routingCalculateBtn').click();
    await page.waitForFunction(() => !state._routing.requestLoading && !state._routing.infoLoading, null, { timeout: 30000 });

    const observation = await page.evaluate(() => ({
      originals: state._routing.points.map(point => ({ lat: point.lat, lon: point.lon })),
      anchor: { lat: state._routing.points[0].snapLat, lon: state._routing.points[0].snapLon, deltaM: state._routing.points[0].snapDeltaM },
      preview: Array.isArray(state._routing.previewCoordinates) && state._routing.previewCoordinates.length >= 2,
      routeError: state._routing.routeError || null,
      status: document.querySelector('#routingPlannerStatus')?.innerText || ''
    }));
    const routePosts = records.filter(record => record.kind === 'route');
    const postPoints = routePosts[0]?.body?.points || [];
    const close = (a, b) => Math.abs(Number(a) - Number(b)) < 1e-9;
    const usedS = postPoints.length >= 2 && close(postPoints[0][0], S.lon) && close(postPoints[0][1], S.lat);
    const keptOriginals = observation.originals.length >= 2 &&
      close(observation.originals[0].lat, O.lat) && close(observation.originals[0].lon, O.lon) &&
      close(observation.originals[1].lat, T.lat) && close(observation.originals[1].lon, T.lon);
    const snapStillS = close(observation.anchor.lat, S.lat) && close(observation.anchor.lon, S.lon);
    const anchorDistanceFromO = haversineMeters(O, S);
    const responseSnap = scenario === 'valid' ? S : R;
    const responseSnapDistanceFromS = haversineMeters(S, responseSnap);
    const noUnneededPreflight = records.every(record => record.kind !== 'info' && record.kind !== 'nearest');
    const passed = routePosts.length === 1 && usedS && keptOriginals && snapStillS &&
      anchorDistanceFromO >= 149 && anchorDistanceFromO <= 151 && noUnneededPreflight &&
      (scenario === 'valid'
        ? observation.preview && !observation.routeError
        : responseSnapDistanceFromS > 50 && !observation.preview && observation.routeError === 'routing.landSnapFar');

    return {
      scenario,
      passed,
      originalO: O,
      requestedAnchorS: S,
      anchorDistanceFromO_m: anchorDistanceFromO,
      responseSnap,
      responseSnapDistanceFromS_m: responseSnapDistanceFromS,
      postedPointsLonLat: postPoints,
      originalCoordinatesPreserved: keptOriginals,
      anchorPreserved: snapStillS,
      noUnneededInfoOrNearestRequests: noUnneededPreflight,
      preview: observation.preview,
      routeError: observation.routeError,
      status: observation.status,
      providerRequests: records.map(({ phase, method, kind, url }) => ({ phase, method, kind, url })),
      pageErrors
    };
  } finally {
    await context.close();
  }
}

(async () => {
  const channel = 'chromium-1234';
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe' });
  try {
    const results = [];
    results.push(await runScenario(browser, 'valid'));
    results.push(await runScenario(browser, 'far-route-snap'));
    const output = {
      candidate: app,
      sha256: sha,
      browser: `${channel} via Playwright channel ${channel}`,
      policy: 'The HTML and every network request were intercepted; only deterministic mock responses were used.',
      results
    };
    fs.writeFileSync(__dirname + '/qa-snap-anchor-280-results.json', json(output, null, 2));
    console.log(json(results.map(({ scenario, passed, postedPointsLonLat, originalCoordinatesPreserved, anchorPreserved, preview, routeError, responseSnapDistanceFromS_m, pageErrors }) => ({
      scenario, passed, postedPointsLonLat, originalCoordinatesPreserved, anchorPreserved, preview, routeError, responseSnapDistanceFromS_m, pageErrors
    })), null, 2));
    if (results.some(result => !result.passed)) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
