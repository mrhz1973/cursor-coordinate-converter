const fs = require('node:fs');
const crypto = require('node:crypto');
const { chromium } = require('C:/goi-pw-probe/node_modules/playwright');

const appPath = 'C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html';
const expectedSha256 = '32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28';
const appBase = 'http://100.99.54.93:8000/coordinate_converter%20Claude.html';
const appUrl = `${appBase}?qa_probe=tailnet_${Date.now()}`;
const coordinates = [[9.8236, 44.1024], [9.829, 44.107]]; // [lon, lat], public synthetic pair
const cases = [
  { provider: 'GraphHopper', appProvider: 'graphhopper', profile: 'hiking' },
  { provider: 'ORS', appProvider: 'ors', profile: 'foot-hiking' },
];

const appBytes = fs.readFileSync(appPath);
const runtimeSha256 = crypto.createHash('sha256').update(appBytes).digest('hex');
if (runtimeSha256 !== expectedSha256) throw new Error('Runtime SHA mismatch; live probe stopped.');

function endpointFor(rawUrl, method) {
  try {
    const u = new URL(rawUrl);
    if (u.protocol === 'http:' && u.hostname === '100.99.54.93' && u.port === '8989') {
      if (u.pathname === '/nearest' && ['GET', 'OPTIONS'].includes(method)) return { provider: 'GraphHopper', endpoint: '/nearest' };
      if (u.pathname === '/info' && ['GET', 'OPTIONS'].includes(method)) return { provider: 'GraphHopper', endpoint: '/info' };
      if (u.pathname === '/route' && ['POST', 'OPTIONS'].includes(method)) return { provider: 'GraphHopper', endpoint: '/route' };
    }
    if (u.protocol === 'https:' && u.hostname === 'ionos-n8n-new.tailc01234.ts.net' && (u.port === '' || u.port === '443')) {
      if (u.pathname === '/ors/status' && ['GET', 'OPTIONS'].includes(method)) return { provider: 'ORS', endpoint: '/ors/status' };
      if (u.pathname === '/ors/v2/directions/foot-hiking/geojson' && ['POST', 'OPTIONS'].includes(method)) {
        return { provider: 'ORS', endpoint: '/ors/v2/directions/{profile}/geojson' };
      }
    }
  } catch { /* deny malformed URLs without retaining their contents */ }
  return null;
}

function endpointPathClass(rawUrl) {
  try {
    const path = new URL(rawUrl).pathname;
    if (path === '/nearest') return '/nearest';
    if (path === '/info') return '/info';
    if (path === '/route') return '/route';
    if (path === '/ors/status') return '/ors/status';
    if (path === '/ors/v2/directions/foot-hiking/geojson') return '/ors/v2/directions/{profile}/geojson';
  } catch { /* no URL details are retained */ }
  return null;
}

function payloadFlags(provider, postData) {
  try {
    const body = JSON.parse(postData || '{}');
    if (provider === 'GraphHopper') {
      const flags = {
        chDisabled: body['ch.disable'] === true,
        ferrySnapPrevention: Array.isArray(body.snap_preventions) && body.snap_preventions.includes('ferry'),
        roadEnvironmentRequested: Array.isArray(body.details) && body.details.includes('road_environment'),
        ferryPriorityZero: Array.isArray(body.custom_model?.priority) && body.custom_model.priority.some(x =>
          x.if === 'road_environment == FERRY' && String(x.multiply_by) === '0'),
      };
      return { flags, allRequired: Object.values(flags).every(Boolean), pointCount: Array.isArray(body.points) ? body.points.length : 0,
        requestedPoints: Array.isArray(body.points) ? body.points : null };
    }
    const flags = {
      ferryAvoidFeature: Array.isArray(body.options?.avoid_features) && body.options.avoid_features.includes('ferries'),
      waytypeRequested: Array.isArray(body.extra_info) && body.extra_info.includes('waytype'),
    };
    return { flags, allRequired: Object.values(flags).every(Boolean), pointCount: Array.isArray(body.coordinates) ? body.coordinates.length : 0,
      requestedPoints: Array.isArray(body.coordinates) ? body.coordinates : null };
  } catch { return { flags: {}, allRequired: false, pointCount: 0, requestedPoints: null }; }
}

