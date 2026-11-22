"use strict";
// Targeted Build318 visual QA: owned Edge, empty profile, no private data.
// Isolation helpers derived from the pinned P0 runner; no P0 PASS is inherited.
// Decision A boundary is owned Edge plus the pinned component catalog, NOT AppContainer.
const fs=require('fs'),path=require('path'),http=require('http'),crypto=require('crypto');
const {spawn}=require('child_process');
const EXPECTED_BROWSER_PRODUCT='Edg/157.0.4341.60';
const TRUSTED_CATALOG_SHA='00888441d1c8be3a355daf53f90afee144886bfb0388c9c6ed573ccf08b57f12';
const TRUSTED_CATALOG_BYTES=19594;
const DEFAULT_EDGE='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DEFAULT_CATALOG='C:\\Users\\mrhz\\AppData\\Local\\TMAR-GIS\\Backups\\p0-extension-catalog-rMIOLk\\catalog-resource-private.txt';
const BASELINE_SOURCE='C:\\Users\\mrhz\\AppData\\Local\\Temp\\tmar-gis-p0-roundtrip-runtime-ed760bbd.html';
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
            this.lastFailedCommand = { method: p.method, protocolCode: Number.isInteger(message.error.code) ? message.error.code : null };
            this.trip('CDP_COMMAND_FAILED'); p.reject(this.makeError('CDP_COMMAND_FAILED'));
          } else {
            if (p.telemetry && p.telemetry.onAck) p.telemetry.onAck();
            p.resolve(message.result || {});
          }
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
  send(method, params = {}, sessionId, telemetry) {
    // Check and ws.send execute in the same synchronous segment, without await.
    if (this.failure || this.closing) return Promise.reject(this.failure || this.makeError('CDP_SEND_AFTER_STOP'));
    return this.#sendWire(method, params, sessionId, telemetry);
  }
  closeOwnedBrowser() {
    if (!this.ownedBindingVerified) return Promise.reject(this.makeError('CLEANUP_NOT_BOUND'));
    this.closing = true;
    return this.#sendWire('Browser.close', {}, undefined, undefined);
  }
  #sendWire(method, params, sessionId, telemetry) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id); this.lastFailedCommand = { method, protocolCode: null };
        this.trip('CDP_TIMEOUT'); reject(this.makeError('CDP_TIMEOUT'));
      }, 20000);
      this.pending.set(id, { resolve, reject, timer, method, telemetry });
      try {
        this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
        if (telemetry && telemetry.onQueued) telemetry.onQueued();
      } catch (_) {
        clearTimeout(timer); this.pending.delete(id); this.trip('CDP_SEND_FAILED'); reject(this.makeError('CDP_SEND_FAILED'));
      }
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


