'use strict';

// Lifecycle QA only: no browser, provider, proxy or external network is used.
// Production functions are extracted unchanged from the isolated candidate.
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const candidate = process.argv[2] || path.resolve(__dirname, '../gis-recovery/candidate-279-https443-timeout.html');
const resultsPath = process.argv[3] || path.join(__dirname, 'results.json');
const TEST_TIMEOUT_MS = 25;
const symbols = new Set([
  'routingNetworkGateOrs', 'routingPostOrsDirections',
  'routingCompareRunOrs', 'routingCompareStart',
  'routingCompareResetSession', 'routingCompareAbortInFlight',
  'routingComparePackFail', 'routingCompareWithAvoid',
  'routingCompareLonLat', 'routingLandNoConnection', 'routingLandErrorKey'
]);

async function extractFunctions(file) {
  const found = new Map();
  const hashes = crypto.createHash('sha256');
  const stream = fs.createReadStream(file);
  stream.on('data', chunk => hashes.update(chunk));
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let active = null;
  let code = [];
  let lineNumber = 0;
  let startLine = 0;
  let productionTimeout = null;
  for await (const line of lines) {
    lineNumber++;
    const timeout = line.match(/^const ROUTING_ORS_TIMEOUT_MS = (\d+);$/);
    if (timeout) productionTimeout = Number(timeout[1]);
    if (!active) {
      const head = line.match(/^(?:async )?function (\w+)\(/);
      if (head && symbols.has(head[1])) {
        assert(!found.has(head[1]), 'Duplicate function: ' + head[1]);
        active = head[1];
        code = [line];
        startLine = lineNumber;
      }
    } else {
      code.push(line);
      if (line === '}') {
        found.set(active, { source: code.join('\n'), startLine, endLine: lineNumber });
        active = null;
      }
    }
  }
  assert.equal(active, null, 'Unclosed extracted function');
  assert.deepEqual([...found.keys()].sort(), [...symbols].sort());
  assert.equal(productionTimeout, 20000, 'Production deadline must remain 20 seconds');
  return { found, sha256: hashes.digest('hex'), productionTimeout };
}

function abortError() {
  const error = new Error('aborted');
  error.name = 'AbortError';
  return error;
}

function pendingUntilAbort(signal, record) {
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      record.aborted = true;
      signal.removeEventListener('abort', onAbort);
      reject(abortError());
    };
    if (signal.aborted) onAbort();
    else signal.addEventListener('abort', onAbort, { once: true });
  });
}

function fixture() {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[9, 44], [9.01, 44.01]] },
      properties: { way_points: [0, 1], extras: { waytype: { values: [[0, 1, 7]] } } }
    }]
  };
}

