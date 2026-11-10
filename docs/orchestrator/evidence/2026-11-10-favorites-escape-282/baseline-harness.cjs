'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const pptr=require('C:/Users/Utente/AppData/Local/npm-cache/_npx/4b4c857f6efdfb61/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
const config=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const BASE=__dirname,URL='https://ionos-n8n-new.tailc01234.ts.net/gis?v='+config.expectedSha256;
const candidate=config.runtimePath?fs.readFileSync(config.runtimePath):null;
if(candidate&&crypto.createHash('sha256').update(candidate).digest('hex')!==config.expectedSha256)throw Error('candidate_input_identity');
const result={startedAtUtc:new Date().toISOString(),scope:'favorites_escape_desktop',sourceMode:candidate?'candidate_injected_document':'native_https_document',expectedSha256:config.expectedSha256,viewport:{width:1440,height:1000},phoneWork:false,cases:[]};
const output=path.join(BASE,config.outputName);
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
  return {favoritesOpen:!!f?.open,favoritesMinimized:!!f?.classList.contains('gis-panel-minimized'),favoriteDockChip:!!chip,layersOpen:!!l?.open,focusedId:document.activeElement?.id||null,openDialogs:Array.from(document.querySelectorAll('dialog[open]')).map(e=>({id:e.id,minimized:e.classList.contains('gis-panel-minimized')}))};
 });
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
 result.status=result.cases.some(c=>c.status==='HARNESS_OR_TRANSPORT_ERROR')?'INCOMPLETE':result.cases.every(c=>c.status==='PASS')?'PASS':'APPLICATION_FAIL_REPRODUCED';
}catch(e){result.status='INCOMPLETE';result.error=String(e.stack||e).slice(0,1400);}
finally{
 result.finishedAtUtc=new Date().toISOString();save();
 if(browser){let timer;try{await Promise.race([browser.close(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('cleanup_timeout')),5000);})]);result.cleanup='closed';}catch(e){result.cleanup=String(e.message);const p=browser.process();if(p&&!p.killed)p.kill();}finally{clearTimeout(timer);}}
 clearTimeout(watchdog);save();console.log(JSON.stringify(result));process.exitCode=result.status==='INCOMPLETE'?2:0;
}})();
