'use strict';
// One readonly browser-internal catalog observation; no GIS input, runtime or seed.
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
    this.closing = false; this.ownedBindingVerified = false; this.onEvent = () => {};
    this.fatal = new Promise((_, reject) => { this.rejectFatal = reject; });
    this.fatal.catch(() => {});
    ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data);
        if (message.id) {
          const p = this.pending.get(message.id);
          if (!p) return;
          clearTimeout(p.timer); this.pending.delete(message.id);
          if (message.error) {
            this.lastFailedCommand = { method: p.method,
              protocolCode: Number.isInteger(message.error.code) ? message.error.code : null };
            this.trip('CDP_COMMAND_FAILED'); p.reject(this.makeError('CDP_COMMAND_FAILED'));
          }
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
  markOwnedBindingVerified() { this.ownedBindingVerified = true; }
  send(method, params = {}, sessionId) {
    if (this.failure || this.closing) return Promise.reject(this.failure || this.makeError('CDP_SEND_AFTER_STOP'));
    return this.#sendWire(method, params, sessionId);
  }
  closeOwnedBrowser() {
    if (!this.ownedBindingVerified) return Promise.reject(this.makeError('CLEANUP_NOT_BOUND'));
    this.closing = true;
    return this.#sendWire('Browser.close', {}, undefined);
  }
  #sendWire(method, params, sessionId) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id); this.lastFailedCommand = { method, protocolCode: null };
        this.trip('CDP_TIMEOUT'); reject(this.makeError('CDP_TIMEOUT'));
      }, 20000);
      this.pending.set(id, { resolve, reject, timer, method });
      try { this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); }
      catch (_) { clearTimeout(timer); this.pending.delete(id); this.trip('CDP_SEND_FAILED'); reject(this.makeError('CDP_SEND_FAILED')); }
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
const EXPECTED_PRODUCT = 'Edg/157.0.4341.60';
const INTERNAL_URL = 'edge://extensions-internals/';
const MAX_CATALOG_BYTES = 8 * 1024 * 1024;
const KNOWN_TARGET_TYPES = new Set(['page', 'tab', 'browser', 'iframe', 'worker', 'service_worker',
  'shared_worker', 'background_page', 'webview']);
// Literal reporting only: unmatched tokens remain uninterpreted, never trusted.
const LOCATION_TOKENS = new Set(['INTERNAL', 'EXTERNAL_PREF', 'EXTERNAL_REGISTRY', 'UNPACKED',
  'COMPONENT', 'EXTERNAL_PREF_DOWNLOAD', 'EXTERNAL_POLICY_DOWNLOAD', 'COMMAND_LINE',
  'EXTERNAL_POLICY', 'EXTERNAL_COMPONENT', 'INVALID_LOCATION']);
