"use strict";
// Targeted Build319 toolbar tooltip QA; infrastructure derived from qualified 318 driver.
// Isolation helpers derived from the pinned P0 runner; no P0 PASS is inherited.
// Decision A boundary is owned Edge plus the pinned component catalog, NOT AppContainer.
const fs=require('fs'),path=require('path'),http=require('http'),crypto=require('crypto');
const {spawn}=require('child_process');

// Browser-side observations only; transient probes never call GIS action/store helpers.
function tooltipPage(action,arg){
  const root='body.gis-mode #gisMapMount .tile-map .tile-ctrls';
  const selector=root+' button[data-tip]';
  const portalId='gisMapToolbarTooltipPortal';
  const rect=r=>({left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height});
  const rendered=e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return !!e.isConnected&&r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden';};
  const allowed=e=>!e.closest('.tlayer-menu,[data-role="basemap-menu"]')&&!(e.dataset.role==='basemap-menu-toggle'&&e.getAttribute('aria-expanded')==='true');
  const list=()=>Array.from(document.querySelectorAll(selector)).filter(e=>allowed(e)&&rendered(e));
  // Descriptors survive runtime rerenders; no action relies on a retained live Node.
  const identity=e=>{
    const id=e.id||null,role=e.getAttribute('data-role'),zdelta=e.getAttribute('data-zdelta');
    const semanticClass=['ttrk-exp','twpt-exp','tg-btn','tcov-btn','tile-recenter','tile-pick'].find(c=>e.classList.contains(c))||null;
    const key=id?'id:'+id:role?'role:'+role+(zdelta!==null?':zdelta:'+zdelta:''):zdelta!==null?'zdelta:'+zdelta:semanticClass?'class:'+semanticClass:null;
    return {key,id,role,zdelta,semanticClass};
  };
  const descriptors=()=>list().map(identity);
  const resolve=d=>{
    if(!d||!d.key)return null;
    const matches=list().filter(e=>identity(e).key===d.key);
    return matches.length===1?matches[0]:null;
  };
  const key=e=>identity(e).key;
  const labels=()=>list().map(e=>({key:key(e),tip:e.getAttribute('data-tip'),aria:e.getAttribute('aria-label')})).sort((a,b)=>String(a.key).localeCompare(String(b.key)));
  const counts=()=>typeof state==='object'?{tracks:Array.isArray(state.savedTracks)?state.savedTracks.length:null,waypoints:Array.isArray(state.mapWaypoints)?state.mapWaypoints.length:null}:null;
  const expected=e=>{
    if(e.dataset.role==='track-map-toggle'){
      const translated=typeof t==='function'?String(t('tabs.track')||'').trim():'';
      if(translated&&translated!=='tabs.track')return {text:translated,policy:'TRANSLATED_TRACK_CAPTION'};
      const caption=e.querySelector('.gis-ctrl-caption');
      if(caption&&caption.textContent.trim())return {text:caption.textContent.trim(),policy:'TRACK_CAPTION_FALLBACK'};
    }
    return {text:e.getAttribute('data-tip')||'',policy:'EXACT_DATA_TIP'};
  };
  const clipInfo=e=>{
    const r=e.getBoundingClientRect();let left=Math.max(0,r.left),top=Math.max(0,r.top),right=Math.min(innerWidth,r.right),bottom=Math.min(innerHeight,r.bottom);
    const ancestors=[];let depth=0;
    for(let p=e.parentElement;p;p=p.parentElement,depth++){
      const c=getComputedStyle(p);if(c.display==='contents')continue;const pr=p.getBoundingClientRect(),sx=p.offsetWidth?pr.width/p.offsetWidth:1,sy=p.offsetHeight?pr.height/p.offsetHeight:1;
      const cr={left:pr.left+p.clientLeft*sx,top:pr.top+p.clientTop*sy};cr.right=cr.left+p.clientWidth*sx;cr.bottom=cr.top+p.clientHeight*sy;
      const cx=['auto','scroll','hidden','clip'].includes(c.overflowX),cy=['auto','scroll','hidden','clip'].includes(c.overflowY);
      if(cx) {left=Math.max(left,cr.left);right=Math.min(right,cr.right);}
      if(cy) {top=Math.max(top,cr.top);bottom=Math.min(bottom,cr.bottom);}
      if(cx||cy)ancestors.push({depth,tag:p.tagName,id:p.id,classes:p.className,position:c.position,overflowX:c.overflowX,overflowY:c.overflowY,
        clientRect:cr,scrollTop:p.scrollTop,scrollLeft:p.scrollLeft,maxY:Math.max(0,p.scrollHeight-p.clientHeight),maxX:Math.max(0,p.scrollWidth-p.clientWidth)});
      // Fixed-position toolbar clipping is applied, then map ancestors above it are bypassed.
      if(c.position==='fixed')break;
    }
    const width=Math.max(0,right-left),height=Math.max(0,bottom-top),visible=width>0&&height>0;
    return {hasVisiblePixels:visible,fullyClipped:!visible,partiallyClipped:visible&&(left>r.left+.5||top>r.top+.5||right<r.right-.5||bottom<r.bottom-.5),
      effectiveRect:{left,top,right,bottom,width,height},anchorRect:rect(r),ancestors};
  };
  const ps=()=>{
    const es=document.querySelectorAll('#'+portalId),e=es[0];if(!e)return {exists:false,count:0,hidden:true,visible:false};
    const r=e.getBoundingClientRect(),c=getComputedStyle(e);
    const visible=!e.hidden&&e.classList.contains('is-visible')&&e.getAttribute('aria-hidden')==='false'&&r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity)>0;
    return {exists:true,count:es.length,hidden:e.hidden,ariaHidden:e.getAttribute('aria-hidden'),visible,text:e.textContent,role:e.getAttribute('role'),
      parentIsBody:e.parentElement===document.body,position:c.position,pointerEvents:c.pointerEvents,rect:rect(r),
      insideViewport:r.left>=-.5&&r.top>=-.5&&r.right<=innerWidth+.5&&r.bottom<=innerHeight+.5};
  };
  if(action==='init'){
    const q={controls:descriptors(),clicks:0,labelsBefore:labels(),stateBefore:counts(),removed:null,tipSaved:null};
    Object.defineProperty(window,'__BUILD319_TOOLTIP_QA',{value:q});
    document.addEventListener('click',ev=>{const e=ev.target.closest&&ev.target.closest(root+' button');if(e)q.clicks++;},true);
    return {controls:q.controls.length,keysUnique:new Set(q.controls.map(d=>d.key)).size===q.controls.length,unsupportedKeys:q.controls.filter(d=>!d.key).length,labels:q.labelsBefore,stateCounts:q.stateBefore,installedFlag:document.documentElement.dataset.gisMapToolbarTooltipPortal||null,
      missingTips:Array.from(document.querySelectorAll(root+' button')).filter(e=>allowed(e)&&rendered(e)&&!String(e.getAttribute('data-tip')||'').trim()).length};
  }
  const q=window.__BUILD319_TOOLTIP_QA;if(!q)return null;
  const descriptor=arg&&Number.isInteger(arg.index)?q.controls[arg.index]:null;
  const e=resolve(descriptor);
  if(action==='inventory')return q.controls.map((d,i)=>{const b=resolve(d);return b?{index:i,key:d.key,identity:d,disabled:b.disabled,tip:b.getAttribute('data-tip'),aria:b.getAttribute('aria-label'),expected:expected(b),rect:rect(b.getBoundingClientRect()),connected:true}:{index:i,key:d.key,identity:d,connected:false};});
  if(action==='refresh'){q.controls=descriptors();return q.controls.length;}
  if(action==='zoomIndex')return q.controls.findIndex(d=>{const b=resolve(d);return b&&b.classList.contains('tz-btn')&&b.getAttribute('data-zdelta')==='1'&&!b.disabled;});
  if(action==='scrollIntoView'){if(!e||!e.isConnected)return false;e.scrollIntoView({block:'nearest',inline:'nearest'});return true;}
  if(action==='focus'){if(!e||!e.isConnected||e.disabled)return false;e.focus({preventScroll:true});return document.activeElement===e&&e.matches(':focus-visible');}
  if(action==='blur'){if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();return true;}
  if(action==='point'){
    if(!e||!e.isConnected)return null;const r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,h=document.elementFromPoint(x,y);
    return {x,y,ok:r.width>0&&r.height>0&&x>=0&&y>=0&&x<innerWidth&&y<innerHeight&&!!h&&(h===e||e.contains(h))};
  }
  if(action==='portal')return ps();
  if(action==='measure'){
    if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e),ex=expected(e),anc=[];
    for(let p=e.parentElement;p&&anc.length<10;p=p.parentElement){const s=getComputedStyle(p);if(['auto','scroll','hidden','clip'].includes(s.overflowX)||['auto','scroll','hidden','clip'].includes(s.overflowY))anc.push({tag:p.tagName,id:p.id,classes:p.className,rect:rect(p.getBoundingClientRect()),overflowX:s.overflowX,overflowY:s.overflowY,clientWidth:p.clientWidth,clientHeight:p.clientHeight,scrollTop:p.scrollTop,scrollHeight:p.scrollHeight});}
    const pseudo={};for(const name of ['::before','::after']){const p=getComputedStyle(e,name);pseudo[name]={content:p.content,display:p.display,visibility:p.visibility,opacity:p.opacity,position:p.position,left:p.left,right:p.right,top:p.top,bottom:p.bottom,width:p.width,height:p.height,transform:p.transform};}
    return {index:arg.index,key:key(e,arg.index),rect:rect(r),dataTip:e.getAttribute('data-tip'),ariaLabel:e.getAttribute('aria-label'),describedBy:e.getAttribute('aria-describedby'),
      disabled:e.disabled,connected:e.isConnected,focused:document.activeElement===e,focusVisible:e.matches(':focus-visible'),hovered:e.matches(':hover'),expected:ex,
      portal:ps(),pseudo,overflowAncestors:anc,anchorClipping:clipInfo(e),viewport:{width:innerWidth,height:innerHeight,coarse:matchMedia('(pointer:coarse)').matches,hoverNone:matchMedia('(hover:none)').matches}};
  }
  if(action==='naturalReset'){
    const touched=new Set();
    for(const b of list())for(const a of clipInfo(b).ancestors){let p=b.parentElement;for(let i=0;p&&i<a.depth;i++)p=p.parentElement;if(p&&!touched.has(p)){touched.add(p);p.scrollTop=0;p.scrollLeft=0;}}
    return touched.size;
  }
  if(action==='naturalPlan'){
    q.controls=descriptors();let first=-1,partial=-1,full=-1;
    const geometry=q.controls.map((d,i)=>{const b=resolve(d);return b&&!b.disabled&&rendered(b)?{index:i,key:d.key,clip:clipInfo(b)}:null;});
    for(const g of geometry)if(g&&g.clip.hasVisiblePixels&&!g.clip.partiallyClipped){first=g.index;break;}
    if(first<0)for(const g of geometry)if(g&&g.clip.hasVisiblePixels){first=g.index;break;}
    for(const g of geometry){if(!g||g.index<=first)continue;if(full<0&&g.clip.fullyClipped)full=g.index;if(partial<0&&g.clip.partiallyClipped)partial=g.index;}
    const target=full>=0?full:partial;
    return {first,target,firstKey:first>=0?q.controls[first].key:null,targetKey:target>=0?q.controls[target].key:null,keys:q.controls.map(d=>d.key),
      clippingKind:full>=0?'FULLY_CLIPPED':partial>=0?'PARTIALLY_CLIPPED':null,targetClip:target>=0?geometry[target].clip:null};
  }
  if(action==='restoreScroll'){
    if(!e)return {changed:0,missing:true};let changed=0;
    for(const a of arg.ancestors||[]){let p=e.parentElement;for(let i=0;p&&i<a.depth;i++)p=p.parentElement;if(!p)continue;
      const beforeTop=p.scrollTop,beforeLeft=p.scrollLeft;p.scrollTop=a.scrollTop;p.scrollLeft=a.scrollLeft;if(p.scrollTop!==beforeTop||p.scrollLeft!==beforeLeft)changed++;}
    return {changed};
  }
  if(action==='nudgeScroll'){
    if(!e)return {changed:false};
    for(const a of clipInfo(e).ancestors){let p=e.parentElement;for(let i=0;p&&i<a.depth;i++)p=p.parentElement;if(!p)continue;
      for(const [prop,max] of [['scrollTop',a.maxY],['scrollLeft',a.maxX]]){if(max<=0)continue;const before=p[prop];p[prop]=before<max?Math.min(max,before+1):Math.max(0,before-1);if(p[prop]!==before)return {changed:true,depth:a.depth,property:prop,before,after:p[prop]};}}
    return {changed:false};
  }
  if(action==='activeIndex')return q.controls.findIndex(d=>resolve(d)===document.activeElement);
  if(action==='scrollActual'){
    const p=document.querySelector(root);if(!p)return {changed:false};const before=p.scrollTop,max=Math.max(0,p.scrollHeight-p.clientHeight);p.scrollTop=before>0?0:Math.min(90,max);
    return {changed:p.scrollTop!==before,before,after:p.scrollTop,max};
  }
  if(action==='touchScrollPoint'){const p=document.querySelector(root);if(!p)return null;const r=p.getBoundingClientRect();return {x:r.left+r.width/2,y:Math.min(innerHeight-20,r.top+r.height*.65)};}
  if(action==='setTip'){if(!e)return false;q.tipSaved={descriptor,node:e,value:e.getAttribute('data-tip')};e.setAttribute('data-tip',arg.text);return true;}
  if(action==='restoreTip'){if(q.tipSaved){const x=q.tipSaved,current=resolve(x.descriptor);for(const b of new Set([x.node,current])){if(!b)continue;if(x.value===null)b.removeAttribute('data-tip');else b.setAttribute('data-tip',x.value);}q.tipSaved=null;}return true;}
  if(action==='removeAnchor'){if(!e)return false;q.removed={descriptor,node:e,parent:e.parentNode,next:e.nextSibling,childIndex:Array.from(e.parentNode.childNodes).indexOf(e),tip:e.getAttribute('data-tip'),aria:e.getAttribute('aria-label')};e.remove();return true;}
  if(action==='restoreAnchor'){
    if(!q.removed)return true;
    const x=q.removed;let current=resolve(x.descriptor);
    if(!current&&!x.node.isConnected&&x.parent.isConnected){
      const next=x.next&&x.next.parentNode===x.parent?x.next:x.parent.childNodes[x.childIndex]||null;
      x.parent.insertBefore(x.node,next);current=resolve(x.descriptor);
    }
    // A replacement rendered by the application wins; never insert a duplicate old node.
    const restored=!!current&&current.getAttribute('data-tip')===x.tip&&current.getAttribute('aria-label')===x.aria;
    if(restored)q.removed=null;
    return restored;
  }
  if(action==='final')return {clicks:q.clicks,labelsUnchanged:JSON.stringify(labels())===JSON.stringify(q.labelsBefore),stateCountsUnchanged:JSON.stringify(counts())===JSON.stringify(q.stateBefore),
    transientRestored:!q.removed&&!q.tipSaved,portal:ps(),geolocation:window.__BUILD319_QA_GEO||null};
  return null;
}

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