const METRICS_JS="() => {\n  const rect = r => ({x:r.x,y:r.y,width:r.width,height:r.height,left:r.left,top:r.top,right:r.right,bottom:r.bottom});\n  const ident = el => el ? el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+\n      Array.from(el.classList||[]).slice(0,4).map(x=>'.'+x).join('') : null;\n  const measure = el => {\n    const r=el.getBoundingClientRect(), c=getComputedStyle(el);\n    const points=[];\n    if (r.width>0 && r.height>0) for (const fy of [.15,.5,.85]) for (const fx of [.15,.5,.85]) {\n      const x=r.left+r.width*fx,y=r.top+r.height*fy;\n      const inViewport=x>=0&&y>=0&&x<innerWidth&&y<innerHeight;\n      const hit=inViewport?document.elementFromPoint(x,y):null;\n      points.push({x,y,inViewport,hit:ident(hit),reaches:!!hit&&(hit===el||el.contains(hit))});\n    }\n    const ancestors=[];\n    for (let p=el.parentElement;p;p=p.parentElement) {\n      const pc=getComputedStyle(p);\n      if (['auto','scroll','hidden','clip'].includes(pc.overflowX)||['auto','scroll','hidden','clip'].includes(pc.overflowY))\n        ancestors.push({element:ident(p),rect:rect(p.getBoundingClientRect()),overflowX:pc.overflowX,overflowY:pc.overflowY,position:pc.position});\n    }\n    return {element:ident(el),rect:rect(r),display:c.display,visibility:c.visibility,\n      position:c.position,zIndex:c.zIndex,overflowX:c.overflowX,overflowY:c.overflowY,\n      clientWidth:el.clientWidth,clientHeight:el.clientHeight,scrollWidth:el.scrollWidth,\n      scrollHeight:el.scrollHeight,scrollLeft:el.scrollLeft,\n      hasClientRects:el.getClientRects().length>0,\n      inViewport:r.width>0&&r.height>0&&r.left>=-.5&&r.top>=-.5&&r.right<=innerWidth+.5&&r.bottom<=innerHeight+.5,\n      hitSamples:points,hitCount:points.filter(x=>x.reaches).length,overflowAncestors:ancestors};\n  };\n  const selectors=['#appTopbar','.app-topbar-actions','#gisExportMenu','#gisExportSummary',\n    '.gis-export-options','#gisExportPrint','#gisExportJpg','#gisMapMount',\n    '#gisMapMount .tile-map','#gisMapMount .tile-map .tile-ctrls',\n    '#gisMapMount .tile-map .tile-readout','#gisMobileToolbarToggle','#tabDrawer',\n    '#tabDrawerClose','#toolsDrawer','#toolsDrawerClose','.twpt-exp','.ttrk-exp'];\n  const elements={};\n  for (const selector of selectors) elements[selector]=Array.from(document.querySelectorAll(selector)).slice(0,30).map(measure);\n  const tabs=Array.from(document.querySelectorAll('#appTopbar .app-tab')).map(el=>{\n    const lbl=el.querySelector('.app-tab-lbl');\n    return {tab:el.dataset.tab,ariaLabel:el.getAttribute('aria-label'),\n      ariaLabelledby:el.getAttribute('aria-labelledby'),title:el.getAttribute('title'),\n      i18nAria:el.getAttribute('data-i18n-aria'),labelText:lbl?lbl.textContent.trim():null,\n      labelDisplay:lbl?getComputedStyle(lbl).display:null,measurement:measure(el)};\n  });\n  return {build:typeof APP_BUILD_NUM==='undefined'?null:APP_BUILD_NUM,\n    bodyClass:document.body.className,viewport:{width:innerWidth,height:innerHeight,\n      visualWidth:visualViewport?visualViewport.width:null,visualHeight:visualViewport?visualViewport.height:null,\n      coarse:matchMedia('(pointer:coarse)').matches,hoverNone:matchMedia('(hover:none)').matches,\n      portrait:matchMedia('(orientation:portrait)').matches,dpr:devicePixelRatio},\n    document:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,\n      clientHeight:document.documentElement.clientHeight,scrollHeight:document.documentElement.scrollHeight},\n    menuOpen:!!document.querySelector('#gisExportMenu')?.open,\n    activeElement:ident(document.activeElement),elements,tabs,\n    geolocationCalls:window.__BUILD318_QA_GEO||null,\n    stateCounts:typeof state==='object'?{tracks:Array.isArray(state.savedTracks)?state.savedTracks.length:null,\n      waypoints:Array.isArray(state.mapWaypoints)?state.mapWaypoints.length:null}:null};\n}";
const GEO_COUNTER_JS="(() => {\n  const counts={getCurrentPosition:0,watchPosition:0,clearWatch:0,wrapped:[]};\n  Object.defineProperty(window,'__BUILD318_QA_GEO',{value:counts});\n  const geo=navigator.geolocation;\n  if (!geo) return;\n  for (const name of ['getCurrentPosition','watchPosition','clearWatch']) {\n    try { const original=geo[name];\n      Object.defineProperty(geo,name,{configurable:true,value:function(...args){counts[name]++;return original.apply(this,args);}});\n      counts.wrapped.push(name);\n    } catch (_) {}\n  }\n})();";