function createHarness(extracted, options = {}) {
  const trace = {
    fetches: [], scheduledTimeouts: [], clearedTimeouts: 0,
    activeTimers: new Map(), orsResults: [], uiLoading: [], ghCalls: 0
  };
  const state = {
    opsecStrict: !!options.opsecStrict,
    forceOffline: !!options.forceOffline,
    _routing: {
      provider: 'vps', requestLoading: false, infoLoading: false,
      roundTripSeed: 123, roundTripDistanceM: 3000,
      mode: options.mode || 'point_to_point',
      points: [{ lat: 44, lon: 9 }, { lat: 44.01, lon: 9.01 }]
    }
  };
  const session = {
    sequence: 0, loading: false, controllers: { gh: null, ors: null },
    snapshot: null, gh: null, ors: null, chosen: null, startedAt: 0
  };
  const queue = (options.fetchQueue || ['pending']).slice();
  const ghResult = {
    status: 'pass', provider: 'vps', endpoint: '/mock/gh', profile: 'hiking',
    previewCoordinates: [{ lat: 44, lon: 9 }, { lat: 44.01, lon: 9.01 }],
    metrics: { distanceM: 1200 }
  };
  const valid = {
    ok: true,
    alternatives: [{
      previewCoordinates: [{ lat: 44, lon: 9 }, { lat: 44.01, lon: 9.01 }],
      elevationCoordinates: [{ lat: 44, lon: 9 }, { lat: 44.01, lon: 9.01 }],
      metrics: { distanceM: 1300 }
    }]
  };
  const sandbox = {
    AbortController, Error, Date, Number, Array, Object, JSON, Math, String,
    state, navigator: { onLine: true },
    ROUTING_ORS_TIMEOUT_MS: TEST_TIMEOUT_MS,
    ROUTING_ROUND_TRIP_CLOSE_TOL_M: 25,
    _routingCompareSession: session,
    _routingAvoidSession: { areas: [] },
    isEffectivelyOnline: () => true,
    routingRemoteProviderOriginIsAllowed: () => options.originAllowed !== false,
    routingEnsureState: () => state._routing,
    routingCompareResolveProfilePair: () => ({ ok: true, pair: { gh: 'hiking', ors: 'foot-hiking' } }),
    routingGetRouteMode: () => state._routing.mode,
    routingCompareClonePointsForMode: () => state._routing.points.map(p => ({ ...p })),
    routingRoundTripIsConstrained: () => false,
    routingNewRoundTripSeed: () => 123,
    routingClampRoundTripDistanceM: n => n,
    routingProviderNormalize: p => p || 'vps',
    routingCompareCloneAvoid: () => [],
    routingCompareFingerprint: snap => JSON.stringify({ mode: snap.mode, points: snap.points, routePoints: snap.routePoints || null, ghAnchorProvider: snap.ghAnchorProvider || '' }),
    routingCompareLiveFingerprint: () => session.snapshot ? session.snapshot.fingerprint : '',
    routingSyncCompareUi: () => trace.uiLoading.push(session.loading),
    routingSyncCompareMapLegend: () => {},
    routingSyncCenterResultBtnUi: () => {},
    refreshTileMapForTrackUi: () => {},
    routingCompareNeedsGhSnapAnchor: () => !!options.cachedAnchorFallback,
    routingCompareResolveGh: async () => options.cachedAnchorFallback
      ? { ok: false, errKey: 'routing.providerUnavailable' }
      : { ok: true, provider: 'vps', endpoint: '/mock/gh' },
    routingCompareBuildSharedPoints: snap => ({ ok: true, points: snap.points.map(p => ({ lat: p.lat, lon: p.lon })) }),
    routingCompareRunGh: async () => { trace.ghCalls++; return ghResult; },
    routingNetworkGateGraphhopper: () => state.opsecStrict
      ? { ok: false, errKey: 'routing.errorOpsec' }
      : state.forceOffline ? { ok: false, errKey: 'routing.errorOffline' } : { ok: true },
    routingOrsProfileIsValid: () => true,
    routingOrsEndpoint: () => '/mock/ors',
    routingOrsDirectionsUrl: () => '/mock/ors/v2/directions/foot-hiking/geojson',
    routingBuildOrsRouteBody: coordinates => ({ coordinates }),
    routingBuildOrsRoundTripBody: point => ({ coordinates: [point] }),
    routingRoundTripSeedBatch: () => [1, 2, 3],
    routingRoundTripClosureOk: () => true,
    routingScoreRoundTripCandidate: () => 1,
    routingAlternativesAllowed: () => false,
    routingClosedLoopLonLatFromOpen: points => points.map(p => [p.lon, p.lat]),
    routingValidateOrsResponse: () => valid,
    routingMergeOutAndBackCoordinates: (a, b) => a.concat(b),
    routingAggregateOutAndBackMetrics: () => ({ distanceM: 2600 }),
    routingComparePackFromValidated: (data, extra) => ({
      status: 'pass', ...extra,
      previewCoordinates: data.alternatives[0].previewCoordinates,
      metrics: data.alternatives[0].metrics
    }),
    setTimeout(fn, ms) {
      trace.scheduledTimeouts.push(ms);
      const timer = setTimeout(() => {
        trace.activeTimers.delete(timer);
        fn();
      }, ms);
      trace.activeTimers.set(timer, ms);
      return timer;
    },
    clearTimeout(timer) {
      trace.clearedTimeouts++;
      trace.activeTimers.delete(timer);
      clearTimeout(timer);
    },
    async fetch(url, opts) {
      const action = queue.length ? queue.shift() : 'success';
      const record = { url, signal: opts.signal, aborted: false, action: typeof action === 'string' ? action : 'gate-change' };
      trace.fetches.push(record);
      if (action === 'pending') return pendingUntilAbort(opts.signal, record);
      if (action === 'body-pending') {
        return { ok: true, status: 200, text: () => pendingUntilAbort(opts.signal, record) };
      }
      if (action === 'http-error') {
        return { ok: false, status: 503, text: async () => JSON.stringify({ error: 'synthetic_unavailable' }) };
      }
      return {
        ok: true, status: 200,
        text: async () => {
          if (action && typeof action === 'object' && action.beforeText) action.beforeText(state);
          return JSON.stringify(fixture());
        }
      };
    }
  };
  vm.createContext(sandbox);
  vm.runInContext([...extracted.found.values()].map(value => value.source).join('\n\n'), sandbox, { filename: candidate });
  const originalRunOrs = sandbox.routingCompareRunOrs;
  sandbox.routingCompareRunOrs = async (...args) => {
    const result = await originalRunOrs(...args);
    trace.orsResults.push(result);
    return result;
  };
  return { sandbox, state, session, trace, queue, ghResult };
}

