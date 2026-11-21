'use strict';

// Qualification only. Never imports into an existing browser profile.
// Input bodies, console arguments, protocol errors and request URLs are private.
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const Module = require('module');
const { spawn } = require('child_process');

const ORIGIN = 'https://ionos-n8n-new.tailc01234.ts.net';
const DOCUMENT_URL = ORIGIN + '/gis/__tmar_p0_roundtrip__';
const MAIN = 'coordconv_v2';
const RUNTIME_SHA = 'ed760bbd704db0e925f8af7f52a7880d9cffda4be2e2f0af9a2044c9cdf56fec';
const RUNTIME_BYTES = 11288727;
const COMPARATOR_SHA = '2b52af8981bcc76927a2129faea8daceeb539f38222930633afde94222a56f3a';
const CANDIDATE_FORMAT = 'TMAR-GIS-P0-SELECTIVE-CANDIDATE-V1';
const SEED_MARKER = '__TMAR_P0_ROUNDTRIP_SEED_V1__';
const SAFE_CODES = new Set();
function stop(code) { SAFE_CODES.add(code); const e = new Error(code); e.safeCode = code; throw e; }
function insist(ok, code) { if (!ok) stop(code); }
function safeCode(e) { return e && SAFE_CODES.has(e.safeCode) ? e.safeCode : 'LOCAL_OPERATION_FAILED'; }
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function stableRead(file, expectedSha, expectedBytes, label) {
  insist(typeof file === 'string' && path.isAbsolute(file), label + '_PATH');
  insist(/^[0-9a-f]{64}$/.test(expectedSha), label + '_HASH_CONFIG');
  const before = fs.statSync(file);
  insist(before.isFile(), label + '_REGULAR_FILE');
  const bytes = fs.readFileSync(file);
  const after = fs.statSync(file);
  insist(before.size === after.size && before.mtimeMs === after.mtimeMs && before.ino === after.ino,
    label + '_CHANGED_DURING_READ');
  insist(bytes.length === before.size && sha(bytes) === expectedSha, label + '_IDENTITY');
  if (expectedBytes !== undefined) insist(bytes.length === expectedBytes, label + '_BYTES');
  return bytes;
}
function json(bytes, code) { try { return JSON.parse(bytes.toString('utf8')); } catch (_) { stop(code); } }
function entries(value, code) {
  insist(Array.isArray(value) && value.length > 0, code);
  const map = new Map();
  for (const pair of value) {
    insist(Array.isArray(pair) && pair.length === 2 && pair.every(x => typeof x === 'string') && !map.has(pair[0]), code);
    map.set(pair[0], pair[1]);
  }
  insist(map.has(MAIN), code);
  return [...map].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
}
function entryEqual(a, b) { return a.length === b.length && a.every((p, i) => p[0] === b[i][0] && p[1] === b[i][1]); }
function ownWrite(file, value) {
  const bytes = Buffer.from(JSON.stringify(value, null, 2) + '\n', 'utf8');
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o600 });
  insist(fs.readFileSync(file).equals(bytes), 'OUTPUT_READBACK');
  return { file: path.basename(file), bytes: bytes.length, sha256: sha(bytes) };
}
function confinedOutputDirectory(directory) {
  const localAppData = process.env.LOCALAPPDATA;
  const localDrivePath = value => typeof value === 'string' && /^[A-Za-z]:[\\/]/.test(value);
  insist(localDrivePath(directory) && localDrivePath(localAppData), 'OUTPUT_LOCAL_DRIVE_REQUIRED');
  const resolved = path.resolve(directory);
  const logicalBase = path.resolve(localAppData);
  const physicalBase = fs.realpathSync.native(logicalBase);
  const physical = fs.realpathSync.native(resolved);
  insist(localDrivePath(physicalBase) && localDrivePath(physical), 'OUTPUT_PHYSICAL_LOCAL_DRIVE_REQUIRED');
  function inside(candidate, parent) {
    const rel = path.relative(parent, candidate);
    return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + path.sep));
  }
  const roots = ['Backups', 'Recovery'];
  insist(roots.some(root => inside(resolved, path.join(logicalBase, 'TMAR-GIS', root))), 'OUTPUT_LOGICAL_SCOPE');
  insist(roots.some(root => inside(physical, path.join(physicalBase, 'TMAR-GIS', root))), 'OUTPUT_PHYSICAL_SCOPE');
  insist(fs.statSync(physical).isDirectory(), 'OUTPUT_DIRECTORY');
  return physical;
}
function compilePinnedModule(bytes, filename) {
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  loaded._compile(bytes.toString('utf8'), filename);
  return loaded.exports;
}