function expression(fn,...args){return '('+fn.toString()+')('+args.map(x=>JSON.stringify(x)).join(',')+');';}
function ownWriteBytes(file,bytes){
  fs.writeFileSync(file,bytes,{flag:'wx',mode:0o600});
  insist(fs.readFileSync(file).equals(bytes),'BINARY_OUTPUT_READBACK');
  return {file:path.basename(file),bytes:bytes.length,sha256:sha(bytes)};
}
function allowedSource(file){
  insist(typeof file==='string'&&path.isAbsolute(file),'RUNTIME_PATH');
  const resolved=path.resolve(file),physical=fs.realpathSync.native(resolved);
  if(resolved.toLowerCase()===path.resolve(BASELINE_SOURCE).toLowerCase())return;
  const recovery=path.join(process.env.LOCALAPPDATA||'','TMAR-GIS','Recovery');
  const roots=[path.resolve(recovery),fs.realpathSync.native(recovery)];
  for(const [candidate,base] of [[resolved,roots[0]],[physical,roots[1]]]){
    const rel=path.relative(base,candidate),first=rel.split(path.sep)[0];
    insist(!path.isAbsolute(rel)&&!rel.startsWith('..')&&/^Build318-[A-Za-z0-9_-]+$/.test(first)&&/\.html$/i.test(candidate),'RUNTIME_OUTSIDE_ALLOWED_SOURCE');
  }
}
async function ownLoopback(runtime){
  const counts={served:0,denied:0};
  const sockets=new Set();
  const server=http.createServer((request,response)=>{
    if(request.method==='GET'&&request.url==='/runtime.html'){
      counts.served++;response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Length':runtime.length,'Cache-Control':'no-store'});response.end(runtime);
    }else{counts.denied++;response.writeHead(403,{'Content-Length':'0','Connection':'close'});response.end();}
  });
  server.on('connection',socket=>{sockets.add(socket);socket.on('close',()=>sockets.delete(socket));socket.on('error',()=>{});});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return {origin:'http://127.0.0.1:'+server.address().port,counts,async close(){for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));}};
}
async function runViewport(viewport, config, runtime, runDirectory, trustedComponentIds) {
  const label=viewport.name;
  const local=await ownLoopback(runtime);
  const ORIGIN=local.origin,DOCUMENT_URL=ORIGIN+'/runtime.html';
  const armDirectory = path.join(runDirectory, label);
  fs.mkdirSync(armDirectory, { recursive: false });
  const profile = path.join(armDirectory, 'profile');
  fs.mkdirSync(profile, { recursive: false });
  insist(fs.readdirSync(profile).length === 0, 'PROFILE_NOT_EMPTY');
  const proxy = await denyProxy();
  const counts = { documentsFulfilled: 0, requestsDenied: 0, consoleErrors: 0, consoleWarnings: 0,
    runtimeExceptions: 0, unexpectedTargets: 0, dialogsObserved: 0 };
  const result = { label, viewport, status: 'RUNNING', isolation: {}, counts, steps: [], closure: 'NOT_STARTED' };
  const trustedAccessoryTargets = new Set(), observedComponentIds = new Set(), unqualifiedTargetIds = new Set();
  function trustedAccessory(info) {
    if (!info || typeof info.url !== 'string') return false;
    let url; try { url = new URL(info.url); } catch (_) { return false; }
    if (url.protocol !== 'chrome-extension:' || !trustedComponentIds.has(url.hostname)) return false;
    trustedAccessoryTargets.add(info.targetId); observedComponentIds.add(url.hostname); return true;
  }
  const args = ['--headless=new', '--enable-automation', '--remote-debugging-port=0',
    '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
    '--disable-extensions', '--disable-gpu', '--disable-quic',
    '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
    '--proxy-server=http://127.0.0.1:' + proxy.port, '--proxy-bypass-list=<-loopback>',
    '--window-size='+viewport.width+','+viewport.height, 'about:blank'];
  const child = spawn(config.edgeExecutable, args, { stdio: 'ignore', windowsHide: true });
  let spawnFailed = false;
  const exited = new Promise(resolve => {
    child.once('exit', (code, signal) => resolve({ code, signal }));
    child.once('error', () => { spawnFailed = true; resolve({ spawnFailed: true }); });
  });
  let cdp, bound = false, sessionId, targetId, tabTargetId, tabSessionId, pageWaiting = false, mainFrameId, currentLoaderId, documentAllowed = false;
  function rejectTarget(code, info, eventKind) {
    counts.unexpectedTargets++; unqualifiedTargetIds.add(info.targetId);
    const knownTypes = ['page', 'tab', 'iframe', 'worker', 'service_worker', 'shared_worker', 'background_page'];
    result.firstUnexpectedTarget = { eventKind, type: knownTypes.includes(info.type) ? info.type : 'OTHER',
      urlClass: info.url === 'about:blank' ? 'ABOUT_BLANK' : typeof info.url === 'string' && info.url.startsWith('chrome-extension:') ? 'EXTENSION' : 'OTHER' };
    cdp.trip(code);
  }
  const loadedLoaders = new Set();
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
    bound = true; cdp.markOwnedBindingVerified();
    const version = await cdp.watch(cdp.send('Browser.getVersion'));
    insist(version.product === EXPECTED_BROWSER_PRODUCT, 'BROWSER_OUTSIDE_ACCEPTED_A');
    result.browser = { product: version.product, protocolVersion: version.protocolVersion };
    result.isolation = { freshExclusiveProfile: true, devToolsFileFromOwnProfile: true,
      commandLineProfileVerified: true, browserPidVerified: true, sandboxDisableFlagsAbsent: true,
      nativeSpawnWithoutLibraryDefaults: true, denyOnlyProxyNoForwarding: true,
      profilePreserved: true, runtimeBytesUnmodified: true, acceptedTrustBoundary: 'OWNED_EDGE_AND_PINNED_COMPONENTS_A' };
    const targets = await cdp.watch(cdp.send('Target.getTargets'));
    const pages = targets.targetInfos.filter(t => t.type === 'page' && !trustedAccessory(t));
    insist(pages.length === 1 && pages[0].url === 'about:blank', 'INITIAL_TARGET');
    targetId = pages[0].targetId;
    for (const info of targets.targetInfos)
      insist(info.targetId === targetId || trustedAccessory(info), 'INITIAL_ACCESSORY_NOT_IN_ACCEPTED_CATALOG');
    const tabTargets = await cdp.watch(cdp.send('Target.getTargets', { filter: [{ type: 'tab' }, { exclude: true }] }));
    const candidates = tabTargets.targetInfos.filter(t => t.type === 'tab' && t.url === 'about:blank');
    insist(candidates.length === 1, 'OWNED_TAB_CANDIDATE_AMBIGUOUS');
    tabTargetId = candidates[0].targetId;
    tabSessionId = (await cdp.watch(cdp.send('Target.attachToTarget', { targetId: tabTargetId, flatten: true }))).sessionId;
    insist(typeof tabSessionId === 'string', 'TAB_SESSION');
    cdp.onEvent = async m => {
      if (cdp.failure || cdp.closing) return;
      if (m.method === 'Target.attachedToTarget') {
        const info = m.params.targetInfo;
        // The manual tab attach event may be delivered after its response.
        if (m.sessionId === undefined && info.type === 'tab' && info.targetId === tabTargetId && m.params.sessionId === tabSessionId) return;
        if (m.sessionId !== tabSessionId || info.type !== 'page' || info.targetId !== targetId ||
            (sessionId && sessionId !== m.params.sessionId)) {
          rejectTarget('UNQUALIFIED_TAB_PAGE_RELATION', info, 'ATTACHED'); return;
        }
        sessionId = m.params.sessionId; pageWaiting = m.params.waitingForDebugger === true;
        result.isolation.tabToExactSelectedPageObserved = true;
        return;
      }
      if (m.method === 'Target.targetCreated' || m.method === 'Target.targetInfoChanged') {
        const info = m.params.targetInfo;
        if (info.targetId !== targetId && info.targetId !== tabTargetId && !trustedAccessory(info)) {
          rejectTarget('TARGET_OUTSIDE_ACCEPTED_BOUNDARY', info, m.method === 'Target.targetCreated' ? 'CREATED' : 'INFO_CHANGED');
        }
        return;
      }
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
        counts.dialogsObserved++; cdp.trip('UNEXPECTED_DIALOG');
      }
    };
    // The child-page attachment from this tab session proves the relationship.
    // No browser-wide autoattach and no admission based only on matching URLs/context.
    await cdp.watch(cdp.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true,
      flatten: true, filter: [{ type: 'page' }, { exclude: true }] }, tabSessionId));
    const bindingDeadline = Date.now() + 10000;
    while (!sessionId && Date.now() < bindingDeadline) await cdp.watch(pause(50));
    insist(typeof sessionId === 'string' && result.isolation.tabToExactSelectedPageObserved, 'TAB_PAGE_BINDING_NOT_OBSERVED');
    for (const method of ['Page.enable', 'Runtime.enable', 'Network.enable'])
      await cdp.watch(cdp.send(method, {}, sessionId));
    await cdp.watch(cdp.send('Page.setLifecycleEventsEnabled', { enabled: true }, sessionId));
    await cdp.watch(cdp.send('Target.setDiscoverTargets', { discover: true }));
    await cdp.watch(cdp.send('Browser.setPermission', {
      permission: { name: 'geolocation' }, setting: 'denied', origin: ORIGIN }));
    await cdp.watch(cdp.send('Browser.setDownloadBehavior', { behavior: 'deny' }));
    await cdp.watch(cdp.send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId));
    await cdp.watch(cdp.send('Network.setBypassServiceWorker', { bypass: true }, sessionId));
    await cdp.watch(cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] }, sessionId));
    await cdp.watch(cdp.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile === true }, sessionId));
    await cdp.watch(cdp.send('Emulation.setTouchEmulationEnabled', { enabled: viewport.touch === true, maxTouchPoints: viewport.touch ? 5 : 1 }, sessionId));
    mainFrameId = (await cdp.watch(cdp.send('Page.getFrameTree', {}, sessionId))).frameTree.frame.id;
    insist(typeof mainFrameId === 'string', 'MAIN_FRAME');
    result.isolation.pageInterceptionInstalledBeforeNavigation = true;
    result.isolation.geolocationDeniedBeforeNavigation = true;
    result.isolation.downloadsDenied = true;
    if (pageWaiting) {
      await cdp.watch(cdp.send('Runtime.runIfWaitingForDebugger', {}, sessionId));
      result.isolation.boundPageResumedAfterGuards = true;
    } else result.isolation.boundPageResumedAfterGuards = false;

    result.isolation.appContainer=false;
    result.isolation.assurance='OWNED_EDGE_PLUS_PINNED_COMPONENT_CATALOG_A_NOT_APPCONTAINER';
    result.isolation.documentDelivery='PINNED_BYTES_CDP_FULFILL_AT_OWNED_LOOPBACK_ORIGIN';
    const telemetry=GEO_COUNTER_JS+'\nObject.defineProperty(window,"__BUILD318_QA_INITIAL_STORAGE_COUNT",{value:localStorage.length});';
    await cdp.watch(cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:telemetry},sessionId));
    documentAllowed=true;
    const nav=await cdp.watch(cdp.send('Page.navigate',{url:DOCUMENT_URL},sessionId));
    insist(!nav.errorText,'INITIAL_NAVIGATION_FAILED');
    async function until(expressionSource,code,timeout=35000){
      const deadline=Date.now()+timeout;
      while(Date.now()<deadline){if(await cdp.evaluate(sessionId,expressionSource))return;await cdp.watch(pause(80));}
      stop(code);
    }
    const loadDeadline=Date.now()+35000;
    while(!(currentLoaderId&&loadedLoaders.has(currentLoaderId))&&Date.now()<loadDeadline)await cdp.watch(pause(80));
    insist(currentLoaderId&&loadedLoaders.has(currentLoaderId),'DOCUMENT_LOAD_NOT_OBSERVED');
    await until(expression(function(build){return document.readyState==='complete'&&typeof APP_BUILD_NUM!=='undefined'&&APP_BUILD_NUM===build&&typeof state==='object'&&document.body.classList.contains('gis-mode')&&!!document.querySelector('#gisMapMount .tile-map');},config.build),'RUNTIME_READY_TIMEOUT');
    insist(currentLoaderId&&loadedLoaders.has(currentLoaderId),'DOCUMENT_LOAD_NOT_OBSERVED');
    insist(await cdp.evaluate(sessionId,'window.__BUILD318_QA_INITIAL_STORAGE_COUNT===0'),'INITIAL_STORAGE_NOT_EMPTY');
    const permission=await cdp.evaluate(sessionId,'(async()=> (await navigator.permissions.query({name:"geolocation"})).state)()');
    insist(permission==='denied','GEOLOCATION_NOT_DENIED');
    result.isolation.initialStorageEmptyObserved=true;
    result.isolation.geolocationDeniedObserved=true;
    async function settle(){await cdp.evaluate(sessionId,'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(true))))');}
    async function capture(label){
      await settle();
      const metrics=await cdp.evaluate(sessionId,'('+METRICS_JS+')()');
      const screenshot=await cdp.watch(cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false},sessionId));
      insist(typeof screenshot.data==='string'&&screenshot.data.length>0,'SCREENSHOT_EMPTY');
      const image=ownWriteBytes(path.join(armDirectory,label+'.png'),Buffer.from(screenshot.data,'base64'));
      const step={label,metrics,screenshot:image};
      result.steps.push(step);return step;
    }
    async function activate(selector){
      await cdp.evaluate(sessionId,expression(function(selector){const el=document.querySelector(selector);if(!el)return false;el.scrollIntoView({block:'nearest',inline:'nearest'});return true;},selector));
      await settle();
      const point=await cdp.evaluate(sessionId,expression(function(selector){const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,h=document.elementFromPoint(x,y);return {x,y,ok:r.width>0&&r.height>0&&x>=0&&y>=0&&x<innerWidth&&y<innerHeight&&!!h&&(h===el||el.contains(h))};},selector));
      insist(point&&point.ok,'ACTION_TARGET_NOT_REACHABLE');
      if(viewport.touch){
        await cdp.watch(cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y}]},sessionId));
        await cdp.watch(cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]},sessionId));
      }else{
        await cdp.watch(cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:point.x,y:point.y,button:'left',clickCount:1},sessionId));
        await cdp.watch(cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.x,y:point.y,button:'left',clickCount:1},sessionId));
      }
    }
    result.tabAccessibleNames=[];
    for(const tab of ['favorites','geocoding','history','layers']){
      const remote=await cdp.watch(cdp.send('Runtime.evaluate',{expression:'document.querySelector('+JSON.stringify('#appTopbar .app-tab[data-tab="'+tab+'"]')+')',returnByValue:false},sessionId));
      insist(remote.result&&typeof remote.result.objectId==='string','TAB_OBJECT_MISSING');
      const ax=await cdp.watch(cdp.send('Accessibility.getPartialAXTree',{objectId:remote.result.objectId,fetchRelatives:false},sessionId));
      result.tabAccessibleNames.push({tab,nodes:(ax.nodes||[]).map(n=>({role:n.role&&n.role.value,name:n.name&&n.name.value,ignored:n.ignored}))});
      await cdp.watch(cdp.send('Runtime.releaseObject',{objectId:remote.result.objectId},sessionId));
    }
    await capture('initial');
    const visible=await cdp.evaluate(sessionId,'(()=>{const e=document.getElementById("gisExportSummary");return !!e&&e.getClientRects().length>0&&getComputedStyle(e).visibility!=="hidden";})()');
    if(visible){
      await activate('#gisExportSummary');
      await until('document.getElementById("gisExportMenu").open===true','EXPORT_MENU_NOT_OPEN',5000);
      await capture('export-open');
      if(config.pilotCSS){
        const css='@media(max-width:480px){body.gis-mode #appTopbar .gis-export-menu{position:static}}';
        await cdp.evaluate(sessionId,expression(function(css){const s=document.createElement('style');s.id='__build318_export_css_probe';s.textContent=css;document.head.appendChild(s);return true;},css));
        const step=await capture('export-open-position-static-probe');step.temporaryCSSProbe=css;
        await cdp.evaluate(sessionId,'(()=>{document.getElementById("__build318_export_css_probe").remove();return true;})()');
      }
      await cdp.watch(cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId));
      await cdp.watch(cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27},sessionId));
      result.escapeClosed=await cdp.evaluate(sessionId,'!document.getElementById("gisExportMenu").open');
      insist(result.escapeClosed,'ESCAPE_DID_NOT_CLOSE');
    }else result.exportSummaryInvisible=true;
    result.finalGeolocationCalls=await cdp.evaluate(sessionId,'window.__BUILD318_QA_GEO');
    insist(result.finalGeolocationCalls&&result.finalGeolocationCalls.getCurrentPosition===0&&result.finalGeolocationCalls.watchPosition===0,'UNEXPECTED_GEOLOCATION_CALL');
    cdp.check();insist(counts.documentsFulfilled===1,'DOCUMENT_COUNT');
    result.status='COMPLETED';
  } catch (e) {
    if (cdp) cdp.trip(safeCode(e));
    result.status = 'STOP'; result.reason = safeCode(e);
    if (cdp && cdp.lastFailedCommand) result.failedCommand = cdp.lastFailedCommand;
  } finally {
    result.acceptedAccessories = { distinctTargets: trustedAccessoryTargets.size, distinctCatalogComponents: observedComponentIds.size };
    result.targetObservation = { stopAtFirstUnexpected: true, endedOnUnexpectedTarget: counts.unexpectedTargets > 0,
      unexpectedEvents: counts.unexpectedTargets, distinctUnexpectedTargets: unqualifiedTargetIds.size };
    if (cdp && bound) {
      // The only post-fatal send is this bound browser's shutdown.
      await cdp.closeOwnedBrowser().catch(() => {});
      const exit = await Promise.race([exited, pause(12000).then(() => null)]);
      result.closure = exit && !exit.spawnFailed ? 'OWN_BROWSER_EXIT_OBSERVED' : 'OWN_BROWSER_EXIT_NOT_CONFIRMED';
      result.ownBrowserExitCode = exit && typeof exit.code === 'number' ? exit.code : null;
    } else {
      result.closure = child.exitCode !== null || spawnFailed ? 'OWN_SPAWN_ALREADY_EXITED' : 'NOT_ATTEMPTED_UNBOUND';
    }
    if (cdp) { cdp.closing = true; cdp.ws.close(); }
    await proxy.close();
    await local.close();
    result.loopbackServer=local.counts;
    result.proxy = proxy.counts;
    result.profilePreserved = true;
    if (result.status === 'COMPLETED' && result.closure !== 'OWN_BROWSER_EXIT_OBSERVED') {
      result.status = 'STOP'; result.reason = 'OWN_BROWSER_EXIT_NOT_CONFIRMED';
    }
  }
  ownWrite(path.join(armDirectory,'measurements.json'),result);
  return result;
}

