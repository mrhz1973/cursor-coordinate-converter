"use strict";
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require('playwright');
const BUILD=281;
const SHAS={280:'70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde',281:'e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62'};
const SHA=SHAS[BUILD];
const EDGE='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ORIGIN='https://ionos-n8n-new.tailc01234.ts.net';
const URL=ORIGIN+'/gis?v='+SHA+'&qa=windows-postdeploy-281';
const OUT=path.join(__dirname,'postdeploy-281');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const out={scope:'postdeploy_three_fixed_window_defects_not_general_pass',sourceMode:'live_https_document',candidateSha256:SHA,build:BUILD,
 environment:{platform:process.platform,architecture:process.arch,nodeVersion:process.version,playwright:require('playwright/package.json').version,engine:'Microsoft Edge (Chromium)',executablePath:EDGE},
 url:URL,startedAtUtc:new Date().toISOString(),networkPolicy:'Only the native HTTPS document GET is allowed; all accessory requests blocked.',nonGis:{executed:false,reason:'No supported user entry; no class/state mutation.'},runs:[]};
const desktop={name:'desktop',viewport:{width:1440,height:1000},isMobile:false,hasTouch:false};
const mobile={name:'edge_chromium_mobile_emulation',viewport:{width:390,height:844},isMobile:true,hasTouch:true};
const short={name:'edge_chromium_short_mobile_emulation',viewport:{width:390,height:600},isMobile:true,hasTouch:true};
const openTools=[['#btnTopbarTools','#btnTools']];
const panels={
 convert:{id:'convertModal',head:'.app-modal-head',body:'.app-modal-body',open:[['#topbarConvertBtn']],minimize:'[data-role="convertmodal-minimize"]',close:'#convertModalClose'},
 help:{id:'helpOverlay',head:'.app-modal-head',body:'.app-modal-body',open:[['#btnHeaderSettings'],['#btnHelp']],minimize:'[data-role="helppanel-minimize"]',close:'#helpClose'},
 astro:{id:'astroPanel',head:'#astroPanelHead',body:'#astroPanelBody',open:[...openTools,['#toolsMenuGrid [data-tool="astro"]']],minimize:'[data-role="astropanel-minimize"]',close:'#astroPanelClose'},
 track:{id:'trackModal',head:'.app-modal-head',body:'.app-modal-body',open:[['#miniMap [data-role="track-map-toggle"]']],minimize:'[data-role="trackmodal-minimize"]',close:'#trackModalClose'}
};
const matrix=[
 {name:'live-convert-accessibility',view:desktop,kind:'convert'},
 {name:'live-escape-convert-help',view:desktop,kind:'pair'},
 {name:'live-astro-390',view:mobile,kind:'astro'}
];
async function clickUi(page,options,run,label){
  await page.waitForFunction(options=>options.some(sel=>{const e=document.querySelector(sel);return !!e&&!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';}),options,{timeout:6000});
  for(const selector of options){
    const loc=page.locator(selector).first();
    if(await loc.count()&&await loc.isVisible()){
      run.actions.push({label,selector,kind:'normal_locator_click'});await loc.click({timeout:6000});return;
    }
  }
  throw new Error('no_visible_ui_opener_'+label+'_'+options.join('|'));
}
async function openPanel(page,panel,run){
  for(let i=0;i<panel.open.length;i++)await clickUi(page,panel.open[i],run,'open_'+panel.id+'_'+i);
  await page.waitForFunction(id=>{const e=document.getElementById(id);return e&&e.open&&!e.classList.contains('gis-panel-minimized');},panel.id,{timeout:6000});
  await stable(page,panel.id);
}
async function stable(page,id){
  await page.locator('#'+id).evaluate(el=>new Promise(resolve=>{
    let last='',equal=0,frames=0;
    const tick=()=>{const r=el.getBoundingClientRect();const key=[r.x,r.y,r.width,r.height].map(x=>Math.round(x*10)).join(',');
      equal=key===last?equal+1:0;last=key;
      if(equal>=3||++frames>=120)return resolve();requestAnimationFrame(tick);};requestAnimationFrame(tick);
  }));
}
async function axPanel(cdp,id){
  const doc=await cdp.send('DOM.getDocument',{depth:0});
  const q=await cdp.send('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'#'+id});
  if(!q.nodeId)return {missing:true};
  const tree=await cdp.send('Accessibility.getPartialAXTree',{nodeId:q.nodeId,fetchRelatives:false});
  const n=tree.nodes[0];return {role:n?.role?.value,name:n?.name?.value,ignored:n?.ignored,ignoredReasons:n?.ignoredReasons};
}
async function snapshot(page,cdp,panel,label){
  const v=await page.evaluate(({panel,label})=>{
    const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const visible=e=>!!e&&!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';
    const info=e=>{
      if(!e)return {missing:true};const r=e.getBoundingClientRect(),s=getComputedStyle(e),x=r.x+r.width/2,y=r.y+r.height/2;
      const inside=x>=0&&y>=0&&x<innerWidth&&y<innerHeight;
      const hit=inside?document.elementFromPoint(x,y):null;
      return {id:e.id,tag:e.tagName,rect:rect(e),visible:visible(e),disabled:!!e.disabled,
        centerInViewport:inside,centerReachable:inside&&!!hit&&(hit===e||e.contains(hit)),
        coveringElement:hit?{id:hit.id,tag:hit.tagName,className:typeof hit.className==='string'?hit.className:''}:null,
        display:s.display,position:s.position,zIndex:s.zIndex,overflowX:s.overflowX,overflowY:s.overflowY,
        scrollTop:e.scrollTop,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,
        scrollWidth:e.scrollWidth,clientWidth:e.clientWidth};
    };
    const p=document.getElementById(panel.id),head=p?.querySelector(panel.head),body=p?.querySelector(panel.body);
    const title=head?.querySelector('.app-modal-title,h1,h2,h3');
    const hstyle=head&&getComputedStyle(head);
    return {label,viewport:{width:innerWidth,height:innerHeight,visual:visualViewport?{width:visualViewport.width,height:visualViewport.height,offsetTop:visualViewport.offsetTop}:null,dpr:devicePixelRatio},
      gis:document.body.classList.contains('gis-mode'),pageScroll:{x:scrollX,y:scrollY},
      panel:{...info(p),open:!!p?.open,minimized:!!p?.classList.contains('gis-panel-minimized'),modal:!!p?.matches(':modal'),
        ariaModal:p?.getAttribute('aria-modal'),ariaHidden:p?.getAttribute('aria-hidden'),ariaLabel:p?.getAttribute('aria-label'),ariaLabelledby:p?.getAttribute('aria-labelledby')},
      header:{...info(head),heightCss:hstyle?.height,padding:hstyle?.padding},body:info(body),
      title:{text:title?.textContent?.trim()||'',id:title?.id||''},
      close:info(document.querySelector(panel.close)),minimize:info(document.querySelector(panel.minimize)),
      topbar:info(document.getElementById('appTopbar')),
      focus:{id:document.activeElement?.id,tag:document.activeElement?.tagName,className:document.activeElement?.className,dataRole:document.activeElement?.getAttribute('data-role'),ariaLabel:document.activeElement?.getAttribute('aria-label'),text:document.activeElement?.textContent?.trim().slice(0,80),closestDialog:document.activeElement?.closest('dialog')?.id||null},
      openDialogs:Array.from(document.querySelectorAll('dialog[open]')).map(e=>({id:e.id,minimized:e.classList.contains('gis-panel-minimized')}))};
  },{panel,label});
  v.accessibility=await axPanel(cdp,panel.id);return v;
}
async function capture(page,run,label){
  await page.evaluate(()=>Promise.all([...document.querySelectorAll('dialog[open]')].flatMap(e=>e.getAnimations({subtree:false})).filter(a=>a.playState==='running'&&a.effect?.getComputedTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));
  const name=run.name+'-'+label+'.png';await page.screenshot({path:path.join(OUT,name),fullPage:false});run.screenshots.push(name);
}
async function clickAction(page,run,snapshot,which,selector){
  const c=snapshot[which];
  if(!c||c.missing||!c.visible||!c.centerReachable||c.disabled){run.actions.push({label:which,selector,performed:false,reason:'control_not_reachable_without_scrolling_or_forcing'});return false;}
  const r=c.rect;await page.mouse.click(r.x+r.width/2,r.y+r.height/2);
  run.actions.push({label:which,selector,performed:true,kind:'pointer_at_observed_reachable_center'});return true;
}
function check(run,name,ok,details){run.checks.push({name,pass:!!ok,details});}
async function settle(page){await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
async function facts(page){return page.evaluate(()=>({
 focus:{id:document.activeElement?.id,tag:document.activeElement?.tagName,role:document.activeElement?.getAttribute('data-role'),closestDialog:document.activeElement?.closest('dialog')?.id||null},
 convertOpen:!!document.getElementById('convertModal')?.open,helpOpen:!!document.getElementById('helpOverlay')?.open,
 inputValue:document.getElementById('pasteInput')?.value,
 trackOpen:!!document.getElementById('trackModal')?.open,trackPick:!!state.track?.pickMode,
 trackPoints:state.track?.points?.map(p=>({lat:p.lat,lon:p.lon}))||[],savedTrackCount:state.savedTracks?.length||0,
 childOpen:!!document.getElementById('trackSaveNameDialog')?.open,childModal:!!document.getElementById('trackSaveNameDialog')?.matches(':modal'),
 childFocus:document.activeElement?.closest('dialog')?.id==='trackSaveNameDialog',
 unsavedCloseOpen:!!document.getElementById('trackUnsavedCloseDialog')?.open,
 dialogs:[...document.querySelectorAll('dialog[open]')].map(e=>({id:e.id,modal:e.matches(':modal'),minimized:e.classList.contains('gis-panel-minimized')}))
}));}
async function pressEscape(page,run,label){
 const before=await facts(page);await page.keyboard.press('Escape');await settle(page);const after=await facts(page);
 run.escapeSteps.push({label,before,after});return {before,after};
}
async function pairCase(page,cdp,run){
 await openPanel(page,panels.convert,run);await openPanel(page,panels.help,run);
 run.snapshots.push(await snapshot(page,cdp,panels.convert,'before_escape'),await snapshot(page,cdp,panels.help,'before_escape'));
 await capture(page,run,'before-escape');let e=await pressEscape(page,run,'first');
 check(run,'first_escape_closes_only_help',e.before.convertOpen&&e.before.helpOpen&&e.after.convertOpen&&!e.after.helpOpen,e);
 await capture(page,run,'after-first-escape');e=await pressEscape(page,run,'second');
 check(run,'second_escape_closes_convert',e.before.convertOpen&&!e.after.convertOpen&&!e.after.helpOpen,e);
}
function safeGeometry(run,s,label){
 const r=s.panel.rect,v=s.viewport;
 check(run,label+'_within_viewport',r.x>=-1&&r.y>=-1&&r.right<=v.width+1&&r.bottom<=v.height+1,r);
 check(run,label+'_header_controls_reachable',s.close.centerReachable&&s.minimize.centerReachable,{close:s.close,minimize:s.minimize});
 check(run,label+'_below_topbar',r.y>=s.topbar.rect.bottom-1,{panel:r,topbar:s.topbar.rect});
}

async function liveConvert(page,cdp,run){
 await openPanel(page,panels.convert,run);const s=await snapshot(page,cdp,panels.convert,'opened_live');run.snapshots.push(s);
 check(run,'native_accessible_name_matches_visible_title',s.accessibility.role==='dialog'&&!s.accessibility.ignored&&s.accessibility.name===s.title.text&&!!s.title.text,{ax:s.accessibility,title:s.title,ariaLabelledby:s.panel.ariaLabelledby});
 safeGeometry(run,s,'opened');await capture(page,run,'opened');
 assert(await clickAction(page,run,s,'close',panels.convert.close),'convert_close_not_reachable');await page.waitForFunction(()=>!document.getElementById('convertModal')?.open);
 check(run,'close_control_works',true);
}
async function liveAstro(page,cdp,run){
 await openPanel(page,panels.astro,run);let s=await snapshot(page,cdp,panels.astro,'opened_live');run.snapshots.push(s);safeGeometry(run,s,'opened');await capture(page,run,'opened');
 assert(await clickAction(page,run,s,'minimize',panels.astro.minimize),'astro_minimize_not_reachable');
 await page.waitForFunction(()=>document.getElementById('astroPanel')?.classList.contains('gis-panel-minimized'));
 await clickUi(page,['#gisMinimizedDock [data-gis-min-panel="astroPanel"]'],run,'restore_live_astro');await stable(page,'astroPanel');
 s=await snapshot(page,cdp,panels.astro,'restored_live');run.snapshots.push(s);safeGeometry(run,s,'restored');
 assert(await clickAction(page,run,s,'close',panels.astro.close),'astro_close_not_reachable');await page.waitForFunction(()=>!document.getElementById('astroPanel')?.open);
 check(run,'reachable_minimize_restore_close',true);
}
async function main(){
 assert(process.env.GIS_LIVE_WINDOWS_QA==='AUTHORIZED_AFTER_DEPLOY','live_postdeploy_gate_not_enabled');
 assert(!fs.existsSync(path.join(OUT,'audit-results.json')),'existing_live_result_no_duplicate_execution');fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:EDGE,args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps','--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']});out.browserVersion=browser.version();
 try{for(const config of matrix){
  const run={name:config.name,view:config.view,actions:[],snapshots:[],observations:[],checks:[],escapeSteps:[],screenshots:[],pageErrors:[],console:{},documentGate:{passed:false},network:{allowedDocumentGets:0,blocked:0,blockedPost:0,blockedProvider:0,websockets:0,byOrigin:{},faviconResponses:[],faviconBlocks:0}};
  const ctx=await browser.newContext({viewport:config.view.viewport,isMobile:config.view.isMobile,hasTouch:config.view.hasTouch,deviceScaleFactor:1,serviceWorkers:'block',permissions:[],acceptDownloads:false,ignoreHTTPSErrors:false});
  await ctx.routeWebSocket('**/*',ws=>{run.network.websockets++;ws.close();});
  await ctx.route('**/*',route=>{
   const q=route.request();
   if(q.url()===URL&&q.method()==='GET'&&q.isNavigationRequest()&&run.network.allowedDocumentGets===0){run.network.allowedDocumentGets++;return route.continue();}
   const u=new globalThis.URL(q.url());run.network.blocked++;run.network.byOrigin[u.origin]=(run.network.byOrigin[u.origin]||0)+1;if(q.method()==='POST')run.network.blockedPost++;if(/^\/(?:_routing\/gh\/|ors\/|v2\/directions\/)|^\/(?:info|nearest|route)$/.test(u.pathname))run.network.blockedProvider++;return route.abort('blockedbyclient');
  });
  const page=await ctx.newPage();page.setDefaultTimeout(6000);page.on('pageerror',e=>run.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error'){const t=m.text();run.console[t]=(run.console[t]||0)+1;}});page.on('dialog',async d=>{run.actions.push({label:'unexpected_browser_dialog',type:d.type(),message:d.message()});await d.dismiss();});
  const cdp=await ctx.newCDPSession(page),favIds=new Set();let docResponse=null,docFinished=false;
  // The 11 MB standalone document must remain available for native body hashing.
  await cdp.send('Network.enable',{maxTotalBufferSize:67108864,maxResourceBufferSize:25165824,enableDurableMessages:true});
  await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});await cdp.send('Network.setBlockedURLs',{urls:[ORIGIN+'/favicon.ico']});
  cdp.on('Network.requestWillBeSent',e=>{if(e.request.url===ORIGIN+'/favicon.ico')favIds.add(e.requestId);});
  cdp.on('Network.responseReceived',e=>{if(e.response.url===ORIGIN+'/favicon.ico')run.network.faviconResponses.push(e.response.status);if(e.type==='Document'&&e.response.url===URL)docResponse=e;});
  cdp.on('Network.loadingFinished',e=>{if(docResponse?.requestId===e.requestId)docFinished=true;});
  cdp.on('Network.loadingFailed',e=>{if(favIds.has(e.requestId)&&e.blockedReason==='inspector')run.network.faviconBlocks++;});
  try{
   const nav=await page.goto(URL,{waitUntil:'load',timeout:25000});
   assert(nav&&nav.status()===200&&page.url()===URL,'native_document_http_or_final_url_failed');
   assert(docResponse&&docFinished,'native_document_response_not_observed_complete');
   const body=await cdp.send('Network.getResponseBody',{requestId:docResponse.requestId});const bytes=Buffer.from(body.body,body.base64Encoded?'base64':'utf8');
   run.documentGate={passed:false,url:docResponse.response.url,httpStatus:docResponse.response.status,bytes:bytes.length,sha256:hash(bytes),fromDiskCache:!!docResponse.response.fromDiskCache,fromServiceWorker:!!docResponse.response.fromServiceWorker,securityState:docResponse.response.securityState,
    tls:docResponse.response.securityDetails?{protocol:docResponse.response.securityDetails.protocol,issuer:docResponse.response.securityDetails.issuer,subjectName:docResponse.response.securityDetails.subjectName,validFrom:docResponse.response.securityDetails.validFrom,validTo:docResponse.response.securityDetails.validTo}:null,
    method:'native CDP Network.getResponseBody; no document fulfill, injection or response edits'};
   assert(bytes.length===11108861&&hash(bytes)===SHA,'live_document_byte_mismatch');run.documentGate.passed=true;
   await page.waitForFunction(()=>typeof APP_BUILD_NUM!=='undefined'&&APP_BUILD_NUM===281&&document.body.classList.contains('gis-mode'));
   if(config.kind==='convert')await liveConvert(page,cdp,run);else if(config.kind==='pair')await pairCase(page,cdp,run);else if(config.kind==='astro')await liveAstro(page,cdp,run);
   run.completed=true;
  }catch(e){run.harnessOrUiError=String(e.message||e);if(!run.documentGate.passed)run.blockedBeforeUi=true;try{await capture(page,run,'interrupted');}catch(_){}
  }finally{
   check(run,'native_live_document_sha_pass',run.documentGate.passed,run.documentGate);check(run,'no_javascript_page_errors',run.pageErrors.length===0,run.pageErrors);check(run,'zero_provider_and_post_attempts',run.network.blockedProvider===0&&run.network.blockedPost===0,run.network);
   run.targetedPass=!!run.completed&&run.checks.every(c=>c.pass);await ctx.close();out.runs.push(run);fs.writeFileSync(path.join(OUT,'audit-results.json'),JSON.stringify(out,null,2)+'\n');
  }
  console.log(JSON.stringify({case:run.name,completed:!!run.completed,targetedPass:run.targetedPass,error:run.harnessOrUiError,documentGate:run.documentGate,failedChecks:run.checks.filter(c=>!c.pass).map(c=>c.name),pageErrors:run.pageErrors,providerAttempts:run.network.blockedProvider,postAttempts:run.network.blockedPost}));
  if(!run.documentGate.passed){out.stoppedForDocumentGate=true;break;}
 }}finally{await browser.close();out.finishedAtUtc=new Date().toISOString();out.targetedPass=out.runs.length===matrix.length&&out.runs.every(r=>r.targetedPass);fs.writeFileSync(path.join(OUT,'audit-results.json'),JSON.stringify(out,null,2)+'\n');}
}
main().catch(e=>{out.fatal=e.message;fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'audit-results.json'),JSON.stringify(out,null,2)+'\n');console.error(e.message);process.exitCode=1;});