class CDP {
  constructor(ws) {
    this.ws = ws; this.sequence = 0; this.pending = new Map(); this.failure = null;
    this.closing = false; this.onEvent = () => {};
    this.fatal = new Promise((_, reject) => { this.rejectFatal = reject; });
    this.fatal.catch(() => {});
    ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data);
        if (message.id) {
          const p = this.pending.get(message.id);
          if (!p) return;
          clearTimeout(p.timer); this.pending.delete(message.id);
          if (message.error) p.reject(this.makeError('CDP_COMMAND_FAILED'));
          else p.resolve(message.result || {});
        } else {
          Promise.resolve(this.onEvent(message)).catch(() => this.trip('CDP_EVENT_FAILED'));
        }
      } catch (_) { this.trip('CDP_MESSAGE_FAILED'); }
    };
    ws.onerror = () => this.trip('CDP_TRANSPORT_FAILED');
    ws.onclose = () => {
      for (const p of this.pending.values()) {
        clearTimeout(p.timer); p.reject(this.makeError('CDP_CLOSED'));
      }
      this.pending.clear();
      if (!this.closing) this.trip('CDP_UNEXPECTED_CLOSE');
    };
  }
  makeError(code) { SAFE_CODES.add(code); const e = new Error(code); e.safeCode = code; return e; }
  trip(code) {
    if (!this.failure && !this.closing) { this.failure = this.makeError(code); this.rejectFatal(this.failure); }
  }
  check() { if (this.failure) throw this.failure; }
  watch(promise) { return Promise.race([promise, this.fatal]); }
  send(method, params = {}, sessionId) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id); reject(this.makeError('CDP_TIMEOUT'));
      }, 20000);
      this.pending.set(id, { resolve, reject, timer });
      try { this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); }
      catch (_) { clearTimeout(timer); this.pending.delete(id); reject(this.makeError('CDP_SEND_FAILED')); }
    });
  }
  async evaluate(sessionId, expression) {
    const r = await this.watch(this.send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true, userGesture: false
    }, sessionId));
    insist(!r.exceptionDetails && r.result && Object.hasOwn(r.result, 'value'), 'PAGE_EVALUATION_FAILED');
    return r.result.value;
  }
}

async function denyProxy() {
  const counts = { httpDenied: 0, connectDenied: 0, upgradeDenied: 0 };
  const sockets = new Set();
  const server = http.createServer((_, response) => {
    counts.httpDenied++;
    response.writeHead(403, { Connection: 'close', 'Content-Length': '0' }); response.end();
  });
  server.on('connect', (_, socket) => {
    counts.connectDenied++;
    socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
  });
  server.on('upgrade', (_, socket) => { counts.upgradeDenied++; socket.destroy(); });
  server.on('connection', socket => {
    sockets.add(socket); socket.on('close', () => sockets.delete(socket)); socket.on('error', () => {});
  });
  server.on('clientError', (_, socket) => socket.destroy());
  await new Promise((resolve, reject) => {
    server.once('error', reject); server.listen(0, '127.0.0.1', resolve);
  });
  return { counts, port: server.address().port, async close() {
    for (const socket of sockets) socket.destroy();
    await new Promise(resolve => server.close(resolve));
  } };
}

async function connectOwnBrowser(child, profile) {
  const file = path.join(profile, 'DevToolsActivePort');
  const limit = Date.now() + 20000;
  while (!fs.existsSync(file) && Date.now() < limit) {
    insist(child.exitCode === null, 'BROWSER_EXITED_BEFORE_BINDING'); await pause(100);
  }
  insist(fs.existsSync(file), 'DEVTOOLS_FILE_MISSING');
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n').map(x => x.trim());
  insist(lines.length === 2 && /^\d+$/.test(lines[0]) && /^\/devtools\/browser\/[a-f0-9-]+$/.test(lines[1]), 'DEVTOOLS_FILE_SCHEMA');
  const port = Number(lines[0]);
  insist(Number.isSafeInteger(port) && port > 0 && port < 65536, 'DEVTOOLS_PORT');
  const ws = new WebSocket('ws://127.0.0.1:' + port + lines[1]);
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { ws.close(); reject(new Error('CDP_OPEN_TIMEOUT')); }, 15000);
    ws.onopen = () => { clearTimeout(timer); resolve(); };
    ws.onerror = () => { clearTimeout(timer); reject(new Error('CDP_OPEN_FAILED')); };
  });
  return new CDP(ws);
}

