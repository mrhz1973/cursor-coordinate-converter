'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const pptr=require('C:/Users/Utente/AppData/Local/npm-cache/_npx/4b4c857f6efdfb61/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
const config=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const BASE=__dirname,URL='https://ionos-n8n-new.tailc01234.ts.net/gis?v='+config.expectedSha256;
const candidate=config.runtimePath?fs.readFileSync(config.runtimePath):null;
if(candidate&&crypto.createHash('sha256').update(candidate).digest('hex')!==config.expectedSha256)throw Error('candidate_input_identity');
const result={startedAtUtc:new Date().toISOString(),scope:'favorites_escape_desktop_regression',sourceMode:candidate?'candidate_injected_document':'native_https_document',expectedSha256:config.expectedSha256,viewport:{width:1440,height:1000},phoneWork:false,expectedBuild:config.expectedBuild||null,block:config.block||null,baselineHarnessSha256:'1d7613b2fbefa6589fd9d429dba106ae79ad848ef5e8595ee15b5d7362f95958',outOfGis:{status:'N/A',reason:'The outside-GIS branch is not reachable through ordinary UI in this GIS application; no state or app helper is forced.'},cases:[]};
requireCondition(path.basename(config.outputName)===config.outputName&&!/baseline|escape\.cjs/i.test(config.outputName),'output_must_not_overwrite_baseline');
const output=path.join(BASE,config.outputName);
requireCondition(!fs.existsSync(output),'result_output_already_exists');
let browser;
function save(){fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');}
function requireCondition(ok,name){if(!ok)throw Error(name);}
const watchdog=setTimeout(()=>{result.status='INCOMPLETE';result.error='harness_deadline_120s';result.finishedAtUtc=new Date().toISOString();save();const p=browser&&browser.process();if(p&&!p.killed)p.kill();process.exit(2);},120000);
async function clickTab(page,word){
 const handle=await page.waitForFunction(term=>{
  const rx=new RegExp('(^|\\s|\\b)'+term+'($|\\s|\\b)','i');
  return Array.from(document.querySelectorAll('button,[role="tab"]')).find(e=>{
   const r=e.getBoundingClientRect();
   if(!r.width||!r.height||r.bottom<0||r.right<0||getComputedStyle(e).visibility==='hidden')return false;
   return [e.textContent,e.title,e.getAttribute('aria-label'),e.getAttribute('data-tab'),e.getAttribute('data-tab-key')].some(x=>x&&rx.test(x.trim()));
  });
 },{timeout:10000},word);
 const info=await page.evaluate(e=>({id:e.id,text:e.textContent.trim().slice(0,100),title:e.title,ariaLabel:e.getAttribute('aria-label')}),handle);
 const el=handle.asElement();requireCondition(el,'tab_not_element');await el.click();return info;
}
async function state(page){
 return page.evaluate(()=>{
  const f=document.getElementById('favoritesPanel'),l=document.getElementById('layersPanel');
  const chip=document.querySelector('#gisMinimizedDock [data-gis-min-panel="favoritesPanel"]');
  const rect=f?.getBoundingClientRect(),css=f?getComputedStyle(f):null;
  return {favoritesTagName:f?.tagName||null,favoritesModal:f?f.matches(':modal'):null,favoritesVisible:!!(f?.open&&rect&&rect.width>0&&rect.height>0&&css?.display!=='none'&&css?.visibility!=='hidden'&&rect.bottom>0&&rect.right>0&&rect.top<innerHeight&&rect.left<innerWidth),favoriteDockChipCount:document.querySelectorAll('#gisMinimizedDock [data-gis-min-panel="favoritesPanel"]').length,favoritesOpen:!!f?.open,favoritesMinimized:!!f?.classList.contains('gis-panel-minimized'),favoriteDockChip:!!chip,layersOpen:!!l?.open,focusedId:document.activeElement?.id||null,openDialogs:Array.from(document.querySelectorAll('dialog[open]')).map(e=>({id:e.id,minimized:e.classList.contains('gis-panel-minimized')}))};
 });
}
async function outcome(page,predicate){
 try{await page.waitForFunction(predicate,{timeout:3500});return true;}
 catch(e){if(e.name==='TimeoutError')return false;throw e;}
}
async function clickFavoritesClose(page){
 const handle=await page.waitForFunction(()=>{
  const panel=document.getElementById('favoritesPanel');
  if(!panel)return null;
  const head=panel.querySelector('.app-modal-head')||panel.querySelector('header')||panel.querySelector('[id$="Head"]');
  const pool=Array.from((head||panel).querySelectorAll('button'));
  const matches=pool.filter(e=>{
   const r=e.getBoundingClientRect(),css=getComputedStyle(e);
   if(!r.width||!r.height||css.visibility==='hidden'||css.display==='none')return false;
   const text=e.textContent.trim(),label=[e.getAttribute('aria-label')||'',e.title||''].join(' ');
   return /^[\u00d7\u2715\u2716]$/.test(text)||/\b(?:chiudi|close)\b/i.test(label);
  });
  return matches.length===1?matches[0]:null;
 },{timeout:5000});
 const info=await page.evaluate(e=>({id:e.id,text:e.textContent.trim(),ariaLabel:e.getAttribute('aria-label'),title:e.title}),handle);
 const button=handle.asElement();requireCondition(button,'favorites_close_not_element');await button.click();return info;
}
async function lifecycleAfterEscape(page,c,check){
 c.lifecycle={};
 await page.click('#gisMinimizedDock [data-gis-min-panel="favoritesPanel"]');
 await outcome(page,()=>{const p=document.getElementById('favoritesPanel');return p?.open&&!p.classList.contains('gis-panel-minimized')&&!document.querySelector('#gisMinimizedDock [data-gis-min-panel="favoritesPanel"]');});
 const restored=await state(page);c.lifecycle.restored=restored;
 check('restored_favorites_open',restored.favoritesOpen);
 check('restored_favorites_visible',restored.favoritesVisible);
 check('restored_favorites_not_minimized',!restored.favoritesMinimized);
 check('restored_favorites_dock_removed',!restored.favoriteDockChip);
 if(!restored.favoritesOpen||!restored.favoritesVisible||restored.favoritesMinimized||restored.favoriteDockChip)return;
 c.lifecycle.closeButton=await clickFavoritesClose(page);
 await outcome(page,()=>!document.getElementById('favoritesPanel')?.open);
 const closed=await state(page);c.lifecycle.closed=closed;
 check('close_button_closes_favorites',!closed.favoritesOpen);
 check('close_button_clears_minimized_class',!closed.favoritesMinimized);
 check('close_button_clears_dock',!closed.favoriteDockChip);
 if(closed.favoritesOpen||closed.favoritesMinimized||closed.favoriteDockChip)return;
 c.lifecycle.reopen=await clickTab(page,'preferiti|favorites');
 await outcome(page,()=>{const p=document.getElementById('favoritesPanel');return p?.open&&!p.classList.contains('gis-panel-minimized');});
 const reopened=await state(page);c.lifecycle.reopened=reopened;
 check('new_cycle_reopened_from_ui',reopened.favoritesOpen&&reopened.favoritesVisible);
 check('new_cycle_starts_not_minimized',!reopened.favoritesMinimized);
 check('new_cycle_starts_without_dock',!reopened.favoriteDockChip);
 if(!reopened.favoritesOpen||!reopened.favoritesVisible||reopened.favoritesMinimized||reopened.favoriteDockChip)return;
 await page.click('[data-role="favoritespanel-minimize"]');
 await outcome(page,()=>{const p=document.getElementById('favoritesPanel');return p?.open&&p.classList.contains('gis-panel-minimized')&&document.querySelectorAll('#gisMinimizedDock [data-gis-min-panel="favoritesPanel"]').length===1;});
 const againMin=await state(page);c.lifecycle.newCycleMinimized=againMin;
 check('new_cycle_minimizes_with_one_dock_chip',againMin.favoritesOpen&&againMin.favoritesMinimized&&againMin.favoriteDockChipCount===1);
 if(!againMin.favoritesOpen||!againMin.favoritesMinimized||againMin.favoriteDockChipCount!==1)return;
 await page.click('#gisMinimizedDock [data-gis-min-panel="favoritesPanel"]');
 await outcome(page,()=>{const p=document.getElementById('favoritesPanel');return p?.open&&!p.classList.contains('gis-panel-minimized')&&!document.querySelector('#gisMinimizedDock [data-gis-min-panel="favoritesPanel"]');});
 const againRestored=await state(page);c.lifecycle.newCycleRestored=againRestored;
 check('new_cycle_restores_cleanly',againRestored.favoritesOpen&&againRestored.favoritesVisible&&!againRestored.favoritesMinimized&&!againRestored.favoriteDockChip);
 if(!againRestored.favoritesOpen||!againRestored.favoritesVisible||againRestored.favoritesMinimized||againRestored.favoriteDockChip)return;
 await clickFavoritesClose(page);
 await outcome(page,()=>!document.getElementById('favoritesPanel')?.open);
 const againClosed=await state(page);c.lifecycle.newCycleClosed=againClosed;
 check('new_cycle_closes_cleanly',!againClosed.favoritesOpen&&!againClosed.favoritesMinimized&&!againClosed.favoriteDockChip);
}
async function visibleMapInteraction(page,c,check){
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const panelState=await state(page);
 const nonModal=check('visible_favorites_are_a_non_modal_dialog',panelState.favoritesTagName==='DIALOG'&&panelState.favoritesOpen&&panelState.favoritesVisible&&panelState.favoritesModal===false);
 const probe=await page.evaluate(()=>{
  const map=document.querySelector('#miniMap .tile-map');
  if(!map)return {mapFound:false,ancestors:[],point:null,scales:[]};
  const ancestors=[];for(let e=map;e;e=e.parentElement)ancestors.push({tag:e.tagName,id:e.id||null,inert:!!e.inert||e.hasAttribute('inert')});
  const r=map.getBoundingClientRect(),left=Math.max(0,r.left)+18,right=Math.min(innerWidth,r.right)-18,top=Math.max(0,r.top)+18,bottom=Math.min(innerHeight,r.bottom)-18;
  let point=null;
  for(const fy of [0.25,0.5,0.75]){for(const fx of [0.2,0.5,0.8]){
   const x=left+(right-left)*fx,y=top+(bottom-top)*fy,hit=document.elementFromPoint(x,y);
   if(right<=left||bottom<=top||!hit||!map.contains(hit))continue;
   if(hit.closest('dialog,button,input,select,textarea,a,[role="button"],.tile-ctrls,.tile-layers,.tile-attrib,.tile-bottom-left,.tile-readout,.tile-scale,.gis-panel-resize-handle'))continue;
   point={x,y,targetTag:hit.tagName,targetId:hit.id||null,targetClass:typeof hit.className==='string'?hit.className:null};break;
  }if(point)break;}
  const scales=Array.from(document.querySelectorAll('#miniMap .tile-scale-ratio-main,#miniMap .tile-scale-label-metric,#miniMap .tile-scale-label-naut')).filter(e=>{
   const b=e.getBoundingClientRect(),s=getComputedStyle(e);return b.width>0&&b.height>0&&b.bottom>0&&b.right>0&&b.top<innerHeight&&b.left<innerWidth&&s.visibility!=='hidden'&&s.display!=='none';
  }).map(e=>({className:e.className,text:e.textContent.trim()}));
  return {mapFound:true,rect:{x:r.x,y:r.y,width:r.width,height:r.height},ancestors,point,scales};
 });
 c.mapGesture={before:probe,input:{kind:'real_mouse_wheel',deltaY:120}};
 const noInert=check('map_path_has_no_inert',probe.mapFound&&probe.ancestors.every(e=>!e.inert));
 const freePoint=check('free_map_pointer_target_available',!!probe.point);
 if(!nonModal||!noInert||!freePoint){c.mapGesture.status='NOT_EXECUTED_PRECONDITION_FAILED';return;}
 requireCondition(probe.scales.length>0&&probe.scales.some(e=>e.text),'visible_map_scale_locator_unavailable');
 const beforeSignature=JSON.stringify(probe.scales);
 await page.mouse.move(probe.point.x,probe.point.y);
 await page.mouse.wheel({deltaY:120});
 let changed=false;
 try{
  await page.waitForFunction(previous=>{
   const scales=Array.from(document.querySelectorAll('#miniMap .tile-scale-ratio-main,#miniMap .tile-scale-label-metric,#miniMap .tile-scale-label-naut')).filter(e=>{
    const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth&&s.visibility!=='hidden'&&s.display!=='none';
   }).map(e=>({className:e.className,text:e.textContent.trim()}));
   return scales.length>0&&JSON.stringify(scales)!==previous;
  },{timeout:3500},beforeSignature);changed=true;
 }catch(e){if(e.name!=='TimeoutError')throw e;}
 c.mapGesture.after=await page.evaluate(()=>Array.from(document.querySelectorAll('#miniMap .tile-scale-ratio-main,#miniMap .tile-scale-label-metric,#miniMap .tile-scale-label-naut')).filter(e=>{
  const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth&&s.visibility!=='hidden'&&s.display!=='none';
 }).map(e=>({className:e.className,text:e.textContent.trim()})));
 c.mapGesture.status=changed?'PASS':'NO_OBSERVABLE_EFFECT';
 check('real_map_wheel_changes_visible_scale',changed);
 const after=await state(page);c.mapGesture.favoritesAfter=after;
 check('favorites_stay_visible_during_map_interaction',after.favoritesOpen&&after.favoritesVisible&&!after.favoritesMinimized);
}

async function runCase(name,mode){
 const c={name,mode,checks:[],pageErrors:[],requests:{documents:0,blocked:0,postAttempts:0}};
 result.cases.push(c);let context;
 function check(name,ok){c.checks.push({name,ok:!!ok});return !!ok;}
 try{
  context=await browser.createBrowserContext();const page=await context.newPage();
  await page.setViewport(result.viewport);await page.setCacheEnabled(false);await page.setBypassServiceWorker(true);
  await page.setRequestInterception(true);
  page.on('pageerror',e=>c.pageErrors.push(String(e.message).slice(0,400)));
  page.on('request',r=>{
   if(r.method()==='POST')c.requests.postAttempts++;
   if(r.method()==='GET'&&r.isNavigationRequest()&&r.frame()===page.mainFrame()&&r.url()===URL){
    c.requests.documents++;if(candidate)r.respond({status:200,contentType:'text/html; charset=utf-8',body:candidate});else r.continue();
   }else{c.requests.blocked++;r.abort('blockedbyclient');}
  });
  const cdp=await page.createCDPSession();const {frameTree}=await cdp.send('Page.getFrameTree');const mainFrameId=frameTree.frame.id;
  let documentRequestId,finishDoc,failDoc;const loaded=new Promise((resolve,reject)=>{finishDoc=resolve;failDoc=reject;});loaded.catch(()=>{});
  cdp.on('Network.requestWillBeSent',e=>{if(e.type==='Document'&&e.frameId===mainFrameId&&e.request.url===URL)documentRequestId=e.requestId;});
  cdp.on('Network.loadingFinished',e=>{if(e.requestId===documentRequestId)finishDoc();});
  cdp.on('Network.loadingFailed',e=>{if(e.requestId===documentRequestId)failDoc(Error('document_loading_failed: '+e.errorText));});
  await cdp.send('Network.enable',{maxTotalBufferSize:48*1024*1024,maxResourceBufferSize:24*1024*1024});
  const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:30000});
  requireCondition(check('http_200',response?.status()===200),'http_200');
  let timer;try{await Promise.race([loaded,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('document_capture_timeout')),5000);})]);}finally{clearTimeout(timer);}
  const raw=await cdp.send('Network.getResponseBody',{requestId:documentRequestId});
  const bytes=Buffer.from(raw.body,raw.base64Encoded?'base64':'utf8');c.runtimeBytes=bytes.length;c.runtimeSha256=crypto.createHash('sha256').update(bytes).digest('hex');
  requireCondition(check('runtime_identity',bytes.length===config.expectedBytes&&c.runtimeSha256===config.expectedSha256),'runtime_identity');
  c.opener=await clickTab(page,'preferiti|favorites');
  await page.waitForFunction(()=>document.getElementById('favoritesPanel')?.open&&!document.getElementById('favoritesPanel').classList.contains('gis-panel-minimized'),{timeout:5000});
  check('favorites_opened_from_ui',true);
  if(mode!=='visible'){
   await page.click('[data-role="favoritespanel-minimize"]');
   await page.waitForFunction(()=>document.getElementById('favoritesPanel')?.classList.contains('gis-panel-minimized')&&!!document.querySelector('#gisMinimizedDock [data-gis-min-panel="favoritesPanel"]'),{timeout:5000});
   check('favorites_minimized_with_dock',true);
  }
  if(mode==='minimized_with_layers'){
   c.layersOpener=await clickTab(page,'livelli|layers');
   await page.waitForFunction(()=>document.getElementById('layersPanel')?.open,{timeout:5000});
   await page.click('#layersPanel .app-modal-title');
   check('layers_opened_from_ui',true);
  }
  if(mode==='visible')await visibleMapInteraction(page,c,check);
  c.before=await state(page);
  await page.keyboard.press('Escape');
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  c.after=await state(page);
  if(mode==='visible')check('visible_favorites_close_on_escape',!c.after.favoritesOpen&&!c.after.favoriteDockChip);
  else{
   check('minimized_favorites_remain_open',c.after.favoritesOpen);
   check('minimized_favorites_keep_minimized_state',c.after.favoritesMinimized);
   check('minimized_favorites_keep_dock',c.after.favoriteDockChip);
   if(mode==='minimized_with_layers')check('visible_layers_receive_escape',!c.after.layersOpen);
  }
  if(mode==='minimized'){
   if(c.after.favoritesOpen&&c.after.favoritesMinimized&&c.after.favoriteDockChip)await lifecycleAfterEscape(page,c,check);
   else c.lifecycle={status:'NOT_EXECUTED',reason:'Minimized Favorites did not survive Escape; baseline failure preserved.'};
  }
  check('no_post_attempts',c.requests.postAttempts===0);check('no_captured_page_errors',c.pageErrors.length===0);
  c.status=c.checks.every(x=>x.ok)?'PASS':'APPLICATION_FAIL_REPRODUCED';
 }catch(e){c.status='HARNESS_OR_TRANSPORT_ERROR';c.error=String(e.stack||e).slice(0,1400);}
 finally{save();if(context)await context.close();}
}
(async()=>{try{
 browser=await pptr.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',timeout:20000,args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps','--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']});
 result.browserVersion=await browser.version();result.nodeVersion=process.version;
 for(const [name,mode]of [['minimized_favorites_alone','minimized'],['minimized_favorites_with_visible_layers','minimized_with_layers'],['visible_favorites_escape_control','visible']]){
  await runCase(name,mode);if(result.cases.at(-1).status==='HARNESS_OR_TRANSPORT_ERROR')break;
 }
 result.summary={cases:result.cases.length,checks:result.cases.reduce((n,c)=>n+c.checks.length,0),passed:result.cases.reduce((n,c)=>n+c.checks.filter(x=>x.ok).length,0),failed:result.cases.reduce((n,c)=>n+c.checks.filter(x=>!x.ok).length,0)};
 result.status=result.cases.some(c=>c.status==='HARNESS_OR_TRANSPORT_ERROR')?'INCOMPLETE':result.cases.every(c=>c.status==='PASS')?'PASS':'APPLICATION_FAIL_REPRODUCED';
}catch(e){result.status='INCOMPLETE';result.error=String(e.stack||e).slice(0,1400);}
finally{
 result.finishedAtUtc=new Date().toISOString();save();
 if(browser){let timer;try{await Promise.race([browser.close(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('cleanup_timeout')),5000);})]);result.cleanup='closed';}catch(e){result.cleanup=String(e.message);const p=browser.process();if(p&&!p.killed)p.kill();}finally{clearTimeout(timer);}}
 clearTimeout(watchdog);save();console.log(JSON.stringify(result));process.exitCode=result.status==='INCOMPLETE'?2:0;
}})();