async function main(configPath){
  insist(process.platform==='win32','WINDOWS_REQUIRED');
  insist(typeof WebSocket==='function','NODE_WEBSOCKET_REQUIRED');
  insist(typeof configPath==='string'&&path.isAbsolute(configPath),'CONFIG_PATH');
  const config=json(fs.readFileSync(configPath),'CONFIG_JSON');
  config.edgeExecutable=config.edgeExecutable||DEFAULT_EDGE;
  config.trustedCatalogPath=config.trustedCatalogPath||DEFAULT_CATALOG;
  insist(config.edgeExecutable===DEFAULT_EDGE,'EDGE_PATH');
  insist([317,318].includes(config.build),'BUILD_SCOPE');
  insist(Number.isSafeInteger(config.bytes)&&config.bytes>0,'RUNTIME_BYTES_CONFIG');
  insist(typeof config.pilotCSS==='boolean','PILOT_CSS_CONFIG');
  config.outputDirectory=confinedOutputDirectory(config.outputDir);
  allowedSource(config.runtimePath);
  const runtime=stableRead(config.runtimePath,config.expectedSHA,config.bytes,'RUNTIME');
  const catalogBytes=stableRead(config.trustedCatalogPath,TRUSTED_CATALOG_SHA,TRUSTED_CATALOG_BYTES,'TRUSTED_CATALOG');
  const catalog=json(catalogBytes,'TRUSTED_CATALOG_JSON');
  insist(Array.isArray(catalog)&&catalog.length===10,'TRUSTED_CATALOG_SCHEMA');
  const trustedIds=new Set();
  for(const item of catalog){insist(item&&typeof item.id==='string'&&item.id.length>0&&!trustedIds.has(item.id),'TRUSTED_CATALOG_IDENTITIES');trustedIds.add(item.id);}
  insist(Array.isArray(config.viewportSet)&&config.viewportSet.length>=1&&config.viewportSet.length<=6,'VIEWPORT_SET');
  const allowed=new Set(['1440x900:false:false','1024x768:false:false','768x1024:true:true','1024x768:true:true','390x844:true:true','320x568:true:true']);
  const names=new Set();
  for(const v of config.viewportSet){
    insist(v&&typeof v.name==='string'&&/^[a-z0-9-]{1,40}$/.test(v.name)&&!names.has(v.name),'VIEWPORT_NAME');names.add(v.name);
    insist(allowed.has(v.width+'x'+v.height+':'+v.touch+':'+v.mobile),'VIEWPORT_SCOPE');
  }
  const runDirectory=fs.mkdtempSync(path.join(config.outputDirectory,'Build318-layout-'));
  const receipt={format:'TMAR-BUILD318-NATIVE-LAYOUT-QA-V1',status:'RUNNING',startedUTC:new Date().toISOString(),
    scope:'OWNED_PROFILE_LOCAL_LOOPBACK_VISUAL_QA',inheritsP0Qualification:false,appContainer:false,
    trustBoundary:'DECISION_A_OWNED_EDGE_AND_PINNED_COMPONENT_CATALOG',browserProduct:EXPECTED_BROWSER_PRODUCT,
    catalogSHA256:TRUSTED_CATALOG_SHA,runtime:{sha256:config.expectedSHA,bytes:runtime.length,build:config.build},
    driver:{sha256:sha(fs.readFileSync(__filename)),bytes:fs.statSync(__filename).size},
    userProfileUsed:false,privateDataLoaded:false,operatorOriginStorageModified:false,profileRemovalPerformed:false,cases:[]};
  for(const viewport of config.viewportSet){
    const result=await runViewport(viewport,config,runtime,runDirectory,trustedIds);receipt.cases.push(result);
    process.stdout.write(JSON.stringify({case:viewport.name,status:result.status,reason:result.reason||null,counts:result.counts})+'\n');
    if(result.status!=='COMPLETED')break;
  }
  stableRead(config.runtimePath,config.expectedSHA,config.bytes,'RUNTIME_FINAL');
  stableRead(config.trustedCatalogPath,TRUSTED_CATALOG_SHA,TRUSTED_CATALOG_BYTES,'TRUSTED_CATALOG_FINAL');
  receipt.inputFilesUnchanged=true;receipt.finishedUTC=new Date().toISOString();
  receipt.status=receipt.cases.length===config.viewportSet.length&&receipt.cases.every(c=>c.status==='COMPLETED')?'MEASURED':'STOP';
  const artifact=ownWrite(path.join(runDirectory,'receipt.json'),receipt);
  process.stdout.write(JSON.stringify({status:receipt.status,runDirectory,receipt:artifact})+'\n');
  return receipt.status==='MEASURED'?0:2;
}
if(require.main===module){main(process.argv[2]).then(code=>{process.exitCode=code;}).catch(e=>{process.stdout.write(JSON.stringify({status:'STOP',reason:safeCode(e),inheritsP0Qualification:false})+'\n');process.exitCode=2;});}
module.exports={main};