function extractRouteSummary(provider, data, requestedPoints) {
  const featuresOrPaths = provider === 'GraphHopper' ? data?.paths : data?.features;
  const first = Array.isArray(featuresOrPaths) ? featuresOrPaths[0] : null;
  if (!first) return { responseShapeValid: false };

  return {
    responseShapeValid: true,
    validateInApp: provider === 'GraphHopper'
      ? ({ path, requested }) => ({
          detailsValid: routingGraphhopperLandVerified(path),
          snapValid: routingGraphhopperSnapVerified(path, requested),
          responseValid: routingValidateGraphhopperResponse(data, requested).ok,
          ferryDetected: Array.isArray(path?.details?.road_environment) && path.details.road_environment.some(x => String(x?.[2]).toLowerCase() === 'ferry'),
          detailIntervalCount: Array.isArray(path?.details?.road_environment) ? path.details.road_environment.length : 0,
          geometryPointCount: Array.isArray(path?.points?.coordinates) ? path.points.coordinates.length : 0,
          distance_m: Number.isFinite(Number(path?.distance)) ? Math.round(Number(path.distance)) : null,
          duration_s: Number.isFinite(Number(path?.time)) ? Math.round(Number(path.time) / 1000) : null,
          snapMaxDeltaM: (() => {
            const snapped = path?.snapped_waypoints?.coordinates;
            if (!Array.isArray(snapped) || !Array.isArray(requested)) return null;
            const ds = requested.map((p, i) => Array.isArray(snapped[i])
              ? routingHaversineMeters(p[1], p[0], snapped[i][1], snapped[i][0]) : Infinity);
            return ds.every(Number.isFinite) ? Math.round(Math.max(...ds) * 10) / 10 : null;
          })(),
        })({ path: first, requested: requestedPoints })
      : ({ feature, requested }) => ({
          detailsValid: routingOrsLandVerified(feature),
          snapValid: routingOrsSnapVerified(feature, requested),
          responseValid: routingValidateOrsResponse(data, requested).ok,
          ferryDetected: Array.isArray(feature?.properties?.extras?.waytype?.values) &&
            feature.properties.extras.waytype.values.some(x => Number(x?.[2]) === 9),
          detailIntervalCount: Array.isArray(feature?.properties?.extras?.waytype?.values)
            ? feature.properties.extras.waytype.values.length : 0,
          geometryPointCount: Array.isArray(feature?.geometry?.coordinates) ? feature.geometry.coordinates.length : 0,
          distance_m: Number.isFinite(Number(feature?.properties?.summary?.distance))
            ? Math.round(Number(feature.properties.summary.distance)) : null,
          duration_s: Number.isFinite(Number(feature?.properties?.summary?.duration))
            ? Math.round(Number(feature.properties.summary.duration)) : null,
          snapMaxDeltaM: (() => {
            const points = feature?.geometry?.coordinates, indexes = feature?.properties?.way_points;
            if (!Array.isArray(points) || !Array.isArray(indexes) || !Array.isArray(requested) || indexes.length !== requested.length) return null;
            const ds = requested.map((p, i) => Number.isInteger(indexes[i]) && Array.isArray(points[indexes[i]])
              ? routingHaversineMeters(p[1], p[0], points[indexes[i]][1], points[indexes[i]][0]) : Infinity);
            return ds.every(Number.isFinite) ? Math.round(Math.max(...ds) * 10) / 10 : null;
          })(),
        })({ feature: first, requested: requestedPoints }),
  };
}

