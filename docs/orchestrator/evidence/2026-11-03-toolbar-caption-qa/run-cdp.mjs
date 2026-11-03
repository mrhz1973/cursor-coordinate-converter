import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const base = 'http://127.0.0.1:18451/coordinate_converter%20Claude.html';
const expectedHash = '32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28';
const file = 'coordinate_converter Claude.html';
const bytes = await fs.readFile(file);
const actualHash = crypto.createHash('sha256').update(bytes).digest('hex');
if (actualHash !== expectedHash) throw new Error(`Runtime SHA mismatch: ${actualHash}`);

const targets = await (await fetch('http://127.0.0.1:19451/json/list')).json();
const target = targets.find(x => x.type === 'page');
if (!target) throw new Error('No Edge page target');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let id = 0;
const pending = new Map();
const blocked = [];
const exceptions = [];
ws.onmessage = async e => {
  const m = JSON.parse(typeof e.data === 'string' ? e.data : await e.data.text());
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method === 'Fetch.requestPaused') {
    const p = m.params;
    if (p.request.url.startsWith('http://127.0.0.1:18451/')) {
      send('Fetch.continueRequest', {requestId:p.requestId}).catch(()=>{});
    } else {
      blocked.push({url:p.request.url,method:p.request.method});
      send('Fetch.failRequest', {requestId:p.requestId,errorReason:'BlockedByClient'}).catch(()=>{});
    }
  }
  if (m.method === 'Runtime.exceptionThrown') exceptions.push(m.params.exceptionDetails?.text || 'uncaught');
};
function send(method, params={}) {
  return new Promise((resolve,reject)=>{
    const n=++id; pending.set(n,m=>m.error?reject(new Error(JSON.stringify(m.error))):resolve(m.result));
    ws.send(JSON.stringify({id:n,method,params}));
    setTimeout(()=>{if(pending.has(n)){pending.delete(n);reject(new Error(`timeout: ${method}`));}},10000).unref?.();
  });
}
async function evalValue(expression) {
  const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if(r.exceptionDetails) throw new Error(JSON.stringify({text:r.exceptionDetails.text,description:r.exceptionDetails.exception?.description,details:r.exceptionDetails}));
  return r.result?.value;
}
async function waitReady() {
  for(let i=0;i<100;i++){
    const state=await evalValue(`JSON.stringify({ready:document.readyState,topbar:!!document.querySelector('#appTopbar .app-topbar-caption'),body:document.body?.className||''})`);
    const v=JSON.parse(state||'{}');
    if(v.ready==='complete'&&v.topbar)return v;
    await new Promise(r=>setTimeout(r,100));
  }
  throw new Error('App did not reach ready state with topbar captions');
}
async function inspect(width,height,mobile,label){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile,screenWidth:width,screenHeight:height});
  await send('Emulation.setTouchEmulationEnabled',{enabled:mobile,maxTouchPoints:1});
  await send('Page.navigate',{url:`${base}?qa_toolbar=${label}_${Date.now()}`});
  const initial=await waitReady();
  await new Promise(r=>setTimeout(r,500));
  const metrics=JSON.parse(await evalValue(`(()=>{
    const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,top:r.top,bottom:r.bottom,left:r.left,right:r.right}};
    const hdr=document.querySelector('body.gis-mode>header')||document.querySelector('header');
    const top=document.getElementById('appTopbar');
    const map=document.getElementById('gisMapMount');
    const tm=document.querySelector('#gisMapMount .tile-map');
    const layer=document.querySelector('#gisMapMount .tile-map .tile-layers');
    const btns=[...document.querySelectorAll('#appTopbar .app-topbar-btn,#appTopbar .app-tab')].map(b=>({id:b.id||b.dataset.tab||b.tagName,text:b.innerText.trim(),rect:rect(b),caption:(()=>{const c=b.querySelector('.app-topbar-caption');const s=c&&getComputedStyle(c);return c?{text:c.innerText.trim(),display:s.display,visibility:s.visibility,rect:rect(c),font:s.fontSize}:null})()}));
    const tc=layer&&layer.querySelector('.tile-layer-caption');
    const lc=tc&&getComputedStyle(tc);
    const tabs=document.querySelector('#appTopbar .app-topbar-tabs');
    const actions=document.querySelector('#appTopbar .app-topbar-actions');
    return JSON.stringify({viewport:{width:innerWidth,height:innerHeight},body:document.body.className,header:rect(hdr),topbar:rect(top),map:rect(map),tileMap:rect(tm),layer:rect(layer),layerButton:rect(layer?.querySelector('.tlayer-btn')),layerCaption:tc?{text:tc.innerText.trim(),display:lc.display,rect:rect(tc)}:null,buttonCount:btns.length,buttons:btns,tabScroll:tabs?{clientWidth:tabs.clientWidth,scrollWidth:tabs.scrollWidth,overflowX:getComputedStyle(tabs).overflowX}:null,actions:actions?{clientWidth:actions.clientWidth,scrollWidth:actions.scrollWidth,overflowX:getComputedStyle(actions).overflowX}:null,headerLayerOverlap:!!(hdr&&layer&&layer.getBoundingClientRect().top<hdr.getBoundingClientRect().bottom),documentScroll:{clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}})
  })()`));
  const checks=[];
  checks.push({name:'seven primary toolbar controls',pass:metrics.buttonCount===7,actual:metrics.buttonCount});
  checks.push({name:'caption rectangles visible',pass:metrics.buttons.filter(x=>x.caption&&x.caption.display!=='none'&&x.caption.rect.h>0&&x.caption.rect.w>0).length===7,actual:metrics.buttons.filter(x=>x.caption&&x.caption.display!=='none'&&x.caption.rect.h>0&&x.caption.rect.w>0).length});
  checks.push({name:'Layer present and below header',pass:!!metrics.layer&&!metrics.headerLayerOverlap,actual:{layer:metrics.layer,overlap:metrics.headerLayerOverlap}});
  checks.push({name:'no document horizontal overflow',pass:metrics.documentScroll.scrollWidth<=metrics.documentScroll.clientWidth+1,actual:metrics.documentScroll});
  await send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false}).then(async r=>fs.writeFile(`docs/orchestrator/evidence/2026-11-03-toolbar-caption-qa/${label}.png`,Buffer.from(r.data,'base64')));
  // Functionality: tab selection, tools disclosure, export disclosure and layer menu.
  const tab=JSON.parse(await evalValue(`(()=>{const b=document.querySelector('#appTopbar [data-tab="favorites"]');b.click();return JSON.stringify({selected:b.getAttribute('aria-selected'),active:b.classList.contains('is-active')})})()`));
  checks.push({name:'Favorites tab opens',pass:tab.selected==='true',actual:tab});
  const tools=JSON.parse(await evalValue(`(()=>{const b=document.getElementById('btnTopbarTools');b.click();return JSON.stringify({expanded:b.getAttribute('aria-expanded'),hidden:document.getElementById('toolsDrawer')?.hidden})})()`));
  checks.push({name:'Tools opens',pass:tools.expanded==='true',actual:tools});
  const exp=JSON.parse(await evalValue(`(()=>{const d=document.getElementById('gisExportMenu');document.getElementById('gisExportSummary').click();return JSON.stringify({open:d.open,summary:!!document.getElementById('gisExportSummary')})})()`));
  checks.push({name:'Export menu opens',pass:exp.open&&exp.summary,actual:exp});
  const lyr=JSON.parse(await evalValue(`(()=>{const b=document.querySelector('#gisMapMount .tlayer-btn');if(!b)return JSON.stringify({exists:false});b.click();return JSON.stringify({exists:true,expanded:b.getAttribute('aria-expanded'),menuHidden:document.querySelector('#gisMapMount .tlayer-menu')?.hidden})})()`));
  checks.push({name:'Layer menu opens',pass:lyr.exists&&(lyr.expanded==='true'||lyr.menuHidden===false),actual:lyr});
  return {label,initial,metrics,checks};
}

await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
await send('Network.setCacheDisabled',{cacheDisabled:true});
await send('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}]});
const cases=[];
for(const c of [{width:1280,height:900,mobile:false,label:'desktop-1280'},{width:390,height:844,mobile:true,label:'mobile-390'},{width:320,height:720,mobile:true,label:'mobile-320'}]) cases.push(await inspect(c.width,c.height,c.mobile,c.label));
const failures=cases.flatMap(c=>c.checks.filter(x=>!x.pass).map(x=>({viewport:c.label,...x})));
const output={runtimeSha256:actualHash,cases,blockedExternalRequests:blocked,consoleExceptions:exceptions,failures};
await fs.writeFile('docs/orchestrator/evidence/2026-11-03-toolbar-caption-qa/results.json',JSON.stringify(output,null,2));
console.log(JSON.stringify({runtimeSha256:actualHash,summary:cases.map(c=>({viewport:c.label,checks:c.checks.map(x=>({name:x.name,pass:x.pass})),layerY:c.metrics.layer?.top,headerBottom:c.metrics.header?.bottom,overflow:c.metrics.documentScroll})),blockedExternalRequests:blocked.length,consoleExceptions:exceptions,failures},null,2));
ws.close();