function seedSource(values) {
  return '(' + function (expectedOrigin, key, values) {
    let receipt = { ok: false, count: 0 };
    try {
      if (window !== window.top || location.origin !== expectedOrigin || localStorage.length !== 0)
        throw new Error('SEED_GUARD');
      for (const pair of values) localStorage.setItem(pair[0], pair[1]);
      if (localStorage.length !== values.length || !values.every(pair => localStorage.getItem(pair[0]) === pair[1]))
        throw new Error('SEED_READBACK');
      receipt = { ok: true, count: values.length };
    } catch (_) {}
    Object.defineProperty(window, key, { value: receipt, configurable: true });
  }.toString() + ')(' + [ORIGIN, SEED_MARKER, values].map(x => JSON.stringify(x)).join(',') + ');';
}
function expression(fn, ...args) { return '(' + fn.toString() + ')(' + args.map(x => JSON.stringify(x)).join(',') + ')'; }

async function runArm(label, input, config, runtime, runDirectory) {
  const armDirectory = path.join(runDirectory, label);
  fs.mkdirSync(armDirectory, { recursive: false });
  const profile = path.join(armDirectory, 'profile');
  fs.mkdirSync(profile, { recursive: false });
  insist(fs.readdirSync(profile).length === 0, 'PROFILE_NOT_EMPTY');
  const proxy = await denyProxy();
  const counts = { documentsFulfilled: 0, requestsDenied: 0, consoleErrors: 0, consoleWarnings: 0,
    runtimeExceptions: 0, unexpectedTargets: 0, dialogsRejected: 0 };
  const result = { label, status: 'RUNNING', isolation: {}, counts, snapshots: [], closure: 'NOT_STARTED' };
  const args = ['--headless=new', '--enable-automation', '--remote-debugging-port=0',
    '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
    '--disable-extensions', '--disable-gpu', '--disable-quic',
    '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
    '--proxy-server=http://127.0.0.1:' + proxy.port, '--proxy-bypass-list=<-loopback>',
    '--window-size=1440,900', 'about:blank'];
  const child = spawn(config.edgeExecutable, args, { stdio: 'ignore', windowsHide: true });
  let spawnFailed = false;
  const exited = new Promise(resolve => {
    child.once('exit', (code, signal) => resolve({ code, signal }));
    child.once('error', () => { spawnFailed = true; resolve({ spawnFailed: true }); });
  });
  let cdp, bound = false, sessionId, targetId, mainFrameId, currentLoaderId, documentAllowed = false;
  const loadedLoaders = new Set();
  const privateSnapshots = [];
  try {
    insist(Number.isInteger(child.pid), 'BROWSER_SPAWN');
    cdp = await connectOwnBrowser(child, profile);
    const commandLine = await cdp.watch(cdp.send('Browser.getBrowserCommandLine'));
    const actualArgs = commandLine.arguments;
    insist(Array.isArray(actualArgs) && actualArgs.every(x => typeof x === 'string'), 'BROWSER_ARGV');
    const profileArgs = actualArgs.filter(x => x.startsWith('--user-data-dir='));
    insist(profileArgs.length === 1 && path.resolve(profileArgs[0].slice(16)).toLowerCase() === profile.toLowerCase(), 'BROWSER_PROFILE_BINDING');
    for (const arg of args.slice(0, -1)) insist(actualArgs.includes(arg), 'BROWSER_REQUIRED_ARGV');
    const forbidden = ['--no-sandbox', '--disable-sandbox', '--disable-setuid-sandbox',
      '--disable-gpu-sandbox', '--disable-seccomp-filter-sandbox', '--disable-web-security',
      '--ignore-certificate-errors', '--single-process', '--no-zygote', '--allow-file-access-from-files',
      '--renderer-cmd-prefix'];
    insist(!actualArgs.some(x => forbidden.includes(x.split('=')[0])), 'BROWSER_SECURITY_ARGV');
    const processes = await cdp.watch(cdp.send('SystemInfo.getProcessInfo'));
    const browserProcesses = processes.processInfo.filter(p => p.type === 'browser');
    insist(browserProcesses.length === 1 && browserProcesses[0].id === child.pid && child.exitCode === null && !spawnFailed, 'BROWSER_PID_BINDING');
    bound = true;
    const version = await cdp.watch(cdp.send('Browser.getVersion'));
    result.browser = { product: version.product, protocolVersion: version.protocolVersion };
    result.isolation = { freshExclusiveProfile: true, devToolsFileFromOwnProfile: true,
      commandLineProfileVerified: true, browserPidVerified: true, sandboxDisableFlagsAbsent: true,
      nativeSpawnWithoutLibraryDefaults: true, denyOnlyProxyNoForwarding: true,
      profilePreserved: true, runtimeBytesUnmodified: true, privateInputPassedAfterBinding: false };
    const targets = await cdp.watch(cdp.send('Target.getTargets'));
    const pages = targets.targetInfos.filter(t => t.type === 'page');
    insist(pages.length === 1 && pages[0].url === 'about:blank', 'INITIAL_TARGET');
    targetId = pages[0].targetId;
    sessionId = (await cdp.watch(cdp.send('Target.attachToTarget', { targetId, flatten: true }))).sessionId;
    insist(typeof sessionId === 'string', 'TARGET_SESSION');
    cdp.onEvent = async m => {
      if (m.method === 'Fetch.requestPaused' && m.sessionId === sessionId) {
        const p = m.params;
        if (documentAllowed && p.resourceType === 'Document' && p.frameId === mainFrameId &&
            p.request.method === 'GET' && p.request.url === DOCUMENT_URL) {
          documentAllowed = false; counts.documentsFulfilled++;
          await cdp.send('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 200,
            responseHeaders: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' },
              { name: 'Cache-Control', value: 'no-store' }], body: runtime.toString('base64') }, sessionId);
        } else {
          counts.requestsDenied++;
          await cdp.send('Fetch.failRequest', { requestId: p.requestId, errorReason: 'BlockedByClient' }, sessionId);
        }
      } else if (m.method === 'Page.frameNavigated' && m.sessionId === sessionId && m.params.frame.id === mainFrameId) {
        if (m.params.frame.url !== DOCUMENT_URL) cdp.trip('UNEXPECTED_DOCUMENT_NAVIGATION');
        else currentLoaderId = m.params.frame.loaderId;
      } else if (m.method === 'Page.lifecycleEvent' && m.sessionId === sessionId &&
          m.params.frameId === mainFrameId && m.params.name === 'load') {
        loadedLoaders.add(m.params.loaderId);
      } else if (m.method === 'Runtime.consoleAPICalled' && m.sessionId === sessionId) {
        if (m.params.type === 'error') counts.consoleErrors++;
        if (m.params.type === 'warning') counts.consoleWarnings++;
      } else if (m.method === 'Runtime.exceptionThrown' && m.sessionId === sessionId) {
        counts.runtimeExceptions++; cdp.trip('RUNTIME_EXCEPTION');
      } else if (m.method === 'Page.javascriptDialogOpening' && m.sessionId === sessionId) {
        counts.dialogsRejected++;
        await cdp.send('Page.handleJavaScriptDialog', { accept: false }, sessionId);
        cdp.trip('UNEXPECTED_DIALOG');
      } else if (m.method === 'Target.attachedToTarget' && m.params.targetInfo.targetId !== targetId) {
        counts.unexpectedTargets++;
        await cdp.send('Target.closeTarget', { targetId: m.params.targetInfo.targetId });
        cdp.trip('UNEXPECTED_TARGET');
      } else if (m.method === 'Target.targetCreated' && m.params.targetInfo.type === 'page' && m.params.targetInfo.targetId !== targetId) {
        counts.unexpectedTargets++;
        await cdp.send('Target.closeTarget', { targetId: m.params.targetInfo.targetId });
        cdp.trip('UNEXPECTED_TARGET');
      }
    };
    for (const method of ['Page.enable', 'Runtime.enable', 'Network.enable'])
      await cdp.watch(cdp.send(method, {}, sessionId));
    await cdp.watch(cdp.send('Page.setLifecycleEventsEnabled', { enabled: true }, sessionId));
    await cdp.watch(cdp.send('Target.setDiscoverTargets', { discover: true }));
    await cdp.watch(cdp.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true,
      flatten: true, filter: [{ type: 'page', exclude: true }, {}] }));
    await cdp.watch(cdp.send('Browser.setPermission', {
      permission: { name: 'geolocation' }, setting: 'denied', origin: ORIGIN }));
    await cdp.watch(cdp.send('Browser.setDownloadBehavior', { behavior: 'deny' }));
    await cdp.watch(cdp.send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId));
    await cdp.watch(cdp.send('Network.setBypassServiceWorker', { bypass: true }, sessionId));
    await cdp.watch(cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] }, sessionId));
    await cdp.watch(cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId));
    mainFrameId = (await cdp.watch(cdp.send('Page.getFrameTree', {}, sessionId))).frameTree.frame.id;
    insist(typeof mainFrameId === 'string', 'MAIN_FRAME');
    result.isolation.pageInterceptionInstalledBeforeSeed = true;
    result.isolation.geolocationDeniedBeforeSeed = true;
    result.isolation.downloadsDenied = true;
    const seed = await cdp.watch(cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: seedSource(input) }, sessionId));
    insist(typeof seed.identifier === 'string', 'SEED_SCRIPT_IDENTIFIER');
    result.isolation.privateInputPassedAfterBinding = true;
    async function ready() {
      const deadline = Date.now() + 35000;
      while (Date.now() < deadline) {
        const ok = await cdp.evaluate(sessionId, '(()=>{try{return document.readyState==="complete" && typeof APP_BUILD_NUM!=="undefined" && APP_BUILD_NUM===317 && typeof saveStoreReported==="function" && typeof state==="object";}catch(_){return false;}})()');
        if (ok) return;
        await cdp.watch(pause(100));
      }
      stop('RUNTIME_READY_TIMEOUT');
    }
    async function waitForNewLoadedDocument(previousLoader) {
      const deadline = Date.now() + 35000;
      while (Date.now() < deadline) {
        if (currentLoaderId && currentLoaderId !== previousLoader && loadedLoaders.has(currentLoaderId)) return;
        await cdp.watch(pause(100));
      }
      stop('DOCUMENT_LOAD_TIMEOUT');
    }
    async function snapshot(phase) {
      const captured = await cdp.evaluate(sessionId, expression(function () {
        function read() {
          const values = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); if (key === null) throw new Error('READ');
            const value = localStorage.getItem(key); if (value === null) throw new Error('READ');
            values.push([key, value]);
          }
          return values.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
        }
        const first = read(), second = read();
        if (JSON.stringify(first) !== JSON.stringify(second)) throw new Error('UNSTABLE');
        return { entries: first };
      }));
      const values = entries(captured.entries, 'SNAPSHOT_SCHEMA');
      const metadata = ownWrite(path.join(armDirectory, phase + '.json'), {
        formato: 'TMAR-GIS-P0-ISOLATED-ROUNDTRIP-SNAPSHOT-V1', arm: label, phase,
        origin: ORIGIN, acquiredUTC: new Date().toISOString(), entries: values
      });
      privateSnapshots.push({ phase, entries: values });
      result.snapshots.push({ phase, ...metadata, localStorageKeys: values.length });
    }
    documentAllowed = true;
    const navigation = await cdp.watch(cdp.send('Page.navigate', { url: DOCUMENT_URL }, sessionId));
    insist(!navigation.errorText, 'INITIAL_NAVIGATION_FAILED');
    await waitForNewLoadedDocument(undefined);
    await ready();
    const seedResult = await cdp.evaluate(sessionId, expression(key => window[key], SEED_MARKER));
    insist(seedResult && seedResult.ok === true && seedResult.count === input.length, 'SEED_NOT_VERIFIED');
    const gps = await cdp.evaluate(sessionId, '(async()=>({state:(await navigator.permissions.query({name:"geolocation"})).state}))()');
    insist(gps.state === 'denied', 'GEOLOCATION_NOT_DENIED');
    result.isolation.seedIntoEmptyStorageVerified = true;
    result.isolation.geolocationDeniedObserved = true;
    await cdp.watch(cdp.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: seed.identifier }, sessionId));
    result.isolation.seedRemovedBeforeReload = true;
    await snapshot('boot');
    insist(await cdp.evaluate(sessionId, 'saveStoreReported().ok === true'), 'FIRST_SAVE_FAILED');
    await snapshot('save1');
    documentAllowed = true;
    const firstLoaderId = currentLoaderId;
    await cdp.watch(cdp.send('Page.reload', { ignoreCache: true }, sessionId));
    // Bind readiness to a different loader, not readyState of the old document.
    await waitForNewLoadedDocument(firstLoaderId);
    await ready();
    insist(await cdp.evaluate(sessionId, expression(key => !(key in window), SEED_MARKER)), 'SEED_REAPPLIED');
    result.isolation.reloadWithoutReseedObserved = true;
    await snapshot('reload');
    insist(await cdp.evaluate(sessionId, 'saveStoreReported().ok === true'), 'SECOND_SAVE_FAILED');
    await snapshot('save2');
    cdp.check();
    insist(counts.documentsFulfilled === 2, 'DOCUMENT_COUNT');
    result.status = 'COMPLETED';
  } catch (e) {
    result.status = 'STOP'; result.reason = safeCode(e);
  } finally {
    if (cdp && bound) {
      cdp.closing = true;
      // Browser.close is sent only to the PID/profile-bound browser endpoint.
      await cdp.send('Browser.close').catch(() => {});
      const exit = await Promise.race([exited, pause(12000).then(() => null)]);
      result.closure = exit && !exit.spawnFailed ? 'OWN_BROWSER_EXIT_OBSERVED' : 'OWN_BROWSER_EXIT_NOT_CONFIRMED';
      result.ownBrowserExitCode = exit && typeof exit.code === 'number' ? exit.code : null;
    } else {
      result.closure = child.exitCode !== null || spawnFailed ? 'OWN_SPAWN_ALREADY_EXITED' : 'NOT_ATTEMPTED_UNBOUND';
    }
    if (cdp) { cdp.closing = true; cdp.ws.close(); }
    await proxy.close();
    result.proxy = proxy.counts;
    result.profilePreserved = true;
    if (result.status === 'COMPLETED' && result.closure !== 'OWN_BROWSER_EXIT_OBSERVED') {
      result.status = 'STOP'; result.reason = 'OWN_BROWSER_EXIT_NOT_CONFIRMED';
    }
  }
  return { metadata: result, privateSnapshots };
}