function safeUiState(page) {
  return page.evaluate(() => {
    const r = typeof state !== 'undefined' ? state._routing : null;
    const save = document.querySelector('#routingSaveAsTrackBtn');
    const card = document.querySelector('#routingResultCard');
    return {
      preview: !!r?.previewCoordinates,
      previewPointCount: Array.isArray(r?.previewCoordinates) ? r.previewCoordinates.length : 0,
      saveEnabled: !!save && !save.disabled,
      resultCardVisible: !!card && !card.hidden,
      requestLoading: !!r?.requestLoading,
      infoLoading: !!r?.infoLoading,
      profile: document.querySelector('#routingProfileSelect')?.value || null,
    };
  });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runCase(testCase) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  let phase = 'page-load';
  let branchStop = null;
  let routeResponse = null;
  let pageErrorCount = 0;
  let blockedOtherCount = 0;
  let blockedOutOfScopeProviderCount = 0;
  const calls = [];
  const responses = [];
  const failures = [];
  let requestPayload = null;
  const stopBranch = reason => { if (!branchStop) branchStop = reason; };

  page.on('pageerror', () => { pageErrorCount++; });
  page.on('response', response => {
    const req = response.request();
    const meta = endpointFor(response.url(), req.method());
    if (!meta) return;
    const status = response.status();
    const row = { phase, provider: meta.provider, method: req.method(), endpoint: meta.endpoint, status };
    responses.push(row);
    if (req.method() === 'POST' && (meta.endpoint === '/route' || meta.endpoint === '/ors/v2/directions/{profile}/geojson')) routeResponse = response;
    if (status < 200 || status >= 300) {
      stopBranch({ type: status === 401 || status === 403 ? 'AUTHORIZATION_FAILURE' :
        status === 402 || status === 429 ? 'QUOTA_OR_BILLING_LIMIT' : 'HTTP_NON_2XX', status, endpoint: meta.endpoint });
    }
  });
  page.on('requestfailed', request => {
    const meta = endpointFor(request.url(), request.method());
    if (!meta || branchStop) return;
    const errorText = String(request.failure()?.errorText || '').toUpperCase();
    const kind = /CERT|TLS|SSL/.test(errorText) ? 'TLS_FAILURE' :
      /INTERNET_DISCONNECTED|NETWORK_CHANGED/.test(errorText) ? 'GLOBAL_NETWORK_FAILURE' :
      /CORS/.test(errorText) ? 'CORS_FAILURE' : 'NETWORK_OR_CORS_FAILURE';
    failures.push({ provider: meta.provider, method: request.method(), endpoint: meta.endpoint, category: kind });
    stopBranch({ type: kind, endpoint: meta.endpoint });
  });

  await context.route('**/*', async route => {
    const request = route.request();
    const rawUrl = request.url();
    if (rawUrl === appUrl) {
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: appBytes });
    }

    const method = request.method();
    const meta = endpointFor(rawUrl, method);
    if (meta) {
      if (branchStop) return route.abort('blockedbyclient').catch(() => {});
      const call = { phase, provider: meta.provider, method, endpoint: meta.endpoint };
      if (method === 'POST' && (meta.endpoint === '/route' || meta.endpoint === '/ors/v2/directions/{profile}/geojson')) {
        const inspected = payloadFlags(meta.provider, request.postData());
        call.antiFerry = inspected.flags;
        call.antiFerryAllRequired = inspected.allRequired;
        call.pointCount = inspected.pointCount;
        requestPayload = { provider: meta.provider, requestedPoints: inspected.requestedPoints };
      }
      calls.push(call);
      try { await route.continue(); }
      catch { stopBranch({ type: 'NETWORK_OR_CORS_FAILURE', endpoint: meta.endpoint }); }
      return;
    }

    const pathClass = endpointPathClass(rawUrl);
    if (pathClass) {
      blockedOutOfScopeProviderCount++;
      stopBranch({ type: 'NON_ALLOWLISTED_ENDPOINT', endpointClass: pathClass });
    } else {
      blockedOtherCount++;
    }
    return route.abort('blockedbyclient').catch(() => {});
  });

  const result = {
    provider: testCase.provider,
    profile: testCase.profile,
    appOrigin: 'http://100.99.54.93:8000',
    runtimeSha256,
    actionIssued: false,
    preActionRouteRequestCount: 0,
    calls,
    responses,
    failures,
    route: null,
    ui: null,
    pageErrorCount: null,
    blockedOtherCount: null,
    blockedOutOfScopeProviderCount: null,
    outcome: null,
    stopReason: null,
  };

  try {
    await page.goto(appUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(500);
    phase = 'panel-open';
    await page.evaluate(provider => openRoutingPlannerPanel(provider), testCase.appProvider);
    await page.waitForSelector('#routingPlannerPanel[open]', { timeout: 10000 });
    await page.waitForTimeout(1000);
    if (branchStop) {
      result.outcome = branchStop.type;
      result.stopReason = branchStop;
      result.ui = await safeUiState(page);
      return finalize();
    }

    const optionReady = await page.locator('#routingProfileSelect option').evaluateAll((options, value) =>
      options.some(option => option.value === value), testCase.profile);
    if (!optionReady) {
      result.outcome = 'PROFILE_UNAVAILABLE_IN_CURRENT_PROVIDER_CONFIGURATION';
      result.ui = await safeUiState(page);
      return finalize();
    }
    phase = 'configure-public-points';
    await page.locator('#routingProfileSelect').selectOption(testCase.profile);
    const pointsSet = await page.evaluate(coords => {
      const r = typeof state !== 'undefined' ? state._routing : null;
      if (!r?.points || r.points.length < 2) return false;
      coords.forEach(([lon, lat], i) => routingSetPointCoordinates(r.points[i].id, lat, lon, 'map'));
      routingSyncCalculateBtnUi();
      return r.points.slice(0, 2).every(p => Number.isFinite(p.lat) && Number.isFinite(p.lon));
    }, coordinates);
    if (!pointsSet) {
      result.outcome = 'SYNTHETIC_POINTS_NOT_ACCEPTED';
      result.ui = await safeUiState(page);
      return finalize();
    }
    await page.waitForTimeout(300);
    result.preActionRouteRequestCount = calls.filter(x => x.method === 'POST' &&
      (x.endpoint === '/route' || x.endpoint === '/ors/v2/directions/{profile}/geojson')).length;
    if (result.preActionRouteRequestCount !== 0) {
      result.outcome = 'UNEXPECTED_ROUTE_REQUEST_BEFORE_CALCULATE';
      result.stopReason = { type: result.outcome };
      result.ui = await safeUiState(page);
      return finalize();
    }
    if (branchStop) {
      result.outcome = branchStop.type;
      result.stopReason = branchStop;
      result.ui = await safeUiState(page);
      return finalize();
    }

    const calculate = page.locator('#routingCalculateBtn');
    if (await calculate.isDisabled()) {
      result.outcome = 'CALCULATE_BUTTON_DISABLED_BY_APP_GATE';
      result.ui = await safeUiState(page);
      return finalize();
    }
    phase = 'calculate-action';
    await calculate.click();
    result.actionIssued = true;

    const deadline = Date.now() + 40000;
    while (Date.now() < deadline && !routeResponse && !branchStop) await delay(100);
    result.stopReason = branchStop;
    if (routeResponse && routeResponse.status() >= 200 && routeResponse.status() < 300) {
      let data = null;
      try { data = await routeResponse.json(); } catch { /* do not retain body or parser text */ }
      const req = requestPayload?.provider === testCase.provider ? requestPayload : null;
      if (data && req?.requestedPoints) {
        try {
          result.route = await page.evaluate(({ provider, data, requested }) => {
            const candidates = provider === 'GraphHopper' ? data?.paths : data?.features;
            const first = Array.isArray(candidates) ? candidates[0] : null;
            if (!first) return { responseShapeValid: false };
            return provider === 'GraphHopper'
              ? {
                  responseShapeValid: true,
                  alternativeCount: candidates.length,
                  detailsValid: candidates.length > 0 && candidates.every(x => routingGraphhopperLandVerified(x)),
                  snapValid: candidates.length > 0 && candidates.every(x => routingGraphhopperSnapVerified(x, requested)),
                  responseValid: routingValidateGraphhopperResponse(data, requested).ok,
                  ferryDetected: candidates.some(x => Array.isArray(x.details?.road_environment) && x.details.road_environment.some(v => String(v?.[2]).toLowerCase() === 'ferry')),
                  detailIntervalCount: Array.isArray(first.details?.road_environment) ? first.details.road_environment.length : 0,
                  geometryPointCount: Array.isArray(first.points?.coordinates) ? first.points.coordinates.length : 0,
                  distance_m: Number.isFinite(Number(first.distance)) ? Math.round(Number(first.distance)) : null,
                  duration_s: Number.isFinite(Number(first.time)) ? Math.round(Number(first.time) / 1000) : null,
                  primarySnapMaxDeltaM: (() => {
                    const snapped = first.snapped_waypoints?.coordinates;
                    if (!Array.isArray(snapped) || snapped.length !== requested.length) return null;
                    const ds = requested.map((p, i) => routingHaversineMeters(p[1], p[0], snapped[i][1], snapped[i][0]));
                    return ds.every(Number.isFinite) ? Math.round(Math.max(...ds) * 10) / 10 : null;
                  })(),
                }
              : {
                  responseShapeValid: true,
                  alternativeCount: candidates.length,
                  detailsValid: candidates.length > 0 && candidates.every(x => routingOrsLandVerified(x)),
                  snapValid: candidates.length > 0 && candidates.every(x => routingOrsSnapVerified(x, requested)),
                  responseValid: routingValidateOrsResponse(data, requested).ok,
                  ferryDetected: candidates.some(x => Array.isArray(x.properties?.extras?.waytype?.values) && x.properties.extras.waytype.values.some(v => Number(v?.[2]) === 9)),
                  detailIntervalCount: Array.isArray(first.properties?.extras?.waytype?.values) ? first.properties.extras.waytype.values.length : 0,
                  geometryPointCount: Array.isArray(first.geometry?.coordinates) ? first.geometry.coordinates.length : 0,
                  distance_m: Number.isFinite(Number(first.properties?.summary?.distance)) ? Math.round(Number(first.properties.summary.distance)) : null,
                  duration_s: Number.isFinite(Number(first.properties?.summary?.duration)) ? Math.round(Number(first.properties.summary.duration)) : null,
                  primarySnapMaxDeltaM: (() => {
                    const points = first.geometry?.coordinates, indexes = first.properties?.way_points;
                    if (!Array.isArray(points) || !Array.isArray(indexes) || indexes.length !== requested.length) return null;
                    const ds = requested.map((p, i) => Number.isInteger(indexes[i]) && Array.isArray(points[indexes[i]])
                      ? routingHaversineMeters(p[1], p[0], points[indexes[i]][1], points[indexes[i]][0]) : Infinity);
                    return ds.every(Number.isFinite) ? Math.round(Math.max(...ds) * 10) / 10 : null;
                  })(),
                };
          }, { provider: testCase.provider, data, requested: req.requestedPoints });
        } catch { result.route = { responseShapeValid: false, appValidation: 'not available' }; }
      } else {
        result.route = { responseShapeValid: false, appValidation: 'provider route request payload or JSON response unavailable' };
      }
      phase = 'ui-result';
      await page.waitForTimeout(800);
      result.ui = await safeUiState(page);
      const routeCall = calls.find(x => x.method === 'POST' &&
        (x.endpoint === '/route' || x.endpoint === '/ors/v2/directions/{profile}/geojson'));
      const routePass = routeCall?.antiFerryAllRequired && result.route?.responseShapeValid && result.route.detailsValid &&
        result.route.snapValid && result.route.responseValid && !result.route.ferryDetected &&
        result.ui?.preview && result.ui?.saveEnabled;
      result.outcome = routePass ? 'PASS' : 'FAIL_CLOSED_OR_ROUTE_DETAILS_INVALID';
    } else if (routeResponse && routeResponse.status() >= 200) {
      result.outcome = branchStop?.type || 'HTTP_NON_2XX';
      result.ui = await safeUiState(page);
    } else if (branchStop) {
      result.outcome = branchStop.type;
      result.ui = await safeUiState(page);
    } else {
      result.outcome = 'NO_ROUTE_RESPONSE_WITHIN_BOUND';
      result.ui = await safeUiState(page);
    }
  } catch (error) {
    result.outcome = error?.name === 'TimeoutError' ? 'UI_OR_PROVIDER_TIMEOUT' : 'UI_PROBE_FAILED_REDACTED';
    result.ui = await safeUiState(page).catch(() => null);
  } finally {
    await context.close().catch(() => {});
  }

  function finalize() {
    result.stopReason = result.stopReason || branchStop;
    result.pageErrorCount = pageErrorCount;
    result.blockedOtherCount = blockedOtherCount;
    result.blockedOutOfScopeProviderCount = blockedOutOfScopeProviderCount;
    return result;
  }

  const final = finalize();
  return final;
}

