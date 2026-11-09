"use strict";
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require('playwright');
const APP='/workspace/scratch/bcbe375c6817/gis-release-280/coordinate_converter Claude.html';
const SHA='70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde';
const ORIGIN='https://ionos-n8n-new.tailc01234.ts.net';
const URL=ORIGIN+'/gis?v='+SHA+'&qa=windows-audit';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const out={scope:'targeted_window_diagnostics_not_general_pass',sourceMode:'candidate_injected',candidateSha256:SHA,
  environment:{platform:process.platform,architecture:process.arch,nodeVersion:process.version,playwright:require('playwright/package.json').version},url:URL,startedAtUtc:new Date().toISOString(),realNetworkRequests:0,
  nonGis:{executed:false,reason:'No supported user entry in Build280: inventory reports init forces GIS. No body-class or state mutation.'},runs:[]};
const desktop={name:'desktop',viewport:{width:1440,height:1000},isMobile:false,hasTouch:false};
const mobile={name:'chromium_mobile_emulation',viewport:{width:390,height:844},isMobile:true,hasTouch:true};
const openTools=[['#btnTopbarTools','#btnTools']];
const panels={
  convert:{id:'convertModal',head:'.app-modal-head',body:'.app-modal-body',open:[['#topbarConvertBtn']],
    minimize:'[data-role="convertmodal-minimize"]',close:'#convertModalClose'},
  help:{id:'helpOverlay',head:'.app-modal-head',body:'.app-modal-body',open:[['#btnHeaderSettings'],['#btnHelp']],
    minimize:'[data-role="helppanel-minimize"]',close:'#helpClose'},
  tools:{id:'toolsDrawer',head:'#toolsDrawerHead',body:'.tools-drawer-body',open:openTools,
    minimize:'#toolsDrawerMinimize',close:'#toolsDrawerClose'},
  measure:{id:'measurePanel',head:'#measurePanelHead',body:'#measurePanelBody',open:[['#miniMap [data-role="measure-box-toggle"]']],
    minimize:'[data-role="measurepanel-minimize"]',close:'#measurePanelClose'},
  astro:{id:'astroPanel',head:'#astroPanelHead',body:'#astroPanelBody',open:[...openTools,['#toolsMenuGrid [data-tool="astro"]']],
    minimize:'[data-role="astropanel-minimize"]',close:'#astroPanelClose'}
};
const matrix=[
  {name:'desktop-convert',view:desktop,panel:'convert'},
  {name:'desktop-help-scroll',view:desktop,panel:'help'},
  {name:'desktop-tools',view:desktop,panel:'tools'},
  {name:'desktop-measure-reference',view:desktop,panel:'measure'},
  {name:'mobile-convert-reference',view:mobile,panel:'convert'},
  {name:'mobile-astro-safe-top',view:mobile,panel:'astro'},
  {name:'desktop-escape-convert-help',view:desktop,escape:true}
];