function makeComparisons(parseLossless, equalNodes) {
  function main(values) {
    const raw = new Map(values).get(MAIN);
    let node; try { node = parseLossless(raw); } catch (_) { stop('MAIN_LOSSLESS_PARSE'); }
    insist(node.type === 'object', 'MAIN_OBJECT'); return node;
  }
  function array(node, key) {
    const value = node.value.get(key);
    insist(value && value.type === 'array', 'MAIN_ARRAYS'); return value.value;
  }
  function fieldsEqual(a, b, excluded) {
    const x = { type: 'object', value: new Map([...a.value].filter(([key]) => !excluded.includes(key))) };
    const y = { type: 'object', value: new Map([...b.value].filter(([key]) => !excluded.includes(key))) };
    return equalNodes(x, y);
  }
  function fieldEqual(a, b, key) {
    return a.value.has(key) === b.value.has(key) && (!a.value.has(key) || equalNodes(a.value.get(key), b.value.get(key)));
  }
  function nonMainEqual(a, b) { return entryEqual(a.filter(p => p[0] !== MAIN), b.filter(p => p[0] !== MAIN)); }
  function records(x, y) { return { input: x.length, output: y.length,
    identicalAtSamePosition: x.filter((node, index) => index < y.length && equalNodes(node, y[index])).length,
    equalInFull: x.length === y.length && x.every((node, index) => equalNodes(node, y[index])) }; }
  function compare(a, b) {
    const x = main(a), y = main(b);
    return { localStorageKeys: { input: a.length, output: b.length },
      allRawPairsEqual: entryEqual(a, b), nonMainRawPairsEqual: nonMainEqual(a, b),
      mainLosslessEqual: equalNodes(x, y), mainPropertyCounts: { input: x.value.size, output: y.value.size },
      savedTracks: records(array(x, 'savedTracks'), array(y, 'savedTracks')),
      mapWaypoints: records(array(x, 'mapWaypoints'), array(y, 'mapWaypoints')),
      settingsEqual: fieldEqual(x, y, 'settings'),
      otherMainPropertiesEqual: fieldsEqual(x, y, ['savedTracks', 'mapWaypoints', 'settings']) };
  }
  function projection(baseline, candidate) {
    const b = main(baseline), c = main(candidate);
    const bt = array(b, 'savedTracks'), bw = array(b, 'mapWaypoints');
    const ct = array(c, 'savedTracks'), cw = array(c, 'mapWaypoints');
    insist(bt.length === 5 && bw.length === 0 && ct.length === 6 && cw.length === 200, 'PROJECTION_COUNTS');
    insist(bt.every((v, i) => equalNodes(v, ct[i])), 'PROJECTION_EXISTING_TRACKS');
    insist(nonMainEqual(baseline, candidate) && fieldsEqual(b, c, ['savedTracks', 'mapWaypoints']), 'PROJECTION_OTHER_DATA');
    const newTrack = ct[bt.length];
    insist(newTrack.type === 'object' && array(newTrack, 'points').length === 11, 'PROJECTION_SELECTED_TRACK');
    return { tracks: ct.slice(bt.length), waypoints: cw.slice(bw.length) };
  }
  function relative(baseline, candidate, selected) {
    const b = main(baseline), c = main(candidate);
    const bt = array(b, 'savedTracks'), bw = array(b, 'mapWaypoints');
    const ct = array(c, 'savedTracks'), cw = array(c, 'mapWaypoints');
    const expected = { type: 'object', value: new Map(b.value) };
    expected.value.set('savedTracks', { type: 'array', value: bt.concat(selected.tracks) });
    expected.value.set('mapWaypoints', { type: 'array', value: bw.concat(selected.waypoints) });
    return { expectedBaselinePlusOriginalSelectionEqual: equalNodes(expected, c) && nonMainEqual(baseline, candidate),
      existingHttpsTracksMatchBaseline: ct.length >= bt.length && bt.every((v, i) => equalNodes(v, ct[i])),
      existingHttpsWaypointsMatchBaseline: cw.length >= bw.length && bw.every((v, i) => equalNodes(v, cw[i])),
      addedTracksEqualOriginal: records(selected.tracks, ct.slice(bt.length)).equalInFull,
      addedWaypointsEqualOriginal: records(selected.waypoints, cw.slice(bw.length)).equalInFull,
      nonSelectedMainPropertiesMatchBaseline: fieldsEqual(b, c, ['savedTracks', 'mapWaypoints']),
      otherLocalStoragePairsMatchBaseline: nonMainEqual(baseline, candidate) };
  }
  return { compare, projection, relative };
}

