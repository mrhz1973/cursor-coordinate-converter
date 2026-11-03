const fs = require('node:fs');
const crypto = require('node:crypto');
const { chromium } = require('C:/goi-pw-probe/node_modules/playwright');

const appPath = 'C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html';
const expectedSha256 = '32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28';
const appUrl = 'https://app.invalid/';
const coordinates = [[9.8236, 44.1024], [9.829, 44.107]]; // lon, lat; public synthetic land pair
const cases = [
  { provider: 'GraphHopper', profile: 'hiking' },
  { provider: 'ORS', profile: 'foot-hiking' },
];

const appBytes = fs.readFileSync(appPath);
const runtimeSha256 = crypto.createHash('sha256').update(appBytes).digest('hex');
if (runtimeSha256 !== expectedSha256) throw new Error('Runtime SHA mismatch; probe stopped.');

function endpointFor(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.hostname === 'graphhopper.com' && url.pathname === '/api/1/route') {
      return { provider: 'GraphHopper', endpoint: '/api/1/route' };
    }
    if (url.hostname === 'api.openrouteservice.org' && /^\/v2\/directions\/[a-z0-9-]+\/geojson$/.test(url.pathname)) {
      return { provider: 'ORS', endpoint: '/v2/directions/{profile}/geojson' };
    }
  } catch { /* malformed or non-HTTP request: deny */ }
  return null;
}

