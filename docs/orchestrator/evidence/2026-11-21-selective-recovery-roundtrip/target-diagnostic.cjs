'use strict';
// Diagnostic only: no input files, HTML, storage seed or page navigation.
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');
const SAFE_CODES = new Set();
function stop(code) { SAFE_CODES.add(code); const e = new Error(code); e.safeCode = code; throw e; }
function insist(ok, code) { if (!ok) stop(code); }
function safeCode(e) { return e && SAFE_CODES.has(e.safeCode) ? e.safeCode : 'LOCAL_OPERATION_FAILED'; }
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

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

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const KNOWN_TYPES = new Set(['page', 'tab', 'browser', 'iframe', 'worker', 'service_worker',
  'shared_worker', 'background_page', 'webview']);
function typeClass(value) { return KNOWN_TYPES.has(value) ? value : 'OTHER'; }
function urlClass(value) {
  if (typeof value !== 'string') return 'NON_STRING';
  if (value === '') return 'EMPTY';
  if (value === 'about:blank') return 'ABOUT_BLANK';
  if (value.startsWith('edge://')) return 'EDGE_INTERNAL';
  if (value.startsWith('chrome://')) return 'CHROME_INTERNAL';
  if (value.startsWith('chrome-extension://')) return 'EXTENSION';
  if (/^https?:/.test(value)) return 'HTTP_HTTPS';
  if (value.startsWith('data:')) return 'DATA';
  if (value.startsWith('blob:')) return 'BLOB';
  return 'OTHER';
}
function contextClass(value, selected) {
  if (value === undefined && selected === undefined) return 'BOTH_UNSPECIFIED';
  if (value === undefined || selected === undefined) return 'ONLY_ONE_PRESENT';
  return value === selected ? 'SAME' : 'DIFFERENT';
}
function summarizer() {
  const groups = new Map(), identities = new Set();
  let events = 0;
  return {
    add(summary, id) {
      insist(typeof id === 'string', 'TARGET_METADATA_SCHEMA');
      const key = JSON.stringify(summary);
      const group = groups.get(key) || { ...summary, count: 0, ids: new Set() };
      group.count++; group.ids.add(id); groups.set(key, group); identities.add(id); events++;
    },
    output() {
      return { eventCount: events, distinctTargets: identities.size,
        groups: [...groups.values()].map(({ ids, ...rest }) => ({ ...rest, distinctTargets: ids.size })) };
    }
  };
}
async function main() {
  insist(process.platform === 'win32', 'WINDOWS_REQUIRED');
  const outputDirectory = confinedOutputDirectory(path.join(process.env.LOCALAPPDATA || '', 'TMAR-GIS', 'Backups'));
  const runDirectory = fs.mkdtempSync(path.join(outputDirectory, 'p0-roundtrip-targetdiag-'));
  const profile = path.join(runDirectory, 'profile');
  fs.mkdirSync(profile, { recursive: false });
  insist(fs.readdirSync(profile).length === 0, 'PROFILE_NOT_EMPTY');
  const receipt = { formato: 'TMAR-GIS-P0-TARGET-DIAGNOSTIC-V1', purpose: 'TARGET_DIAGNOSTIC_NO_INPUT',
    startedUTC: new Date().toISOString(), status: 'RUNNING', inputFilesRead: false, runtimeRead: false,
    seedInstalled: false, pageNavigationRequested: false, pageJavaScriptEvaluated: false,
    individualTargetsClosed: false, targetExecutionResumed: false, operatorBrowserStorageModified: false,
    runnerFreezePreserved: 'e599617315843662cf121507d86ab3d7e03d8e9eaf2e5242562b4935d42f67e8',
    profilePreserved: true, applicationAuthorized: false, diagnosticObservationMaximumMs: 3000,
    stopAtFirstUnexpected: true, isolation: {}, firstUnexpected: null };
  const inventory = summarizer(), events = summarizer();
  const proxy = await denyProxy();
  const args = ['--headless=new', '--enable-automation', '--remote-debugging-port=0',
    '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
    '--disable-extensions', '--disable-gpu', '--disable-quic',
    '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
    '--proxy-server=http://127.0.0.1:' + proxy.port, '--proxy-bypass-list=<-loopback>',
    '--window-size=1440,900', 'about:blank'];
  const child = spawn(EDGE, args, { stdio: 'ignore', windowsHide: true });
  let spawnFailed = false;
  const exited = new Promise(resolve => {
    child.once('exit', (code, signal) => resolve({ code, signal }));
    child.once('error', () => { spawnFailed = true; resolve({ spawnFailed: true }); });
  });
  let cdp, bound = false, phase = 'BINDING', selectedTarget, selectedSession, selectedContext;
  let observationStopped = false;
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
    receipt.browser = { product: version.product, protocolVersion: version.protocolVersion };
    receipt.isolation = { freshExclusiveProfile: true, devToolsFileFromOwnProfile: true,
      commandLineProfileVerified: true, browserPidVerified: true, sandboxDisableFlagsAbsent: true,
      nativeSpawnWithoutLibraryDefaults: true, denyOnlyProxyNoForwarding: true };
    phase = 'INITIAL_INVENTORY';
    const targets = await cdp.watch(cdp.send('Target.getTargets'));
    const pages = targets.targetInfos.filter(t => t.type === 'page');
    insist(pages.length === 1 && pages[0].url === 'about:blank', 'INITIAL_TARGET');
    selectedTarget = pages[0].targetId; selectedContext = pages[0].browserContextId;
    for (const info of targets.targetInfos) inventory.add({ type: typeClass(info.type),
      urlClass: urlClass(info.url), selectedTarget: info.targetId === selectedTarget,
      attached: typeof info.attached === 'boolean' ? info.attached : null,
      contextClass: contextClass(info.browserContextId, selectedContext) }, info.targetId);
    selectedSession = (await cdp.watch(cdp.send('Target.attachToTarget', {
      targetId: selectedTarget, flatten: true }))).sessionId;
    insist(typeof selectedSession === 'string', 'TARGET_SESSION');
    cdp.onEvent = m => {
      if (observationStopped) return;
      if (!['Target.attachedToTarget', 'Target.targetCreated'].includes(m.method)) return;
      const info = m.params.targetInfo;
      const summary = { phase, eventKind: m.method === 'Target.attachedToTarget' ? 'ATTACHED' : 'CREATED',
        type: typeClass(info.type), urlClass: urlClass(info.url), selectedTarget: info.targetId === selectedTarget,
        waitingForDebugger: typeof m.params.waitingForDebugger === 'boolean' ? m.params.waitingForDebugger : null,
        attached: typeof info.attached === 'boolean' ? info.attached : null,
        contextClass: contextClass(info.browserContextId, selectedContext),
        sessionClass: m.sessionId === undefined ? 'ROOT' : m.sessionId === selectedSession ? 'SELECTED_PAGE' : 'OTHER' };
      events.add(summary, info.targetId);
      // These are precisely the frozen runner's two predicates. No target type is admitted.
      const unexpected = (m.method === 'Target.attachedToTarget' && info.targetId !== selectedTarget) ||
        (m.method === 'Target.targetCreated' && info.type === 'page' && info.targetId !== selectedTarget);
      if (unexpected) {
        observationStopped = true; receipt.firstUnexpected = summary;
        receipt.observationStoppedAtFirstUnexpected = true;
        cdp.trip('UNEXPECTED_TARGET_OBSERVED');
      }
    };
    // Match the original sequence before discovery. No Runtime.evaluate or Page.navigate is used.
    for (const method of ['Page.enable', 'Runtime.enable', 'Network.enable'])
      await cdp.watch(cdp.send(method, {}, selectedSession));
    await cdp.watch(cdp.send('Page.setLifecycleEventsEnabled', { enabled: true }, selectedSession));
    phase = 'DISCOVERY';
    await cdp.watch(cdp.send('Target.setDiscoverTargets', { discover: true }));
    phase = 'AUTOATTACH';
    await cdp.watch(cdp.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true,
      flatten: true, filter: [{ type: 'page', exclude: true }, {}] }));
    phase = 'BOUNDED_OBSERVATION';
    await cdp.watch(pause(3000));
    cdp.check();
    observationStopped = true;
    receipt.status = 'NO_UNEXPECTED_TARGET_OBSERVED_IN_WINDOW';
    receipt.observationStoppedAtFirstUnexpected = false;
  } catch (e) {
    observationStopped = true;
    receipt.status = 'STOP'; receipt.reason = safeCode(e);
  } finally {
    receipt.lastPhase = phase;
    receipt.initialInventory = inventory.output(); receipt.events = events.output();
    receipt.eventCountsExcludeEventsAfterStop = true;
    if (cdp && bound) {
      cdp.closing = true;
      await cdp.send('Browser.close').catch(() => {});
      const exit = await Promise.race([exited, pause(12000).then(() => null)]);
      receipt.closure = exit && !exit.spawnFailed ? 'OWN_BROWSER_EXIT_OBSERVED' : 'OWN_BROWSER_EXIT_NOT_CONFIRMED';
      receipt.ownBrowserExitCode = exit && typeof exit.code === 'number' ? exit.code : null;
    } else {
      receipt.closure = child.exitCode !== null || spawnFailed ? 'OWN_SPAWN_ALREADY_EXITED' : 'NOT_ATTEMPTED_UNBOUND';
    }
    if (cdp) { cdp.closing = true; cdp.ws.close(); }
    await proxy.close(); receipt.proxy = proxy.counts;
  }
  receipt.finishedUTC = new Date().toISOString();
  receipt.qualifiesRuntimeOrRecovery = false;
  const artifact = ownWrite(path.join(runDirectory, 'receipt.json'), receipt);
  process.stdout.write(JSON.stringify({ status: receipt.status, purpose: receipt.purpose,
    reason: receipt.reason || null, runDirectory, receipt: artifact, qualifiesRuntimeOrRecovery: false }) + '\n');
  return receipt.status === 'STOP' ? 2 : 0;
}
if (require.main === module) main().then(code => { process.exitCode = code; }).catch(e => {
  process.stdout.write(JSON.stringify({ status: 'STOP', reason: safeCode(e),
    purpose: 'TARGET_DIAGNOSTIC_NO_INPUT', qualifiesRuntimeOrRecovery: false }) + '\n');
  process.exitCode = 2;
});