const GEO_COUNTER_JS="(() => {\n  const counts={getCurrentPosition:0,watchPosition:0,clearWatch:0,wrapped:[]};\n  Object.defineProperty(window,'__BUILD319_QA_GEO',{value:counts});\n  const geo=navigator.geolocation;\n  if (!geo) return;\n  for (const name of ['getCurrentPosition','watchPosition','clearWatch']) {\n    try { const original=geo[name];\n      Object.defineProperty(geo,name,{configurable:true,value:function(...args){counts[name]++;return original.apply(this,args);}});\n      counts.wrapped.push(name);\n    } catch (_) {}\n  }\n})();";

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
    insist(!path.isAbsolute(rel)&&!rel.startsWith('..')&&/^Build31[89]-[A-Za-z0-9_-]+$/.test(first)&&/\.html$/i.test(candidate),'RUNTIME_OUTSIDE_ALLOWED_SOURCE');
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
    const telemetry=GEO_COUNTER_JS+'\nObject.defineProperty(window,"__BUILD319_QA_INITIAL_STORAGE_COUNT",{value:localStorage.length});';
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
    insist(await cdp.evaluate(sessionId,'window.__BUILD319_QA_INITIAL_STORAGE_COUNT===0'),'INITIAL_STORAGE_NOT_EMPTY');
    const permission=await cdp.evaluate(sessionId,'(async()=> (await navigator.permissions.query({name:"geolocation"})).state)()');
    insist(permission==='denied','GEOLOCATION_NOT_DENIED');
    result.isolation.initialStorageEmptyObserved=true;
    result.isolation.geolocationDeniedObserved=true;

    const call=(action,arg={})=>cdp.evaluate(sessionId,expression(tooltipPage,action,arg));
    const raw={format:'TMAR-BUILD319-TOOLTIP-RAW-V1',viewport,mode:config.mode,steps:[],checks:[],naturalKeyboard:null};
    const failures=[];
    result.checks={};result.controls=[];result.screenshotCount=0;
    const check=(name,ok,detail)=>{const pass=ok===true;raw.checks.push({name,pass,...(detail===undefined?{}:{detail})});if(!pass)failures.push(name);return pass;};
    async function settle(){await cdp.evaluate(sessionId,'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(true))))');}
    async function key(key,code,virtualKey){await cdp.watch(cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:virtualKey},sessionId));await cdp.watch(cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:virtualKey},sessionId));}
    async function outside(){await cdp.watch(cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1,y:1},sessionId));}
    async function reset(){await outside();await call('blur');await key('Escape','Escape',27);await settle();}
    async function prepare(index){await reset();insist(await call('scrollIntoView',{index}),'TOOLBAR_ANCHOR_NOT_FOUND');await settle();}
    async function focus(index,prepareFirst=true){if(prepareFirst)await prepare(index);await key('Tab','Tab',9);const ok=await call('focus',{index});await settle();return ok;}
    async function hover(index,prepareFirst=true){if(prepareFirst)await prepare(index);const p=await call('point',{index});if(!p||!p.ok)return false;await cdp.watch(cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.x,y:p.y},sessionId));await settle();return true;}
    async function capture(label,index,screenshot=true){
      const metrics=await call('measure',{index});const step={label,metrics};
      if(screenshot){const s=await cdp.watch(cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false},sessionId));insist(typeof s.data==='string'&&s.data.length>0,'SCREENSHOT_EMPTY');step.screenshot=ownWriteBytes(path.join(armDirectory,label+'.png'),Buffer.from(s.data,'base64'));result.screenshotCount++;}
      raw.steps.push(step);return step;
    }
    function tooltipOK(m){return !!(m&&m.anchorClipping&&m.anchorClipping.hasVisiblePixels&&m.portal&&m.portal.visible&&m.portal.count===1&&m.portal.parentIsBody&&m.portal.role==='tooltip'&&m.portal.position==='fixed'&&m.portal.pointerEvents==='none'&&m.portal.insideViewport&&m.portal.text===m.expected.text&&String(m.describedBy||'').split(/\s+/).includes('gisMapToolbarTooltipPortal'));}
    async function hidden(){const p=await call('portal');return !p.exists||(p.hidden&&p.ariaHidden==='true'&&!p.visible);}

    async function naturalTabProbe(){
      await reset();await call('naturalReset');await settle();const plan=await call('naturalPlan');
      if(!plan||plan.first<0||plan.target<0){result.naturalKeyboard={applicable:false,reason:'NO_ENABLED_CONTROL_CLIPPED_BY_VIEWPORT_OR_ANCESTOR'};return;}
      const natural={applicable:true,plan,visited:[],manualTargetScrollUsed:false,scrollChecks:{}};
      await key('Tab','Tab',9);insist(await call('focus',{index:plan.first}),'NATURAL_TAB_START_FOCUS');await settle();
      let reached=false;
      for(let attempt=0;attempt<inventoryInfo.controls+12;attempt++){
        await key('Tab','Tab',9);await settle();const active=await call('activeIndex');natural.visited.push({index:active,key:plan.keys[active]||null});
        if(active===plan.target){reached=true;break;}
      }
      const arrived=await capture('natural-tab-clipped-ancestor',plan.target,true);natural.arrived=arrived.metrics;
      natural.pass=reached&&arrived.metrics&&arrived.metrics.focusVisible&&tooltipOK(arrived.metrics);
      check('naturalTabToClippedAncestorControl',natural.pass);
      if(natural.pass){
        const shown=arrived.metrics.anchorClipping.ancestors;
        function assess(label,m,changed){
          if(!changed)return;
          if(m&&m.anchorClipping.hasVisiblePixels){natural.scrollChecks.focusVisibleObserved=true;check(label+'-focused-visible-keeps-tooltip',m.focused&&m.focusVisible&&tooltipOK(m));}
          else{natural.scrollChecks.fullyClippedObserved=true;check(label+'-fully-clipped-hides',!!m&&!m.portal.visible&&m.portal.hidden&&m.focused&&m.focusVisible);}
        }
        const nudge=await call('nudgeScroll',{index:plan.target});await settle();const moved=await capture('focus-small-scroll',plan.target,false);natural.smallScroll=nudge;assess('small-scroll',moved.metrics,nudge.changed);
        await call('restoreScroll',{index:plan.target,ancestors:shown});await settle();
        const back=await call('restoreScroll',{index:plan.target,ancestors:plan.targetClip.ancestors});await settle();
        const original=await capture('focus-restored-initial-clipping',plan.target,true);natural.initialClippingRestored=original.metrics;assess('initial-clipping',original.metrics,back.changed>0);
        const reentry=await call('restoreScroll',{index:plan.target,ancestors:shown});await settle();const again=await capture('focus-scroll-reentry',plan.target,false);
        if(reentry.changed>0){natural.scrollChecks.focusVisibleObserved=true;check('scroll-reentry-preserves-focus-tooltip',again.metrics&&again.metrics.focused&&again.metrics.focusVisible&&tooltipOK(again.metrics));}
        await key('Escape','Escape',27);await settle();const escapedIndex=await call('activeIndex');
        const e1=await call('restoreScroll',{index:plan.target,ancestors:plan.targetClip.ancestors});await settle();
        const e2=await call('restoreScroll',{index:plan.target,ancestors:shown});await settle();
        const en=await call('nudgeScroll',{index:plan.target});await settle();
        if(e1.changed>0||e2.changed>0||en.changed){natural.scrollChecks.escapeScrollObserved=true;check('scrollAfterEscapeDoesNotReopen',await hidden()&&(await call('activeIndex'))===escapedIndex);}
        await call('restoreScroll',{index:plan.target,ancestors:shown});await settle();
        if(!viewport.touch){
          const hovered=await hover(plan.target);const hs=await call('nudgeScroll',{index:plan.target});await settle();
          if(hovered&&hs.changed){natural.scrollChecks.hoverScrollObserved=true;check('hoverOnlyScrollHides',await hidden());}
        }
        await reset();
      }
      raw.naturalKeyboard=natural;
      result.naturalKeyboard={applicable:true,pass:natural.pass,target:plan.targetKey,clippingKind:plan.clippingKind,manualTargetScrollUsed:false,
        focusVisibleScrollObserved:!!natural.scrollChecks.focusVisibleObserved,fullyClippedScrollObserved:!!natural.scrollChecks.fullyClippedObserved,
        escapeScrollObserved:!!natural.scrollChecks.escapeScrollObserved,hoverScrollObserved:!!natural.scrollChecks.hoverScrollObserved};
    }
    const inventoryInfo=await call('init');
    raw.inventoryInfo=inventoryInfo;raw.inventory=await call('inventory');
    insist(inventoryInfo.controls>0&&inventoryInfo.controls<=80,'TOOLBAR_INVENTORY_SCOPE');
    insist(inventoryInfo.keysUnique&&inventoryInfo.unsupportedKeys===0,'TOOLBAR_CONTROL_IDENTITY_SCOPE');
    result.controlCount=inventoryInfo.controls;
    if(config.mode==='baseline'){
      const index=await call('zoomIndex');insist(index>=0,'BASELINE_ZOOM_ANCHOR_MISSING');
      await prepare(index);await capture('baseline-initial',index);
      insist(await hover(index),'BASELINE_HOVER_ANCHOR_UNREACHABLE');await cdp.watch(pause(180));await capture('baseline-hover',index);
      insist(await focus(index),'BASELINE_KEYBOARD_FOCUS_NOT_OBSERVED');await cdp.watch(pause(180));await capture('baseline-focus',index);
      result.baseline={anchor:raw.inventory[index].key,hoverObserved:raw.steps[1].metrics.hovered,focusVisibleObserved:raw.steps[2].metrics.focusVisible,
        clippingAssessment:'SCREENSHOT_REVIEW_REQUIRED',pseudoElementHitTestingNotUsed:true,screenshots:raw.steps.map(s=>s.screenshot)};
      await reset();result.qualification='REVIEW_REQUIRED';
    }else if(viewport.probeOnly==='natural-tab'){
      result.supplementalScope='NATURAL_TAB_AND_FOCUSED_SCROLL_ONLY';
      check('portalInstallationFlag',inventoryInfo.installedFlag==='1');
      await naturalTabProbe();result.qualification=failures.length?'FAIL':'PASS';
    }else{
      check('portalInstallationFlag',inventoryInfo.installedFlag==='1');
      check('allRenderedToolbarButtonsHaveTips',inventoryInfo.missingTips===0);
      for(const item of raw.inventory){
        const summary={index:item.index,key:item.key,captionPolicy:item.expected.policy,disabled:item.disabled,hover:viewport.touch?'NOT_APPLICABLE_TOUCH':null,focus:item.disabled?'NOT_APPLICABLE_DISABLED':null};
        if(!viewport.touch){
          const reached=await hover(item.index);const step=await capture('control-'+String(item.index).padStart(2,'0')+'-hover',item.index,true);
          summary.hover=check('control-'+item.index+'-hover',reached&&tooltipOK(step.metrics))?'PASS':'FAIL';
          check('control-'+item.index+'-hover-labels',step.metrics.dataTip===item.tip&&step.metrics.ariaLabel===item.aria);
        }
        if(!item.disabled){
          const focused=await focus(item.index);const step=await capture('control-'+String(item.index).padStart(2,'0')+'-focus',item.index,viewport.touch||item.index===0);
          summary.focus=check('control-'+item.index+'-focus',focused&&step.metrics.focusVisible&&tooltipOK(step.metrics))?'PASS':'FAIL';
          check('control-'+item.index+'-focus-labels',step.metrics.dataTip===item.tip&&step.metrics.ariaLabel===item.aria);
        }
        result.controls.push(summary);
      }
      await call('refresh');
      let safe=await call('zoomIndex');insist(safe>=0,'CLEANUP_ZOOM_ANCHOR_MISSING');
      await focus(safe);const beforeEscape=await call('activeIndex');await key('Escape','Escape',27);await settle();
      check('escapeHidesWithoutMovingFocus',await hidden()&&(await call('activeIndex'))===beforeEscape);
      await focus(safe);await call('blur');await settle();check('blurHidesWithoutHover',await hidden());
      if(!viewport.touch){
        await hover(safe);await outside();await settle();check('mouseleaveHidesWithoutFocus',await hidden());
        await hover(safe);await focus(safe,false);await outside();await settle();check('mouseleaveKeepsKeyboardFocusTooltip',tooltipOK((await capture('or-focus-retained',safe,false)).metrics));
        await hover(safe,false);await call('blur');await settle();check('blurKeepsHoverTooltip',tooltipOK((await capture('or-hover-retained',safe,false)).metrics));
        await outside();await settle();check('orSourcesClear',await hidden());
      }
      if(config.mode==='candidate'){
        await focus(safe);const sc=await call('scrollActual');await settle();raw.scrollCleanup=sc;
        if(sc.changed){const sm=await call('measure',{index:safe});check('focusedToolbarScrollRespectsAnchorVisibility',sm&&sm.anchorClipping.hasVisiblePixels?tooltipOK(sm):await hidden());}
        await focus(safe);
        await cdp.watch(cdp.send('Emulation.setDeviceMetricsOverride',{width:viewport.width,height:viewport.height-1,deviceScaleFactor:1,mobile:viewport.mobile===true},sessionId));await settle();
        check('resizeHides',await hidden());
        await cdp.watch(cdp.send('Emulation.setDeviceMetricsOverride',{width:viewport.width,height:viewport.height,deviceScaleFactor:1,mobile:viewport.mobile===true},sessionId));await settle();await call('refresh');safe=await call('zoomIndex');insist(safe>=0,'POST_RESIZE_ZOOM_ANCHOR_MISSING');
        if(viewport.touch){
          await focus(safe);const point=await call('point',{index:safe});insist(point&&point.ok,'TOUCH_CLEANUP_ANCHOR_UNREACHABLE');
          await cdp.watch(cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y}]},sessionId));
          await cdp.watch(cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]},sessionId));await settle();check('touchCancelHidesWithoutActionClick',await hidden());
          await focus(safe);const sp=await call('touchScrollPoint');
          await cdp.watch(cdp.send('Input.synthesizeScrollGesture',{x:sp.x,y:sp.y,yDistance:-100,speed:400,preventFling:true,gestureSourceType:'touch'},sessionId));await settle();
          check('touchScrollLeavesNoTooltip',await hidden());
        }
        await naturalTabProbe();
        if(viewport.name==='desktop-1440'){
          await call('refresh');safe=await call('zoomIndex');await focus(safe);
          await call('setTip',{index:safe,text:'QA TOOLTIP TEMPORANEO 319'});await settle();
          const dynamic=await capture('dynamic-data-tip',safe,true);check('dynamicDataTipRefreshes',tooltipOK(dynamic.metrics)&&dynamic.metrics.portal.text==='QA TOOLTIP TEMPORANEO 319');
          await call('restoreTip');await settle();check('dynamicDataTipRestored',tooltipOK((await capture('dynamic-data-tip-restored',safe,false)).metrics));
          await focus(safe);await call('removeAnchor',{index:safe});await settle();check('removedAnchorHides',await hidden());
          await call('restoreAnchor');await settle();await focus(safe);check('restoredAnchorWorks',tooltipOK((await capture('restored-anchor',safe,true)).metrics));
        }
      }
      await call('restoreTip');await call('restoreAnchor');await reset();
      result.qualification=failures.length?'FAIL':'PASS';
    }
    const final=await call('final');raw.final=final;
    check('underlyingDataTipAndAriaLabelsUnchanged',final.labelsUnchanged);
    check('transientDOMRestored',final.transientRestored);
    check('canonicalCollectionCountsUnchanged',final.stateCountsUnchanged);
    insist(final.clicks===0,'UNEXPECTED_TOOLBAR_ACTION_CLICK');
    result.finalGeolocationCalls=final.geolocation;
    insist(result.finalGeolocationCalls&&result.finalGeolocationCalls.getCurrentPosition===0&&result.finalGeolocationCalls.watchPosition===0,'UNEXPECTED_GEOLOCATION_CALL');
    check('noConsoleOrRuntimeErrors',counts.consoleErrors===0&&counts.runtimeExceptions===0);
    result.toolbarActionClicks=final.clicks;
    result.checks={total:raw.checks.length,passed:raw.checks.filter(c=>c.pass).length,failed:failures.length};
    result.failures=[...new Set(failures)];
    if(config.mode!=='baseline')result.qualification=failures.length?'FAIL':'PASS';
    else if(failures.length)result.qualification='FAIL';
    result.rawEvidence=ownWrite(path.join(armDirectory,'tooltip-raw.json'),raw);
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
  result.caseReceipt=ownWrite(path.join(armDirectory,'case-receipt.json'),result);
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
  insist((config.mode==='baseline'&&config.build===318)||(config.mode==='candidate'&&config.build===319),'BUILD_SCOPE');
  insist(Number.isSafeInteger(config.bytes)&&config.bytes>0,'RUNTIME_BYTES_CONFIG');

  config.outputDirectory=confinedOutputDirectory(config.outputDir);
  allowedSource(config.runtimePath);
  const runtime=stableRead(config.runtimePath,config.expectedSHA,config.bytes,'RUNTIME');
  const catalogBytes=stableRead(config.trustedCatalogPath,TRUSTED_CATALOG_SHA,TRUSTED_CATALOG_BYTES,'TRUSTED_CATALOG');
  const catalog=json(catalogBytes,'TRUSTED_CATALOG_JSON');
  insist(Array.isArray(catalog)&&catalog.length===10,'TRUSTED_CATALOG_SCHEMA');
  const trustedIds=new Set();
  for(const item of catalog){insist(item&&typeof item.id==='string'&&item.id.length>0&&!trustedIds.has(item.id),'TRUSTED_CATALOG_IDENTITIES');trustedIds.add(item.id);}
  insist(Array.isArray(config.viewportSet)&&config.viewportSet.length>=1&&config.viewportSet.length<=5,'VIEWPORT_SET');
  const allowed=new Set(config.mode==='baseline'?['1440x900:false:false']:['1440x900:false:false','1024x768:false:false','390x844:true:true','320x568:true:true','1440x568:false:false','1440x400:false:false']);
  const names=new Set();
  for(const v of config.viewportSet){
    insist(v&&typeof v.name==='string'&&/^[a-z0-9-]{1,40}$/.test(v.name)&&!names.has(v.name),'VIEWPORT_NAME');names.add(v.name);
    insist(allowed.has(v.width+'x'+v.height+':'+v.touch+':'+v.mobile),'VIEWPORT_SCOPE');
    if(v.width===1440&&[568,400].includes(v.height))insist(v.name==='desktop-short'&&v.probeOnly==='natural-tab','SHORT_VIEWPORT_SCOPE');else insist(!v.probeOnly,'UNEXPECTED_PROBE_ONLY');
  }
  const runDirectory=fs.mkdtempSync(path.join(config.outputDirectory,'Build319-tooltip-'));
  const receipt={format:'TMAR-BUILD319-TOOLTIP-QA-V1',mode:config.mode,status:'RUNNING',startedUTC:new Date().toISOString(),
    scope:'OWNED_PROFILE_LOCAL_LOOPBACK_TOOLBAR_TOOLTIP_QA',inheritsP0Qualification:false,appContainer:false,
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
  const complete=receipt.cases.length===config.viewportSet.length&&receipt.cases.every(c=>c.status==='COMPLETED');
  const observed=receipt.cases.map(c=>c.naturalKeyboard).filter(n=>n&&n.applicable);
  receipt.coverage={fullViewports:receipt.cases.filter(c=>!c.viewport.probeOnly).length,supplementalViewports:receipt.cases.filter(c=>!!c.viewport.probeOnly).length,
    naturalTabClippedAncestor:observed.some(n=>n.pass),focusVisibleAfterActualScroll:observed.some(n=>n.focusVisibleScrollObserved),
    fullyClippedFocusedAnchor:observed.some(n=>n.fullyClippedScrollObserved),hoverOnlyActualScroll:observed.some(n=>n.hoverScrollObserved),
    escapeFollowedByActualScroll:observed.some(n=>n.escapeScrollObserved)};
  const coverageComplete=receipt.coverage.naturalTabClippedAncestor&&receipt.coverage.focusVisibleAfterActualScroll&&receipt.coverage.fullyClippedFocusedAnchor&&receipt.coverage.hoverOnlyActualScroll&&receipt.coverage.escapeFollowedByActualScroll;
  receipt.status=!complete?'STOP':receipt.cases.some(c=>c.qualification==='FAIL')?'FAIL':config.mode==='baseline'?'MEASURED':!coverageComplete?'INCOMPLETE':'PASS';
  const artifact=ownWrite(path.join(runDirectory,'receipt.json'),receipt);
  process.stdout.write(JSON.stringify({status:receipt.status,runDirectory,receipt:artifact})+'\n');
  return ['MEASURED','PASS'].includes(receipt.status)?0:2;
}
if(require.main===module){main(process.argv[2]).then(code=>{process.exitCode=code;}).catch(e=>{process.stdout.write(JSON.stringify({status:'STOP',reason:safeCode(e),inheritsP0Qualification:false})+'\n');process.exitCode=2;});}
module.exports={main};