function snapshotFor(harness, mode = 'point_to_point') {
  return {
    mode, pair: { gh: 'hiking', ors: 'foot-hiking' },
    routePoints: harness.state._routing.points.map(p => ({ ...p })),
    roundTripSeed: 123, roundTripDistanceM: 3000, avoid: [], constrainedLoop: false
  };
}

function assertIdle(harness) {
  assert.equal(harness.session.loading, false);
  assert.equal(harness.session.controllers.gh, null);
  assert.equal(harness.session.controllers.ors, null);
  assert.equal(harness.trace.activeTimers.size, 0);
}

async function watchdog(promise) {
  let timer;
  const limit = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error('Test watchdog: operation did not settle')), 1500);
  });
  try { return await Promise.race([promise, limit]); }
  finally { clearTimeout(timer); }
}

async function main() {
  const extracted = await extractFunctions(candidate);
  const tests = [];
  async function test(name, fn) {
    try {
      const detail = await fn();
      tests.push({ name, passed: true, detail: detail || null });
    } catch (error) {
      tests.push({ name, passed: false, error: error.stack || String(error) });
    }
  }

  await test('pending ORS times out; GH result and final UI state survive; second request succeeds', async () => {
    const h = createHarness(extracted);
    await watchdog(h.sandbox.routingCompareStart());
    assert.equal(h.session.gh, h.ghResult);
    assert.equal(h.session.ors.status, 'fail');
    assert.equal(h.session.ors.errKey, 'routing.errorTimeout');
    assert.equal(h.trace.fetches[0].aborted, true);
    assert.deepEqual(h.trace.scheduledTimeouts, [TEST_TIMEOUT_MS]);
    assertIdle(h);
    h.queue.push('success');
    await watchdog(h.sandbox.routingCompareStart());
    assert.equal(h.session.gh, h.ghResult);
    assert.equal(h.session.ors.status, 'pass');
    assert.equal(h.trace.fetches.length, 2);
    assert.equal(h.trace.fetches[1].signal.aborted, false);
    assertIdle(h);
    return { first: 'routing.errorTimeout', second: 'pass', ghPreserved: true, productionMs: extracted.productionTimeout, testMs: TEST_TIMEOUT_MS };
  });

  await test('voluntary cancel remains aborted, clears loading, and allows restart', async () => {
    const h = createHarness(extracted);
    const running = h.sandbox.routingCompareStart();
    h.sandbox.routingCompareAbortInFlight({ clearResults: true });
    await watchdog(running);
    assert.equal(h.trace.orsResults[0].aborted, true);
    assert.equal(h.trace.orsResults[0].errKey, undefined);
    assert.equal(h.session.gh, null);
    assert.equal(h.session.ors, null);
    assertIdle(h);
    h.queue.push('success');
    await watchdog(h.sandbox.routingCompareStart());
    assert.equal(h.session.ors.status, 'pass');
    assertIdle(h);
  });

  await test('voluntary cancellation in outbound leg is not labelled timeout or outbound failure', async () => {
    const h = createHarness(extracted, { mode: 'out_and_back' });
    const controller = new AbortController();
    const running = h.sandbox.routingCompareRunOrs(snapshotFor(h, 'out_and_back'), controller, 0);
    controller.abort();
    const result = await watchdog(running);
    assert.equal(result.aborted, true);
    assert.equal(result.errKey, undefined);
    assert.equal(h.trace.activeTimers.size, 0);
  });

  for (const flag of ['opsecStrict', 'forceOffline']) {
    await test(flag + ' blocks ORS before any fetch or deadline is armed', async () => {
      const h = createHarness(extracted, { [flag]: true });
      const result = await h.sandbox.routingCompareRunOrs(snapshotFor(h), new AbortController(), 0);
      assert.equal(result.errKey, flag === 'opsecStrict' ? 'routing.errorOpsec' : 'routing.errorOffline');
      assert.equal(h.trace.fetches.length, 0);
      assert.equal(h.trace.scheduledTimeouts.length, 0);
      assert.equal(h.trace.activeTimers.size, 0);
    });
    await test(flag + ' changing during a response stays fail-closed and cleans timer', async () => {
      const h = createHarness(extracted, { fetchQueue: [{ beforeText: state => { state[flag] = true; } }] });
      const result = await h.sandbox.routingCompareRunOrs(snapshotFor(h), new AbortController(), 0);
      assert.equal(result.status, 'fail');
      assert.equal(result.errKey, flag === 'opsecStrict' ? 'routing.errorOpsec' : 'routing.errorOffline');
      assert.equal(h.trace.fetches.length, 1);
      assert.equal(h.trace.activeTimers.size, 0);
    });
  }

  await test('deadline also covers a pending response body', async () => {
    const h = createHarness(extracted, { fetchQueue: ['body-pending'] });
    await watchdog(h.sandbox.routingCompareStart());
    assert.equal(h.session.ors.errKey, 'routing.errorTimeout');
    assert.equal(h.session.gh, h.ghResult);
    assertIdle(h);
  });

  await test('disallowed origin blocks ORS before fetch or timer', async () => {
    const h = createHarness(extracted, { originAllowed: false });
    const result = await h.sandbox.routingCompareRunOrs(snapshotFor(h), new AbortController(), 0);
    assert.equal(result.errKey, 'routing.errorNetwork');
    assert.equal(h.trace.fetches.length, 0);
    assert.equal(h.trace.scheduledTimeouts.length, 0);
  });

  await test('one total deadline covers outbound success and a pending return', async () => {
    const h = createHarness(extracted, { mode: 'out_and_back', fetchQueue: ['success', 'pending'] });
    await watchdog(h.sandbox.routingCompareStart());
    assert.equal(h.trace.fetches.length, 2);
    assert.deepEqual(h.trace.scheduledTimeouts, [TEST_TIMEOUT_MS]);
    assert.equal(h.session.ors.errKey, 'routing.errorTimeout');
    assert.equal(h.session.gh, h.ghResult);
    assertIdle(h);
  });

  await test('one total deadline bounds multiple automatic-loop seed attempts', async () => {
    const h = createHarness(extracted, { mode: 'round_trip', fetchQueue: ['http-error', 'pending', 'success'] });
    await watchdog(h.sandbox.routingCompareStart());
    assert.equal(h.trace.fetches.length, 2);
    assert.deepEqual(h.trace.scheduledTimeouts, [TEST_TIMEOUT_MS]);
    assert.equal(h.session.ors.errKey, 'routing.errorTimeout');
    assert.equal(h.session.gh, h.ghResult);
    assertIdle(h);
  });

  await test('cached-anchor ORS-only fallback also terminates and resets loading', async () => {
    const h = createHarness(extracted, { cachedAnchorFallback: true });
    await watchdog(h.sandbox.routingCompareStart());
    assert.equal(h.session.gh.status, 'fail');
    assert.equal(h.session.ors.errKey, 'routing.errorTimeout');
    assert.equal(h.trace.ghCalls, 0);
    assertIdle(h);
  });

  await test('successful request clears timer and is never aborted later', async () => {
    const h = createHarness(extracted, { fetchQueue: ['success'] });
    await watchdog(h.sandbox.routingCompareStart());
    assert.equal(h.session.ors.status, 'pass');
    assertIdle(h);
    await new Promise(resolve => setTimeout(resolve, TEST_TIMEOUT_MS + 10));
    assert.equal(h.trace.fetches[0].signal.aborted, false);
    assert.equal(h.session.ors.status, 'pass');
    assertIdle(h);
  });

  await test('pre-aborted request does not start fetch or arm a timer', async () => {
    const h = createHarness(extracted);
    const controller = new AbortController();
    controller.abort();
    const result = await h.sandbox.routingCompareRunOrs(snapshotFor(h), controller, 0);
    assert.equal(result.aborted, true);
    assert.equal(h.trace.fetches.length, 0);
    assert.equal(h.trace.scheduledTimeouts.length, 0);
  });

  await test('unexpected downstream exception still cleans timer', async () => {
    const h = createHarness(extracted, { fetchQueue: ['success'] });
    h.sandbox.routingValidateOrsResponse = () => { throw new Error('synthetic validator exception'); };
    await assert.rejects(h.sandbox.routingCompareRunOrs(snapshotFor(h), new AbortController(), 0), /synthetic validator exception/);
    assert.equal(h.trace.activeTimers.size, 0);
    assert.equal(h.trace.fetches[0].signal.aborted, false);
  });

  const report = {
    candidate, sha256: extracted.sha256,
    productionTimeoutMs: extracted.productionTimeout, testTimeoutMs: TEST_TIMEOUT_MS,
    runtimeFunctions: Object.fromEntries([...extracted.found].map(([name, value]) => [name, { startLine: value.startLine, endLine: value.endLine }])),
    harnessScope: 'Actual compare lifecycle, ORS POST and network gates; UI, geospatial validation and GH result are stubs; fetch is always synthetic.',
    networkRequests: 0,
    passed: tests.filter(t => t.passed).length,
    failed: tests.filter(t => !t.passed).length,
    tests
  };
  fs.writeFileSync(resultsPath, JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ candidate, sha256: report.sha256, passed: report.passed, failed: report.failed, failures: tests.filter(t => !t.passed) }) + '\n');
  if (report.failed) process.exitCode = 1;
}

main().catch(error => { console.error(error); process.exitCode = 1; });