let browser;
(async () => {
  browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
  });
  const results = [];
  let skipIndependentProvider = false;
  for (const testCase of cases) {
    if (skipIndependentProvider) {
      results.push({ provider: testCase.provider, profile: testCase.profile, outcome: 'SKIPPED_SHARED_GLOBAL_NETWORK_FAILURE' });
      continue;
    }
    const result = await runCase(testCase);
    results.push(result);
    if (result.outcome === 'GLOBAL_NETWORK_FAILURE') skipIndependentProvider = true;
  }
  await browser.close();
  browser = null;

  const pass = results.length === 2 && results.every(r => r.outcome === 'PASS');
  const failed = results.some(r => ['FAIL_CLOSED_OR_ROUTE_DETAILS_INVALID', 'HTTP_NON_2XX', 'AUTHORIZATION_FAILURE', 'QUOTA_OR_BILLING_LIMIT'].includes(r.outcome));
  const report = {
    status: pass ? 'PASS_SCOPED' : failed ? 'FAIL' : 'NON_VERIFICATO',
    runtimeSha256,
    appPage: 'http://100.99.54.93:8000/coordinate_converter%20Claude.html (page fulfilled from the verified local bytes)',
    networkPolicy: 'Only exact GET/POST/OPTIONS endpoints on 100.99.54.93:8989 and ionos-n8n-new.tailc01234.ts.net:443 were permitted. No upstream GraphHopper/ORS commercial APIs. All other hosts, tiles, elevation and fonts were blocked. URL query strings and headers were never captured or persisted.',
    snapValidation: { appSoftDeltaThreshold_m: 50, graphhopperGeometryCoincidenceTolerance_m: 1, validator: 'runtime functions routingGraphhopperSnapVerified/routingOrsSnapVerified' },
    inputs: { type: 'public synthetic coordinates', pointCount: 2, coordinatePair: coordinates },
    noSaveAction: true,
    results,
  };
  fs.writeFileSync(__dirname + '/result.json', JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({ status: report.status, runtimeSha256, results: results.map(r => ({
    provider: r.provider, profile: r.profile, outcome: r.outcome, actionIssued: r.actionIssued,
    calls: r.calls, responses: r.responses, route: r.route, ui: r.ui,
    blockedOutOfScopeProviderCount: r.blockedOutOfScopeProviderCount, stopReason: r.stopReason,
  })) }, null, 2));
  if (report.status !== 'PASS_SCOPED') process.exitCode = 1;
})().catch(() => {
  if (browser) browser.close().catch(() => {});
  console.error('Tailnet provider probe failed; details redacted.');
  process.exitCode = 1;
});