async function main(configPath) {
  insist(process.platform === 'win32', 'WINDOWS_REQUIRED');
  insist(typeof configPath === 'string' && path.isAbsolute(configPath), 'CONFIG_PATH');
  const config = json(fs.readFileSync(configPath), 'CONFIG_JSON');
  insist(['SYNTHETIC_DRIVER', 'PRIVATE_QUALIFICATION'].includes(config.purpose), 'CONFIG_PURPOSE');
  insist(config.edgeExecutable === 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'EDGE_PATH');
  config.outputDirectory = confinedOutputDirectory(config.outputDirectory);
  const runtime = stableRead(config.runtimePath, RUNTIME_SHA, RUNTIME_BYTES, 'RUNTIME');
  const comparatorBytes = stableRead(config.comparatorPath, COMPARATOR_SHA, undefined, 'COMPARATOR');
  const { parseLossless, equalNodes } = compilePinnedModule(comparatorBytes, config.comparatorPath);
  insist(typeof parseLossless === 'function' && typeof equalNodes === 'function', 'COMPARATOR_API');
  const baselineBytes = stableRead(config.baseline.path, config.baseline.sha256, config.baseline.bytes, 'BASELINE');
  const candidateBytes = stableRead(config.candidate.path, config.candidate.sha256, config.candidate.bytes, 'CANDIDATE');
  const baselineEnvelope = json(baselineBytes, 'BASELINE_JSON');
  const candidateEnvelope = json(candidateBytes, 'CANDIDATE_JSON');
  insist(baselineEnvelope.formato === 'TMAR-GIS-P0-LOCALSTORAGE-V1' && baselineEnvelope.origine === ORIGIN &&
    baselineEnvelope.copertura === 'LOCALSTORAGE_ONLY', 'BASELINE_SCHEMA');
  insist(candidateEnvelope.formato === CANDIDATE_FORMAT && candidateEnvelope.origin === ORIGIN &&
    candidateEnvelope.status === 'PREPARED_NOT_APPLIED' && candidateEnvelope.coverage === 'LOCALSTORAGE_CANDIDATE_ONLY' &&
    candidateEnvelope.roundTrip === 'NOT_TESTED' &&
    candidateEnvelope.inputIdentities?.httpsLocalStorage?.artifactSHA256 === config.baseline.sha256, 'CANDIDATE_SCHEMA');
  const baseline = entries(baselineEnvelope.entries, 'BASELINE_ENTRIES');
  const candidate = entries(candidateEnvelope.entries, 'CANDIDATE_ENTRIES');
  const compare = makeComparisons(parseLossless, equalNodes);
  const selected = compare.projection(baseline, candidate);
  const runDirectory = fs.mkdtempSync(path.join(config.outputDirectory, 'p0-roundtrip-'));
  const receipt = { formato: 'TMAR-GIS-P0-ISOLATED-ROUNDTRIP-RECEIPT-V1', purpose: config.purpose,
    startedUTC: new Date().toISOString(), status: 'RUNNING', applicationAuthorized: false,
    operatorBrowserStorageModified: false, completeOriginBackup: false, dateRandomOverridden: false,
    runtime: { sha256: RUNTIME_SHA, bytes: RUNTIME_BYTES, build: 317 },
    comparatorSHA256: COMPARATOR_SHA, inputs: {
      baseline: { sha256: config.baseline.sha256, bytes: baselineBytes.length },
      candidate: { sha256: config.candidate.sha256, bytes: candidateBytes.length } },
    selectedCounts: { savedTracks: 1, trackPoints: 11, mapWaypoints: 200 }, arms: [] };
  try {
    const control = await runArm('baseline-https', baseline, config, runtime, runDirectory);
    receipt.arms.push(control.metadata);
    insist(control.metadata.status === 'COMPLETED', 'BASELINE_PROCEDURE_STOP');
    const experiment = await runArm('candidate', candidate, config, runtime, runDirectory);
    receipt.arms.push(experiment.metadata);
    insist(experiment.metadata.status === 'COMPLETED', 'CANDIDATE_PROCEDURE_STOP');
    insist(JSON.stringify(control.metadata.browser) === JSON.stringify(experiment.metadata.browser), 'BROWSER_VERSION_CHANGED');
    receipt.comparisons = { phases: [], stability: {} };
    for (let i = 0; i < control.privateSnapshots.length; i++) {
      const b = control.privateSnapshots[i], c = experiment.privateSnapshots[i];
      insist(b.phase === c.phase, 'PHASE_ALIGNMENT');
      receipt.comparisons.phases.push({ phase: b.phase,
        baselineAbsolute: compare.compare(baseline, b.entries),
        candidateAbsolute: compare.compare(candidate, c.entries),
        relativeCandidateToBaseline: compare.relative(b.entries, c.entries, selected) });
    }
    for (const [label, values] of [['baseline', control.privateSnapshots], ['candidate', experiment.privateSnapshots]]) {
      receipt.comparisons.stability[label] = {
        save1ToReload: compare.compare(values[1].entries, values[2].entries),
        save1ToSave2: compare.compare(values[1].entries, values[3].entries) };
    }
    receipt.losslessStructuralPreservationAtEveryObservedPhase = receipt.comparisons.phases.every(p =>
      p.baselineAbsolute.mainLosslessEqual && p.baselineAbsolute.nonMainRawPairsEqual &&
      p.candidateAbsolute.mainLosslessEqual && p.candidateAbsolute.nonMainRawPairsEqual);
    receipt.selectedRecordsPreservedAtEveryObservedPhase = receipt.comparisons.phases.every(p =>
      p.relativeCandidateToBaseline.addedTracksEqualOriginal && p.relativeCandidateToBaseline.addedWaypointsEqualOriginal);
    receipt.relativeProjectionEqualAtEveryObservedPhase = receipt.comparisons.phases.every(p =>
      p.relativeCandidateToBaseline.expectedBaselinePlusOriginalSelectionEqual);
    receipt.status = 'PROCEDURE_COMPLETED_REQUIRES_ASSESSMENT';
    receipt.roundTripProcedureExecuted = true;
    receipt.candidateApplicationReadiness = 'NOT_GRANTED_BY_THIS_RUNNER';
  } catch (e) { receipt.status = 'STOP'; receipt.reason = safeCode(e); }
  try {
    stableRead(config.baseline.path, config.baseline.sha256, config.baseline.bytes, 'BASELINE_FINAL');
    stableRead(config.candidate.path, config.candidate.sha256, config.candidate.bytes, 'CANDIDATE_FINAL');
    stableRead(config.runtimePath, RUNTIME_SHA, RUNTIME_BYTES, 'RUNTIME_FINAL');
    stableRead(config.comparatorPath, COMPARATOR_SHA, undefined, 'COMPARATOR_FINAL');
    receipt.inputFilesUnchanged = true;
  } catch (e) { receipt.inputFilesUnchanged = false; receipt.status = 'STOP'; receipt.reason = safeCode(e); }
  receipt.finishedUTC = new Date().toISOString();
  receipt.profilesAndPrivateSnapshotsPreserved = true;
  const artifact = ownWrite(path.join(runDirectory, 'receipt.json'), receipt);
  process.stdout.write(JSON.stringify({ status: receipt.status, runDirectory, receipt: artifact,
    applicationAuthorized: false, completeOriginBackup: false }) + '\n');
  return receipt.status === 'STOP' ? 2 : 0;
}

if (require.main === module) {
  main(process.argv[2]).then(code => { process.exitCode = code; }).catch(e => {
    process.stdout.write(JSON.stringify({ status: 'STOP', reason: safeCode(e),
      applicationAuthorized: false, completeOriginBackup: false }) + '\n');
    process.exitCode = 2;
  });
}
module.exports = { main };