async function clickUi(page,options,run,label){
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
      focus:{id:document.activeElement?.id,tag:document.activeElement?.tagName},
      openDialogs:Array.from(document.querySelectorAll('dialog[open]')).map(e=>({id:e.id,minimized:e.classList.contains('gis-panel-minimized')}))};
  },{panel,label});
  v.accessibility=await axPanel(cdp,panel.id);return v;
}
async function capture(page,run,label){
  const name=run.name+'-'+label+'.png';await page.screenshot({path:path.join(__dirname,name),fullPage:false});run.screenshots.push(name);
}
function detect(snapshot,run){
  const p=snapshot.panel,r=p.rect,v=snapshot.viewport;
  if(r&&(r.x< -1||r.y< -1||r.right>v.width+1||r.bottom>v.height+1))run.observations.push({phase:snapshot.label,kind:'panel_outside_viewport',rect:r,viewport:v});
  for(const control of ['close','minimize']){
    const c=snapshot[control];
    if(c.missing||!c.visible||!c.centerReachable)run.observations.push({phase:snapshot.label,kind:'header_action_unreachable',control,details:c});
  }
  if(!snapshot.accessibility.ignored&&!snapshot.accessibility.name)run.observations.push({phase:snapshot.label,kind:'empty_computed_accessible_name',role:snapshot.accessibility.role});
  if(snapshot.accessibility.ignored)run.observations.push({phase:snapshot.label,kind:'open_panel_ignored_by_accessibility_tree',details:snapshot.accessibility});
}
async function clickAction(page,run,snapshot,which,selector){
  const c=snapshot[which];
  if(!c||c.missing||!c.visible||!c.centerReachable||c.disabled){run.actions.push({label:which,selector,performed:false,reason:'control_not_reachable_without_scrolling_or_forcing'});return false;}
  const r=c.rect;await page.mouse.click(r.x+r.width/2,r.y+r.height/2);
  run.actions.push({label:which,selector,performed:true,kind:'pointer_at_observed_reachable_center'});return true;
}
async function inspectPanel(page,cdp,run,config){
  const panel=panels[config.panel];await openPanel(page,panel,run);
  let s=await snapshot(page,cdp,panel,'opened');run.snapshots.push(s);detect(s,run);await capture(page,run,'opened');
  if(!s.body.missing&&s.body.scrollHeight>s.body.clientHeight+2&&s.body.clientHeight>40){
    const before=s.body.scrollTop,r=s.body.rect;
    const x=Math.max(5,Math.min(innerWidthFallback(config)-5,r.right-18)),y=Math.max(80,Math.min(config.view.viewport.height-20,r.y+Math.min(100,r.height/2)));
    await page.mouse.move(x,y);await page.mouse.wheel(0,500);
    let changed=true;try{await page.waitForFunction(({id,body,before})=>document.querySelector('#'+id+' '+body)?.scrollTop!==before,{id:panel.id,body:panel.body,before},{timeout:1500});}catch(_){changed=false;}
    const after=await snapshot(page,cdp,panel,'after_internal_wheel');
    run.scrollCheck={input:'mouse wheel; mobile case is Chromium viewport emulation, not a Safari touch test',overflowY:s.body.overflowY,
      before,after:after.body.scrollTop,changed,pageScrollBefore:s.pageScroll,pageScrollAfter:after.pageScroll};
    if(!changed)run.observations.push({phase:'scroll',kind:'internal_scroll_not_observed',details:run.scrollCheck});
    run.snapshots.push(after);detect(after,run);s=after;
    if(config.panel==='help')await capture(page,run,'scrolled');
  }else run.scrollCheck={required:false,reason:'No overflowing body in this initial state'};
  if(await clickAction(page,run,s,'minimize',panel.minimize)){
    await page.waitForFunction(id=>document.getElementById(id)?.classList.contains('gis-panel-minimized'),panel.id,{timeout:5000});
    run.minimized=await snapshot(page,cdp,panel,'minimized');
    if(config.name==='desktop-convert')await capture(page,run,'minimized');
    const restore='#gisMinimizedDock [data-gis-min-panel="'+panel.id+'"]';
    await clickUi(page,[restore],run,'restore_'+panel.id);await stable(page,panel.id);
    await page.waitForFunction(id=>document.getElementById(id)?.open&&!document.getElementById(id)?.classList.contains('gis-panel-minimized'),panel.id,{timeout:5000});
    s=await snapshot(page,cdp,panel,'restored');run.snapshots.push(s);detect(s,run);
    if(!s.close.centerReachable||!s.minimize.centerReachable)await capture(page,run,'restored');
  }
  if(await clickAction(page,run,s,'close',panel.close)){
    await page.waitForFunction(id=>!document.getElementById(id)?.open,panel.id,{timeout:5000});
    run.closedViaVisibleControl=true;
    await openPanel(page,panel,run);const reopened=await snapshot(page,cdp,panel,'reopened');run.snapshots.push(reopened);detect(reopened,run);
    run.reopenedViaUi=true;
  }
}
function innerWidthFallback(config){return config.view.viewport.width;}
async function inspectEscape(page,cdp,run){
  await openPanel(page,panels.convert,run);await openPanel(page,panels.help,run);
  run.beforeEscape={convert:await snapshot(page,cdp,panels.convert,'before_escape'),help:await snapshot(page,cdp,panels.help,'before_escape')};
  await capture(page,run,'before-escape');await page.keyboard.press('Escape');
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  run.afterEscape={convert:await snapshot(page,cdp,panels.convert,'after_escape'),help:await snapshot(page,cdp,panels.help,'after_escape')};
  run.escapeOutcome={convertOpen:run.afterEscape.convert.panel.open,helpOpen:run.afterEscape.help.panel.open,
    beforeFocus:run.beforeEscape.help.focus,afterFocus:run.afterEscape.help.focus};
  if(!run.escapeOutcome.convertOpen&&!run.escapeOutcome.helpOpen)run.observations.push({kind:'one_escape_closed_both_ui_opened_panels',details:run.escapeOutcome});
  await capture(page,run,'after-escape');
}
async function main(){
  assert(process.env.GIS_PANELS_AUDIT==='READONLY_DIAGNOSTIC','audit_execution_not_enabled');
  const bytes=fs.readFileSync(APP);assert(hash(bytes)===SHA,'candidate_hash_mismatch');out.candidateBytes=bytes.length;
  const browser=await chromium.launch({headless:true,...(process.env.GIS_AUDIT_CHROMIUM?{executablePath:process.env.GIS_AUDIT_CHROMIUM}:{}),
    args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps','--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']});
  out.browserVersion=browser.version();
  const wanted=(process.env.AUDIT_CASES||'').split(',').filter(Boolean),selected=wanted.length?matrix.filter(c=>wanted.includes(c.name)):matrix;
  assert(!wanted.length||selected.length===wanted.length,'unknown_audit_case');
  try{for(const config of selected){
    const run={name:config.name,view:config.view,panel:config.panel||null,actions:[],snapshots:[],observations:[],screenshots:[],pageErrors:[],
      network:{candidateDocuments:0,blocked:0,blockedPost:0,blockedProvider:0,websockets:0,byOrigin:{},faviconResponses:[],faviconBlocks:0},console:{}};
    const ctx=await browser.newContext({viewport:config.view.viewport,isMobile:config.view.isMobile,hasTouch:config.view.hasTouch,
      deviceScaleFactor:1,serviceWorkers:'block',permissions:[],acceptDownloads:false,ignoreHTTPSErrors:false});
    await ctx.routeWebSocket('**/*',ws=>{run.network.websockets++;ws.close();});
    await ctx.route('**/*',route=>{
      const q=route.request();if(q.url()===URL&&q.method()==='GET'&&q.isNavigationRequest()){
        run.network.candidateDocuments++;return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:bytes});
      }
      const u=new globalThis.URL(q.url());run.network.blocked++;run.network.byOrigin[u.origin]=(run.network.byOrigin[u.origin]||0)+1;
      if(q.method()==='POST')run.network.blockedPost++;
      if(/^\/(?:_routing\/gh\/|ors\/|v2\/directions\/)|^\/(?:info|nearest|route)$/.test(u.pathname))run.network.blockedProvider++;
      return route.abort('blockedbyclient');
    });
    const page=await ctx.newPage();page.setDefaultTimeout(6000);page.on('pageerror',e=>run.pageErrors.push(e.message));
    page.on('console',m=>{if(m.type()==='error'){const t=m.text();run.console[t]=(run.console[t]||0)+1;}});
    page.on('dialog',async d=>{run.actions.push({label:'unexpected_native_dialog',type:d.type(),message:d.message()});await d.dismiss();});
    const cdp=await ctx.newCDPSession(page),favIds=new Set();await cdp.send('Network.enable');
    await cdp.send('Network.setBlockedURLs',{urls:[ORIGIN+'/favicon.ico']});
    cdp.on('Network.requestWillBeSent',e=>{if(e.request.url===ORIGIN+'/favicon.ico')favIds.add(e.requestId);});
    cdp.on('Network.responseReceived',e=>{if(e.response.url===ORIGIN+'/favicon.ico')run.network.faviconResponses.push(e.response.status);});
    cdp.on('Network.loadingFailed',e=>{if(favIds.has(e.requestId)&&e.blockedReason==='inspector')run.network.faviconBlocks++;});
    try{
      await page.goto(URL,{waitUntil:'domcontentloaded'});
      await page.waitForFunction(()=>typeof APP_BUILD_NUM!=='undefined'&&APP_BUILD_NUM===280&&document.body.classList.contains('gis-mode'));
      if(config.escape)await inspectEscape(page,cdp,run);else await inspectPanel(page,cdp,run,config);
      run.completed=true;
    }catch(e){run.harnessOrUiError=String(e.message||e);try{await capture(page,run,'interrupted');}catch(_){}
    }finally{await ctx.close();out.runs.push(run);fs.writeFileSync(path.join(__dirname,'audit-results.json'),JSON.stringify(out,null,2)+'\n');}
    console.log(JSON.stringify({case:run.name,completed:!!run.completed,error:run.harnessOrUiError,
      observations:run.observations.map(x=>({phase:x.phase,kind:x.kind,control:x.control})),providerAttempts:run.network.blockedProvider,postAttempts:run.network.blockedPost}));
  }}finally{await browser.close();out.finishedAtUtc=new Date().toISOString();out.candidateAfterSha256=hash(fs.readFileSync(APP));
    fs.writeFileSync(path.join(__dirname,'audit-results.json'),JSON.stringify(out,null,2)+'\n');}
}
main().catch(e=>{out.fatal=e.message;fs.writeFileSync(path.join(__dirname,'audit-results.json'),JSON.stringify(out,null,2)+'\n');console.error(e.message);process.exitCode=1;});