function metersBetween(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length < 2 || b.length < 2) return Infinity;
  const rad = n => n * Math.PI / 180;
  const dLat = rad(b[1] - a[1]), dLon = rad(b[0] - a[0]);
  const lat1 = rad(a[1]), lat2 = rad(b[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function inspectDetails(provider, data) {
  if (provider === 'GraphHopper') {
    const path = data?.paths?.[0];
    const coords = path?.points?.coordinates;
    const snapped = path?.snapped_waypoints?.coordinates;
    const intervals = path?.details?.road_environment;
    const detailsComplete = Array.isArray(intervals) && intervals.length > 0 && Array.isArray(coords) &&
      intervals[0]?.[0] === 0 && intervals[intervals.length - 1]?.[1] >= coords.length - 1;
    const ferryDetected = Array.isArray(intervals) && intervals.some(x => String(x?.[2]).toUpperCase() === 'FERRY');
    const snapValid = Array.isArray(snapped) && snapped.length >= 2 &&
      metersBetween(coordinates[0], snapped[0]) <= 1000 &&
      metersBetween(coordinates[1], snapped[snapped.length - 1]) <= 1000;
    return {
      distance_m: Number.isFinite(path?.distance) ? Math.round(path.distance) : null,
      duration_s: Number.isFinite(path?.time) ? Math.round(path.time / 1000) : null,
      geometryPointCount: Array.isArray(coords) ? coords.length : 0,
      detailsComplete, ferryDetected, snapValid,
    };
  }

  const feature = data?.features?.[0];
  const props = feature?.properties;
  const coords = feature?.geometry?.coordinates;
  const intervals = props?.extras?.waytype?.values;
  const detailsComplete = Array.isArray(intervals) && intervals.length > 0 && Array.isArray(coords) &&
    intervals[0]?.[0] === 0 && intervals[intervals.length - 1]?.[1] >= coords.length - 1;
  const ferryDetected = Array.isArray(intervals) && intervals.some(x => Number(x?.[2]) === 9);
  const snapValid = Array.isArray(coords) && coords.length >= 2 &&
    metersBetween(coordinates[0], coords[0]) <= 1000 &&
    metersBetween(coordinates[1], coords[coords.length - 1]) <= 1000;
  const summary = props?.summary;
  return {
    distance_m: Number.isFinite(summary?.distance) ? Math.round(summary.distance) : null,
    duration_s: Number.isFinite(summary?.duration) ? Math.round(summary.duration) : null,
    geometryPointCount: Array.isArray(coords) ? coords.length : 0,
    detailsComplete, ferryDetected, snapValid,
  };
}

function requestConstrained(provider, postData) {
  try {
    const body = JSON.parse(postData || '{}');
    if (provider === 'GraphHopper') {
      return body['ch.disable'] === true && body.snap_preventions?.includes('ferry') &&
        body.details?.includes('road_environment') &&
        body.custom_model?.priority?.some(x => x.if === 'road_environment == FERRY' && x.multiply_by === '0');
    }
    return body.options?.avoid_features?.includes('ferries') && body.extra_info?.includes('waytype');
  } catch { return false; }
}

function appState(page) {
  return page.evaluate(() => ({
    preview: typeof state !== 'undefined' && !!state._routing?.previewCoordinates,
    saveEnabled: !!document.querySelector('#routingSaveAsTrackBtn') && !document.querySelector('#routingSaveAsTrackBtn').disabled,
    resultCardVisible: !!document.querySelector('#routingResultCard') && !document.querySelector('#routingResultCard').hidden,
    selectedProfile: document.querySelector('#routingProfileSelect')?.value || null,
  }));
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
  });
  const results = [];
  let blockedOther = 0;
  let blockedProviderMetadata = 0;
  let hardStop = null;
  try {
    for (const testCase of cases) {
      if (hardStop) break;
      const context = await browser.newContext();
      const page = await context.newPage();
      const routeRequests = [];
      let pageErrors = 0;
      page.on('pageerror', () => { pageErrors++; });
      await context.route('**/*', async route => {
        const request = route.request();
        const rawUrl = request.url();
        if (rawUrl === appUrl) {
          return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: appBytes });
        }
        const allowed = endpointFor(rawUrl);
        if (allowed && request.method() === 'POST') {
          routeRequests.push({ ...allowed, constrained: requestConstrained(allowed.provider, request.postData()) });
          return route.continue();
        }
        try {
          const url = new URL(rawUrl);
          if ((url.hostname === 'graphhopper.com' || url.hostname === 'api.openrouteservice.org') &&
              /\/(info|nearest|status)(\/|$)/.test(url.pathname)) blockedProviderMetadata++;
          else blockedOther++;
        } catch { blockedOther++; }
        return route.abort('blockedbyclient').catch(() => {});
      });

      const pageErrorsAtStart = pageErrors;
      const result = {
        provider: testCase.provider,
        profile: testCase.profile,
        endpoint: testCase.provider === 'GraphHopper' ? '/api/1/route' : '/v2/directions/{profile}/geojson',
        runtimeSha256,
        actionIssued: false,
        requestObserved: false,
        httpStatus: null,
        requestConstrained: false,
        route: null,
        ui: null,
        pageErrorCount: null,
        outcome: null,
      };
      try {
        await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(400);
        await page.evaluate(provider => openRoutingPlannerPanel(provider === 'GraphHopper' ? 'graphhopper' : 'ors'), testCase.provider);
        await page.waitForSelector('#routingPlannerPanel[open]', { timeout: 10000 });
        const profileOptionExists = await page.locator('#routingProfileSelect option').evaluateAll((options, value) => options.some(o => o.value === value), testCase.profile);
        if (!profileOptionExists) {
          result.outcome = 'PROFILE_UNAVAILABLE_IN_CURRENT_APP_CONFIGURATION';
          result.ui = await appState(page);
          result.pageErrorCount = pageErrors - pageErrorsAtStart;
          results.push(result);
          hardStop = 'profile unavailable without allowing provider metadata calls';
          await context.close();
          break;
        }
        await page.locator('#routingProfileSelect').selectOption(testCase.profile);
        await page.evaluate(coords => {
          const routing = typeof state !== 'undefined' ? state._routing : null;
          if (!routing?.points || routing.points.length < 2) throw new Error('Two route points are unavailable.');
          coords.forEach(([lon, lat], i) => routingSetPointCoordinates(routing.points[i].id, lat, lon, 'map'));
          routingSyncCalculateBtnUi();
        }, coordinates);
        await page.waitForTimeout(250);
        const beforeAction = routeRequests.length;
        const responsePromise = page.waitForResponse(response => !!endpointFor(response.url()), { timeout: 20000 }).catch(() => null);
        await page.locator('#routingCalculateBtn').click();
        result.actionIssued = true;
        const response = await responsePromise;
        if (!response) {
          result.outcome = beforeAction === routeRequests.length ? 'NO_PROVIDER_ROUTE_REQUEST_AFTER_UI_ACTION' : 'PROVIDER_REQUEST_WITHOUT_OBSERVED_RESPONSE';
          result.ui = await appState(page);
          result.pageErrorCount = pageErrors - pageErrorsAtStart;
          results.push(result);
          hardStop = 'no bounded provider response observed; no retries';
          await context.close();
          break;
        }

        const provider = endpointFor(response.url());
        const status = response.status();
        const req = routeRequests[beforeAction];
        result.requestObserved = true;
        result.httpStatus = status;
        result.requestConstrained = !!req?.constrained;

        if ([401, 402, 403, 429].includes(status)) {
          result.outcome = [401, 403].includes(status) ? 'AUTHORIZATION_FAILURE' : 'QUOTA_OR_BILLING_LIMIT';
          result.pageErrorCount = pageErrors - pageErrorsAtStart;
          results.push(result);
          hardStop = result.outcome;
          await context.close();
          break;
        }
        if (status < 200 || status >= 300) {
          result.outcome = 'PROVIDER_HTTP_FAILURE_NO_RETRY';
          result.pageErrorCount = pageErrors - pageErrorsAtStart;
          results.push(result);
          hardStop = 'non-success provider response; no retries';
          await context.close();
          break;
        }

        let data = null;
        try { data = await response.json(); } catch { /* summary remains incomplete */ }
        result.route = inspectDetails(provider.provider, data || {});
        await page.waitForTimeout(1000);
        result.ui = await appState(page);
        result.pageErrorCount = pageErrors - pageErrorsAtStart;
        const routeValid = result.requestConstrained && result.route.detailsComplete && result.route.snapValid &&
          !result.route.ferryDetected && result.ui.preview && result.ui.saveEnabled;
        result.outcome = routeValid ? 'PASS' : 'FAIL_CLOSED_OR_PROVIDER_DETAILS_INCOMPLETE';
        results.push(result);
      } catch {
        result.outcome = 'UI_PROBE_ERROR_REDACTED';
        result.pageErrorCount = pageErrors - pageErrorsAtStart;
        results.push(result);
        hardStop = 'UI probe could not safely complete; no retries';
      } finally {
        await context.close().catch(() => {});
      }
    }
  } finally {
    await browser.close();
  }

  const report = {
    status: results.length === cases.length && results.every(x => x.outcome === 'PASS') ? 'PASS_SCOPED' : 'NON_VERIFICATO',
    runtimeSha256,
    networkPolicy: 'Browser requests intercepted; only POST route endpoints on graphhopper.com and api.openrouteservice.org were permitted. Provider metadata, map tiles, elevation, fonts and every other host were blocked. No URL query strings or headers were captured.',
    inputs: { type: 'public synthetic coordinates', count: 2, coordinatePair: coordinates },
    blockedRequests: { providerMetadata: blockedProviderMetadata, other: blockedOther },
    hardStop: hardStop || null,
    results,
  };
  fs.writeFileSync(__dirname + '/result.json', JSON.stringify(report, null, 2) + '\n', { encoding: 'utf8', flag: 'w' });
  console.log(JSON.stringify({ status: report.status, runtimeSha256, hardStop: report.hardStop, results: results.map(({ provider, profile, endpoint, httpStatus, requestConstrained, route, ui, outcome }) => ({ provider, profile, endpoint, httpStatus, requestConstrained, route, ui, outcome })) }, null, 2));
  if (report.status !== 'PASS_SCOPED') process.exitCode = 1;
})().catch(() => {
  console.error('Provider runtime probe stopped with a redacted runner failure.');
  process.exitCode = 1;
});