const TYPE_TOKENS = new Set(['TYPE_EXTENSION']);
function shape(v) { return v === null ? 'NULL' : Array.isArray(v) ? 'ARRAY' : typeof v === 'object' ? 'OBJECT' : typeof v === 'string' ? 'STRING' : typeof v === 'number' ? 'NUMBER' : typeof v === 'boolean' ? 'BOOLEAN' : 'ABSENT'; }
function object(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function within(child, parent) {
  const relative = path.relative(parent, child);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
}
function literalToken(value, tokens) { return tokens.has(value) ? value : 'UNINTERPRETED'; }
function increment(map, key, count = 1) { map[key] = (map[key] || 0) + count; }
function targetClass(info) {
  let url = 'OTHER';
  if (info.url === '') url = 'EMPTY';
  else if (info.url === 'about:blank') url = 'ABOUT_BLANK';
  else if (typeof info.url !== 'string') url = 'NON_STRING';
  else if (info.url.startsWith('chrome-extension://')) url = 'EXTENSION';
  else if (info.url.startsWith('edge://')) url = 'EDGE_INTERNAL';
  else if (info.url.startsWith('chrome://')) url = 'CHROME_INTERNAL';
  else if (/^https?:/.test(info.url)) url = 'HTTP_HTTPS';
  return { type: KNOWN_TARGET_TYPES.has(info.type) ? info.type : 'OTHER', urlClass: url };
}
function aggregateTargets(infos) {
  const groups = new Map();
  for (const info of infos) {
    const cls = targetClass(info), key = JSON.stringify(cls);
    const group = groups.get(key) || { ...cls, count: 0 }; group.count++; groups.set(key, group);
  }
  return { total: infos.length, groups: [...groups.values()] };
}
function pathProvenance(reported, installationRoot, versionRoot) {
  if (reported === '') return 'EMPTY_REPORTED_PATH';
  if (!/^[A-Za-z]:[\\/]/.test(reported)) return 'NON_LOCAL_ABSOLUTE_OR_UNINTERPRETED';
  const resolved = path.resolve(reported);
  // Paths outside the fixed browser installation are classified without filesystem access.
  const logicalInstall = path.dirname(EDGE);
  if (!within(resolved, logicalInstall)) return 'OUTSIDE_BROWSER_INSTALLATION_NOT_READ';
  if (!installationRoot) return 'BROWSER_INSTALLATION_ROOT_NOT_OBSERVED';
  let physical;
  try { physical = fs.realpathSync.native(resolved); }
  catch (_) { return 'BROWSER_PATH_RESOLUTION_NOT_OBSERVED'; }
  if (!within(physical, installationRoot)) return 'REPORTED_BROWSER_PATH_RESOLVES_OUTSIDE';
  if (versionRoot && within(physical, versionRoot)) return 'PHYSICALLY_WITHIN_BOUND_BROWSER_VERSION';
  return 'PHYSICALLY_WITHIN_BROWSER_INSTALLATION_OTHER';
}
function emptyPermissionTotals() {
  return { sets: 0, setShapes: {}, fields: Object.fromEntries(['api', 'manifest', 'explicit_hosts', 'scriptable_hosts'].map(key =>
    [key, { shapes: {}, arrayEntries: 0, arrayElementShapes: {} }])) };
}
function addPermissionSet(totals, set) {
  totals.sets++; increment(totals.setShapes, shape(set));
  for (const key of Object.keys(totals.fields)) {
    const value = object(set) ? set[key] : undefined, summary = totals.fields[key];
    increment(summary.shapes, shape(value));
    if (Array.isArray(value)) {
      summary.arrayEntries += value.length;
      for (const entry of value) increment(summary.arrayElementShapes, shape(entry));
    }
  }
}
function recognizedPermissionSet(set) {
  if (!object(set)) return false;
  if (!['api', 'manifest', 'explicit_hosts', 'scriptable_hosts'].every(key => Array.isArray(set[key]))) return false;
  return ['api', 'manifest'].every(key => set[key].every(value => typeof value === 'string' || object(value))) &&
    ['explicit_hosts', 'scriptable_hosts'].every(key => set[key].every(value => typeof value === 'string'));
}
function summarizeCatalog(catalog, before, after, installationRoot, versionRoot) {
  insist(Array.isArray(catalog), 'CATALOG_ROOT_NOT_ARRAY');
  const ids = new Map();
  const invalidFields = {}, groups = new Map();
  const permissions = { active: emptyPermissionTotals(), withheld: emptyPermissionTotals(),
    optional: emptyPermissionTotals(), tabSpecific: emptyPermissionTotals(), tabSpecificContainerShapes: {} };
  let malformedRecords = 0, duplicateIds = 0, unrecognizedPermissionRecords = 0;
  for (const record of catalog) {
    let valid = object(record);
    for (const field of ['id', 'name', 'version', 'path', 'location', 'type']) {
      if (!object(record) || typeof record[field] !== 'string') { increment(invalidFields, field); valid = false; }
    }
    if (!object(record) || !Number.isSafeInteger(record.manifest_version)) { increment(invalidFields, 'manifest_version'); valid = false; }
    if (!object(record) || !object(record.permissions)) { increment(invalidFields, 'permissions'); valid = false; }
    if (!valid || record.id.length === 0 || record.id.length > 128) { malformedRecords++; continue; }
    if (ids.has(record.id)) { duplicateIds++; ids.get(record.id).push(record); }
    else ids.set(record.id, [record]);
    const provenance = pathProvenance(record.path, installationRoot, versionRoot);
    const cls = { locationLiteral: literalToken(record.location, LOCATION_TOKENS),
      typeLiteral: literalToken(record.type, TYPE_TOKENS), reportedPathClass: provenance,
      creationFlagsShape: shape(record.creation_flags) };
    const key = JSON.stringify(cls), group = groups.get(key) || { ...cls, count: 0 };
    group.count++; groups.set(key, group);
    for (const set of ['active', 'withheld', 'optional']) addPermissionSet(permissions[set], record.permissions[set]);
    const tabSpecific = record.permissions.tab_specific;
    increment(permissions.tabSpecificContainerShapes, shape(tabSpecific));
    if (object(tabSpecific)) for (const set of Object.values(tabSpecific)) addPermissionSet(permissions.tabSpecific, set);
    const permissionSchemaRecognized = ['active', 'withheld', 'optional'].every(set => recognizedPermissionSet(record.permissions[set])) &&
      object(tabSpecific) && Object.values(tabSpecific).every(recognizedPermissionSet);
    if (!permissionSchemaRecognized) unrecognizedPermissionRecords++;
  }
  function join(infos) {
    let extensionTargets = 0, matched = 0, unmatched = 0, ambiguous = 0, invalidExtensionUrl = 0;
    const extensionIds = new Set(), mappedGroups = new Map();
    for (const info of infos) {
      if (targetClass(info).urlClass !== 'EXTENSION') continue;
      extensionTargets++;
      let id;
      try { id = new URL(info.url).hostname; } catch (_) { invalidExtensionUrl++; continue; }
      if (!id) { invalidExtensionUrl++; continue; }
      extensionIds.add(id);
      const found = ids.get(id);
      if (!found) { unmatched++; continue; }
      if (found.length !== 1) { ambiguous++; continue; }
      matched++;
      const record = found[0];
      const cls = { targetType: targetClass(info).type,
        locationLiteral: literalToken(record.location, LOCATION_TOKENS),
        reportedPathClass: pathProvenance(record.path, installationRoot, versionRoot) };
      const key = JSON.stringify(cls), group = mappedGroups.get(key) || { ...cls, targetCount: 0 };
      group.targetCount++; mappedGroups.set(key, group);
    }
    return { extensionTargets, distinctObservedExtensionIdentifiers: extensionIds.size, matched,
      unmatched, ambiguous, invalidExtensionUrl, groups: [...mappedGroups.values()],
      allObservedExtensionTargetsMatchedUnambiguously: extensionTargets === matched && unmatched === 0 && ambiguous === 0 && invalidExtensionUrl === 0 };
  }
  return { records: catalog.length, uniqueIdentifiers: ids.size, malformedRecords, duplicateIds,
    unrecognizedPermissionRecords,
    invalidFieldCounts: invalidFields, groups: [...groups.values()], permissions,
    targetMappingBefore: join(before), targetMappingAfter: join(after),
    perRecordEnabledState: 'NOT_OBSERVED', effectiveIncognitoAccess: 'NOT_OBSERVED',
    effectivePolicy: 'NOT_OBSERVED', fullManifest: 'NOT_OBSERVED', publisherSignature: 'NOT_OBSERVED',
    packageOwnership: 'NOT_ATTESTED', completenessBeyondBrowserReportedSurface: 'NOT_ATTESTED',
    upstreamEdgeEquivalence: 'NOT_ATTESTED', componentAdmission: 'NOT_GRANTED' };
}
function writeBytes(file, bytes) {
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o600 });
  insist(fs.readFileSync(file).equals(bytes), 'OUTPUT_READBACK');
  return { file: path.basename(file), bytes: bytes.length, sha256: sha(bytes) };
}
async function main() {
  insist(process.platform === 'win32', 'WINDOWS_REQUIRED');
  const outputDirectory = confinedOutputDirectory(path.join(process.env.LOCALAPPDATA || '', 'TMAR-GIS', 'Backups'));
  const runDirectory = fs.mkdtempSync(path.join(outputDirectory, 'p0-extension-catalog-'));
  const profile = path.join(runDirectory, 'profile'); fs.mkdirSync(profile, { recursive: false });
  insist(fs.readdirSync(profile).length === 0, 'PROFILE_NOT_EMPTY');
  const receipt = { schema: 'TMAR-GIS-P0-BROWSER-EXTENSION-CATALOG-OBSERVATION-V1',
    purpose: 'READONLY_CATALOG_NO_GIS_INPUT', status: 'RUNNING', startedUTC: new Date().toISOString(),
    gisInputRead: false, gisRuntimeRead: false, seedSent: false, fallbackAttempted: false,
    extensionRegistrationChanged: false, extensionPolicyChanged: false, protectionsChanged: false,
    operatorBrowserStorageModified: false, profilePreserved: true, isolationQualified: false,
    dataUseAuthorizedByThisObservation: false, upstreamSourceCommit: '92bf36029638ae236920177e722650bed2a40e84',
    upstreamEdgeEquivalence: 'NOT_ATTESTED', acquisitionsAtomic: false, historicalTargetsReconstructed: false,
    navigationRequests: 0, pageNetworkRequestsIntercepted: 0, pageRequestDenialAcks: 0,
    consoleErrors: 0, runtimeExceptions: 0, phase: 'SETUP',
    installationRootObserved: false, browserVersionDirectoryObserved: false, artifacts: {} };
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
  let cdp, bound = false, sessionId, targetId, frameId, navigatedLoader;
  const loadedLoaders = new Set();
  try {
    insist(Number.isInteger(child.pid), 'BROWSER_SPAWN');
    receipt.phase = 'BROWSER_BINDING';
    cdp = await connectOwnBrowser(child, profile);
    const actualArgs = (await cdp.watch(cdp.send('Browser.getBrowserCommandLine'))).arguments;
    insist(Array.isArray(actualArgs) && actualArgs.every(x => typeof x === 'string'), 'BROWSER_ARGV');
    const profileArgs = actualArgs.filter(x => x.startsWith('--user-data-dir='));
    insist(profileArgs.length === 1 && path.resolve(profileArgs[0].slice(16)).toLowerCase() === profile.toLowerCase(), 'BROWSER_PROFILE_BINDING');
    for (const arg of args.slice(0, -1)) insist(actualArgs.includes(arg), 'BROWSER_REQUIRED_ARGV');
    const forbidden = ['--no-sandbox', '--disable-sandbox', '--disable-setuid-sandbox',
      '--disable-gpu-sandbox', '--disable-seccomp-filter-sandbox', '--disable-web-security',
      '--ignore-certificate-errors', '--single-process', '--no-zygote', '--allow-file-access-from-files',
      '--renderer-cmd-prefix', '--enable-unsafe-extension-debugging'];
    insist(!actualArgs.some(x => forbidden.includes(x.split('=')[0])), 'BROWSER_SECURITY_ARGV');
    const browserProcesses = (await cdp.watch(cdp.send('SystemInfo.getProcessInfo'))).processInfo.filter(p => p.type === 'browser');
    insist(browserProcesses.length === 1 && browserProcesses[0].id === child.pid && child.exitCode === null && !spawnFailed, 'BROWSER_PID_BINDING');
    bound = true; cdp.markOwnedBindingVerified();
    const version = await cdp.watch(cdp.send('Browser.getVersion'));
    insist(version.product === EXPECTED_PRODUCT, 'BROWSER_VERSION_CHANGED');
    receipt.browser = { product: version.product, protocolVersion: version.protocolVersion };
    receipt.binding = { ownDevToolsFile: true, ownProfileArgv: true, ownBrowserPid: true,
      sandboxDisableFlagsAbsent: true, noNewLaunchFlagsBeyondQualifiedDiagnostic: true,
      denyOnlyProxyNoForwarding: true };
    let installationRoot = null, versionRoot = null;
    try { installationRoot = fs.realpathSync.native(path.dirname(EDGE)); receipt.installationRootObserved = true; } catch (_) {}
    try {
      const expectedVersion = EXPECTED_PRODUCT.split('/')[1];
      versionRoot = fs.realpathSync.native(path.join(path.dirname(EDGE), expectedVersion));
      insist(installationRoot && within(versionRoot, installationRoot), 'VERSION_DIRECTORY_OUTSIDE_INSTALLATION');
      receipt.browserVersionDirectoryObserved = true;
    } catch (_) { versionRoot = null; }
    receipt.phase = 'TARGETS_BEFORE';
    const before = (await cdp.watch(cdp.send('Target.getTargets'))).targetInfos;
    const beforeUTC = new Date().toISOString();
    receipt.acquisitionTimes = { beforeUTC };
    receipt.targetSnapshots = { before: aggregateTargets(before) };
    receipt.artifacts.targetsBefore = ownWrite(path.join(runDirectory, 'targets-before-private.json'), {
      schema: 'TMAR-GIS-P0-OWNED-TARGET-SNAPSHOT-V1', acquiredUTC: beforeUTC, targetInfos: before });
    const pages = before.filter(t => t.type === 'page');
    insist(pages.length === 1 && pages[0].url === 'about:blank', 'INITIAL_TARGET');
    targetId = pages[0].targetId;
    sessionId = (await cdp.watch(cdp.send('Target.attachToTarget', { targetId, flatten: true }))).sessionId;
    insist(typeof sessionId === 'string', 'TARGET_SESSION');
    cdp.onEvent = async m => {
      if (m.sessionId !== sessionId || cdp.closing) return;
      if (m.method === 'Fetch.requestPaused') {
        receipt.pageNetworkRequestsIntercepted++;
        await cdp.send('Fetch.failRequest', { requestId: m.params.requestId, errorReason: 'BlockedByClient' }, sessionId);
        receipt.pageRequestDenialAcks++;
      } else if (m.method === 'Page.frameNavigated' && m.params.frame.id === frameId) {
        if (m.params.frame.url !== INTERNAL_URL) cdp.trip('UNEXPECTED_INTERNAL_NAVIGATION');
        else navigatedLoader = m.params.frame.loaderId;
      } else if (m.method === 'Page.lifecycleEvent' && m.params.frameId === frameId && m.params.name === 'load') {
        loadedLoaders.add(m.params.loaderId);
      } else if (m.method === 'Runtime.exceptionThrown') {
        receipt.runtimeExceptions++; cdp.trip('INTERNAL_PAGE_EXCEPTION');
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') receipt.consoleErrors++;
      else if (m.method === 'Page.javascriptDialogOpening') cdp.trip('UNEXPECTED_DIALOG');
    };
    receipt.phase = 'INTERNAL_PAGE_SETUP';
    for (const domain of ['Page.enable', 'Runtime.enable', 'Network.enable']) await cdp.watch(cdp.send(domain, {}, sessionId));
    await cdp.watch(cdp.send('Page.setLifecycleEventsEnabled', { enabled: true }, sessionId));
    await cdp.watch(cdp.send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId));
    await cdp.watch(cdp.send('Network.setBypassServiceWorker', { bypass: true }, sessionId));
    await cdp.watch(cdp.send('Browser.setDownloadBehavior', { behavior: 'deny' }));
    await cdp.watch(cdp.send('Fetch.enable', { patterns: [
      { urlPattern: 'http://*', requestStage: 'Request' }, { urlPattern: 'https://*', requestStage: 'Request' },
      { urlPattern: 'ws://*', requestStage: 'Request' }, { urlPattern: 'wss://*', requestStage: 'Request' }] }, sessionId));
    frameId = (await cdp.watch(cdp.send('Page.getFrameTree', {}, sessionId))).frameTree.frame.id;
    receipt.phase = 'INTERNAL_NAVIGATION';
    receipt.navigationRequests++;
    const navigation = await cdp.watch(cdp.send('Page.navigate', { url: INTERNAL_URL }, sessionId));
    insist(!navigation.errorText, 'INTERNAL_SURFACE_NAVIGATION_FAILED');
    const deadline = Date.now() + 25000;
    while (!(navigatedLoader && loadedLoaders.has(navigatedLoader)) && Date.now() < deadline) await cdp.watch(pause(100));
    insist(navigatedLoader && loadedLoaders.has(navigatedLoader), 'INTERNAL_SURFACE_LOAD_TIMEOUT');
    receipt.phase = 'RESOURCE_BINDING';
    const resourceTree = (await cdp.watch(cdp.send('Page.getResourceTree', {}, sessionId))).frameTree;
    insist(resourceTree.frame.id === frameId && resourceTree.frame.url === INTERNAL_URL,
      'INTERNAL_RESOURCE_BINDING');
    insist(resourceTree.frame.mimeType === 'text/plain', 'INTERNAL_RESOURCE_NOT_TEXT_PLAIN');
    receipt.phase = 'RESOURCE_READ';
    const content = await cdp.watch(cdp.send('Page.getResourceContent', { frameId, url: INTERNAL_URL }, sessionId));
    insist(typeof content.content === 'string' && typeof content.base64Encoded === 'boolean', 'INTERNAL_RESOURCE_SCHEMA');
    const bytes = content.base64Encoded ? Buffer.from(content.content, 'base64') : Buffer.from(content.content, 'utf8');
    insist(bytes.length > 0 && bytes.length <= MAX_CATALOG_BYTES, 'CATALOG_SIZE');
    receipt.artifacts.catalog = writeBytes(path.join(runDirectory, 'catalog-resource-private.txt'), bytes);
    const catalogUTC = new Date().toISOString();
    receipt.acquisitionTimes.catalogUTC = catalogUTC;
    receipt.phase = 'CATALOG_PARSE';
    let catalog;
    try { catalog = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
    catch (_) { stop('CATALOG_JSON_UNINTERPRETABLE'); }
    receipt.phase = 'TARGETS_AFTER';
    const after = (await cdp.watch(cdp.send('Target.getTargets'))).targetInfos;
    const afterUTC = new Date().toISOString();
    receipt.acquisitionTimes.afterUTC = afterUTC;
    receipt.targetSnapshots.after = aggregateTargets(after);
    receipt.artifacts.targetsAfter = ownWrite(path.join(runDirectory, 'targets-after-private.json'), {
      schema: 'TMAR-GIS-P0-OWNED-TARGET-SNAPSHOT-V1', acquiredUTC: afterUTC, targetInfos: after });
    insist(after.some(t => t.targetId === targetId && t.type === 'page' && t.url === INTERNAL_URL), 'FINAL_TARGET_BINDING');
    receipt.phase = 'CATALOG_ASSESSMENT';
    const summary = summarizeCatalog(catalog, before, after, installationRoot, versionRoot);
    receipt.catalog = summary;
    insist(summary.malformedRecords === 0 && summary.duplicateIds === 0 && summary.unrecognizedPermissionRecords === 0, 'CATALOG_SCHEMA_NOT_QUALIFIED');
    cdp.check(); receipt.status = 'OBSERVATION_COMPLETED_REQUIRES_ASSESSMENT'; receipt.phase = 'OBSERVATION_COMPLETED';
  } catch (e) {
    if (cdp) cdp.trip(safeCode(e));
    receipt.status = 'STOP'; receipt.reason = safeCode(e);
    if (cdp && cdp.lastFailedCommand) receipt.failedCommand = cdp.lastFailedCommand;
  } finally {
    if (cdp && bound) {
      await cdp.closeOwnedBrowser().catch(() => {});
      const exit = await Promise.race([exited, pause(12000).then(() => null)]);
      receipt.closure = exit && !exit.spawnFailed ? 'OWN_BROWSER_EXIT_OBSERVED' : 'OWN_BROWSER_EXIT_NOT_CONFIRMED';
      receipt.ownBrowserExitCode = exit && typeof exit.code === 'number' ? exit.code : null;
    } else receipt.closure = child.exitCode !== null || spawnFailed ? 'OWN_SPAWN_ALREADY_EXITED' : 'NOT_ATTEMPTED_UNBOUND';
    if (cdp) { cdp.closing = true; cdp.ws.close(); }
    await proxy.close(); receipt.proxy = proxy.counts;
    if (receipt.status === 'OBSERVATION_COMPLETED_REQUIRES_ASSESSMENT' && receipt.closure !== 'OWN_BROWSER_EXIT_OBSERVED') {
      receipt.status = 'STOP'; receipt.reason = 'OWN_BROWSER_EXIT_NOT_CONFIRMED';
    }
  }
  receipt.finishedUTC = new Date().toISOString();
  const artifact = ownWrite(path.join(runDirectory, 'receipt.json'), receipt);
  process.stdout.write(JSON.stringify({ status: receipt.status, purpose: receipt.purpose, reason: receipt.reason || null,
    runDirectory, receipt: artifact, isolationQualified: false, dataUseAuthorizedByThisObservation: false }) + '\n');
  return receipt.status === 'STOP' ? 2 : 0;
}
if (require.main === module) main().then(code => { process.exitCode = code; }).catch(e => {
  process.stdout.write(JSON.stringify({ status: 'STOP', reason: safeCode(e),
    purpose: 'READONLY_CATALOG_NO_GIS_INPUT', isolationQualified: false }) + '\n');
  process.exitCode = 2;
});
