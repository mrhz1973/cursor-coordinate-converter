"use strict";
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {chromium}=require('playwright');
const APP=process.env.GIS_AUDIT_APP,BUILD=Number(process.env.GIS_AUDIT_BUILD);
const SHAS={280:'70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde',281:'e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62'};
const SHA=SHAS[BUILD];
const EDGE='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ORIGIN='https://ionos-n8n-new.tailc01234.ts.net';
const URL=ORIGIN+'/gis?v='+SHA+'&qa=windows-regression-281';
const OUT=path.join(__dirname,BUILD===280?'baseline-280':'candidate-281');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const out={scope:'targeted_window_regression_281_not_general_pass',sourceMode:'candidate_injected',candidateSha256:SHA,build:BUILD,
 environment:{platform:process.platform,architecture:process.arch,nodeVersion:process.version,playwright:require('playwright/package.json').version,engine:'Microsoft Edge (Chromium)',executablePath:EDGE},
 url:URL,startedAtUtc:new Date().toISOString(),realNetworkRequests:0,nonGis:{executed:false,reason:'No supported user entry; no class/state mutation.'},runs:[]};
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
 {name:'desktop-convert-lifecycle',view:desktop,panel:'convert',kind:'lifecycle'},
 {name:'mobile-convert-lifecycle',view:mobile,panel:'convert',kind:'lifecycle'},
 {name:'desktop-escape-convert-help',view:desktop,kind:'escapePair'},
 {name:'desktop-escape-input',view:desktop,kind:'input'},
 {name:'desktop-escape-track-pick',view:desktop,kind:'pick'},
 {name:'desktop-native-child-cancel',view:desktop,kind:'nativeChild'},
 {name:'desktop-astro-reference',view:desktop,panel:'astro',kind:'astro'},
 {name:'mobile-astro-390',view:mobile,panel:'astro',kind:'astro',dragResize:true},
 {name:'short-astro-390',view:short,panel:'astro',kind:'astro',dragResize:true}
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
      focus:{id:document.activeElement?.id,tag:document.activeElement?.tagName,className:document.activeElement?.className,dataRole:document.activeElement?.getAttribute('data-role'),ariaLabel:document.activeElement?.getAttribute('aria-label'),text:document.activeElement?.textContent?.trim().slice(0,80),closestDialog:document.activeElement?.closest('dialog')?.id||null},
      openDialogs:Array.from(document.querySelectorAll('dialog[open]')).map(e=>({id:e.id,minimized:e.classList.contains('gis-panel-minimized')}))};
  },{panel,label});
  v.accessibility=await axPanel(cdp,panel.id);return v;
}
async function capture(page,run,label){
  const name=run.name+'-'+label+'.png';await page.screenshot({path:path.join(OUT,name),fullPage:false});run.screenshots.push(name);
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
async function inputCase(page,cdp,run){
 await openPanel(page,panels.convert,run);
 const input=page.locator('#pasteInput');assert(await input.isVisible(),'paste_input_not_visible');
 await input.fill('44.10270, 9.82360');await input.click();
 const e=await pressEscape(page,run,'input_escape');run.behavior={input:e};
 check(run,'input_fixture_preserved',e.after.inputValue===e.before.inputValue&&e.before.focus.id==='pasteInput',e);
 if(BUILD===281){
  const b=baselineCase(run.name)?.behavior?.input;
  check(run,'input_escape_matches_observed_baseline',!!b&&e.after.convertOpen===b.after.convertOpen&&e.after.focus.id===b.after.focus.id&&e.after.focus.tag===b.after.focus.tag,{baseline:b,current:e});
 }
 await capture(page,run,'after-input-escape');
}
async function pickCase(page,cdp,run){
 await openPanel(page,panels.track,run);
 await page.waitForFunction(()=>!!state.track?.pickMode);
 const e=await pressEscape(page,run,'track_pick_escape');run.behavior={pick:e};
 check(run,'escape_exits_track_pick',e.before.trackOpen&&e.before.trackPick&&!e.after.trackPick,e);
 if(BUILD===281){
  check(run,'handled_pick_escape_keeps_track_panel',e.after.trackOpen&&!e.after.unsavedCloseOpen,e);
  const second=await pressEscape(page,run,'track_panel_escape_after_pick');
  check(run,'second_escape_closes_empty_track_panel',second.before.trackOpen&&!second.after.trackOpen,second);
 }
 await capture(page,run,'after-pick-escape');
}
async function mapPoint(page,run,index){
 const candidate=await page.evaluate(index=>{
  const map=document.getElementById('miniMap');const r=map.getBoundingClientRect();
  const positions=index===0?[[.75,.47],[.85,.55],[.65,.65]]:[[.83,.62],[.74,.72],[.9,.7]];
  for(const [px,py] of positions){const x=r.x+r.width*px,y=r.y+r.height*py,e=document.elementFromPoint(x,y);
   if(e&&map.contains(e)&&!e.closest('dialog,button,input,textarea,select,a,[role="button"]'))return {x,y,element:{tag:e.tagName,id:e.id,className:typeof e.className==='string'?e.className:''}};
  }
  return null;
 },index);
 assert(candidate,'no_unobstructed_map_point');
 const before=await page.evaluate(()=>state.track?.points?.length||0);
 await page.mouse.click(candidate.x,candidate.y);
 await page.waitForFunction(n=>(state.track?.points?.length||0)===n+1,before,{timeout:6000});
 run.actions.push({label:'synthetic_map_point_'+index,kind:'pointer_on_observed_map',...candidate});
}
async function nativeChildCase(page,cdp,run){
 await openPanel(page,panels.track,run);await page.waitForFunction(()=>!!state.track?.pickMode);
 await mapPoint(page,run,0);await mapPoint(page,run,1);
 await page.waitForFunction(()=>!document.getElementById('btnTrackSaveLibrary')?.disabled);
 // Observe the ordinary combined path first; no app helper or state mutation.
 await clickUi(page,['#btnTrackSaveLibrary'],run,'save_opens_native_child_while_pick_active');
 await page.waitForFunction(()=>document.getElementById('trackSaveNameDialog')?.open&&document.activeElement?.id==='trackSaveNameDialogInput');
 let e=await pressEscape(page,run,'child_with_pick_escape');run.behavior={combined:e};
 check(run,'native_child_opened_via_ui',e.before.childOpen&&e.before.childModal&&e.before.trackOpen&&e.before.trackPoints.length===2,e.before);
 check(run,'combined_escape_exits_pick_and_preserves_points',!e.after.trackPick&&JSON.stringify(e.before.trackPoints)===JSON.stringify(e.after.trackPoints),e);
 if(BUILD===281)check(run,'handled_pick_escape_keeps_native_child',e.after.childOpen&&e.after.trackOpen,e);
 if(e.after.childOpen){
  await clickUi(page,['#trackSaveNameDialogCancelBtn'],run,'cancel_combined_child_via_button');
  await page.waitForFunction(()=>!document.getElementById('trackSaveNameDialog')?.open);
 }
 // Reopen with the drawing mode already inactive. This isolates the child cancel.
 const before=await facts(page);assert(before.trackOpen&&!before.trackPick,'isolated_native_child_precondition');
 await clickUi(page,['#btnTrackSaveLibrary'],run,'reopen_native_child_without_pick');
 await page.waitForFunction(()=>document.getElementById('trackSaveNameDialog')?.open&&document.activeElement?.id==='trackSaveNameDialogInput');
 await capture(page,run,'native-child-before-escape');
 e=await pressEscape(page,run,'isolated_child_escape');run.behavior.isolated=e;
 check(run,'isolated_escape_closes_only_native_child',e.before.childModal&&!e.after.childOpen&&e.after.trackOpen&&!e.after.unsavedCloseOpen,e);
 check(run,'native_cancel_does_not_save_or_change_points',e.after.savedTrackCount===e.before.savedTrackCount&&JSON.stringify(e.before.trackPoints)===JSON.stringify(e.after.trackPoints),e);
 if(BUILD===281){const b=baselineCase(run.name)?.behavior?.isolated;
  check(run,'isolated_cancel_matches_observed_baseline',!!b&&e.after.childOpen===b.after.childOpen&&e.after.trackOpen===b.after.trackOpen&&e.after.savedTrackCount===b.after.savedTrackCount,{baseline:b,current:e});
 }
 await capture(page,run,'native-child-after-escape');
}
function baselineCase(name){
 const f=path.join(__dirname,'baseline-280','audit-results.json');if(!fs.existsSync(f))return null;
 return JSON.parse(fs.readFileSync(f,'utf8')).runs.find(r=>r.name===name&&r.completed);
}
function nearRect(a,b,tol=1){return !!a&&!!b&&['x','y','width','height'].every(k=>Math.abs(a[k]-b[k])<=tol);}
function safeGeometry(run,s,label){
 const r=s.panel.rect,v=s.viewport;
 check(run,label+'_within_viewport',r.x>=-1&&r.y>=-1&&r.right<=v.width+1&&r.bottom<=v.height+1,r);
 check(run,label+'_header_controls_reachable',s.close.centerReachable&&s.minimize.centerReachable,{close:s.close,minimize:s.minimize});
 check(run,label+'_below_topbar',r.y>=s.topbar.rect.bottom-1,{panel:r,topbar:s.topbar.rect});
}
async function dragHeader(page,run,dy,label){
 const p=await page.locator('#astroPanelHead').evaluate(el=>{
  const r=el.getBoundingClientRect();for(const x of [r.x+Math.min(90,r.width/3),r.x+30,r.x+r.width/2]){
   const y=r.y+r.height/2,e=document.elementFromPoint(x,y);
   if(e&&el.contains(e)&&!e.closest('button,input,a,select'))return{x,y};}
  return null;
 });assert(p,'astro_header_drag_point_not_reachable');
 await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(p.x,Math.max(0,p.y+dy),{steps:8});await page.mouse.up();
 run.actions.push({label,kind:'pointer_drag_on_header',from:p,to:{x:p.x,y:Math.max(0,p.y+dy)}});await stable(page,'astroPanel');
}
async function astroCase(page,cdp,run,config){
 await openPanel(page,panels.astro,run);let s=await snapshot(page,cdp,panels.astro,'opened');run.snapshots.push(s);
 safeGeometry(run,s,'opened');await capture(page,run,'opened');
 if(BUILD===281&&config.name==='desktop-astro-reference'){
  const b=baselineCase(run.name)?.snapshots.find(x=>x.label==='opened');
  check(run,'desktop_initial_geometry_matches_baseline',nearRect(s.panel.rect,b?.panel?.rect),{baseline:b?.panel?.rect,current:s.panel.rect});
 }
 if(config.dragResize){
  const before=s;await dragHeader(page,run,48,'drag_down_48');s=await snapshot(page,cdp,panels.astro,'after_drag_down');run.snapshots.push(s);
  check(run,'drag_has_observable_vertical_movement',s.panel.rect.y-before.panel.rect.y>=20,{before:before.panel.rect,after:s.panel.rect});safeGeometry(run,s,'drag_down');
  await dragHeader(page,run,-1000,'drag_towards_viewport_top');s=await snapshot(page,cdp,panels.astro,'after_clamp');run.snapshots.push(s);safeGeometry(run,s,'clamped');
  const handle=page.locator('#astroPanel .gis-panel-resize-handle.h-se');assert(await handle.isVisible(),'astro_resize_handle_not_visible');
  const r=await handle.boundingBox();assert(r,'astro_resize_handle_missing_rect');const x=r.x+r.width/2,y=r.y+r.height/2;
  const hit=await page.evaluate(({x,y})=>{const h=document.querySelector('#astroPanel .gis-panel-resize-handle.h-se'),e=document.elementFromPoint(x,y);return !!e&&(h===e||h.contains(e));},{x,y});assert(hit,'astro_resize_handle_not_reachable');
  const dy=Math.min(40,config.view.viewport.height-12-s.panel.rect.bottom);assert(dy>=20,'astro_insufficient_vertical_resize_room');
  const beforeResize=s.panel.rect;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+dy,{steps:8});await page.mouse.up();await stable(page,'astroPanel');
  s=await snapshot(page,cdp,panels.astro,'after_resize');run.snapshots.push(s);safeGeometry(run,s,'resized');
  run.actions.push({label:'resize_se_vertical',kind:'pointer_drag_on_resize_handle',from:{x,y},to:{x,y:y+dy}});
  check(run,'resize_has_observable_vertical_effect',s.panel.rect.height-beforeResize.height>=15,{before:beforeResize,after:s.panel.rect,requestedDy:dy});
  await capture(page,run,'after-drag-resize');
 }
 const saved=s.panel.rect;
 assert(await clickAction(page,run,s,'minimize',panels.astro.minimize),'astro_minimize_not_reachable');
 await page.waitForFunction(()=>document.getElementById('astroPanel')?.classList.contains('gis-panel-minimized'));
 await clickUi(page,['#gisMinimizedDock [data-gis-min-panel="astroPanel"]'],run,'restore_astro');await stable(page,'astroPanel');
 s=await snapshot(page,cdp,panels.astro,'restored');run.snapshots.push(s);safeGeometry(run,s,'restored');check(run,'restore_preserves_geometry',nearRect(saved,s.panel.rect),{saved,restored:s.panel.rect});
 assert(await clickAction(page,run,s,'close',panels.astro.close),'astro_close_not_reachable');await page.waitForFunction(()=>!document.getElementById('astroPanel')?.open);
 await openPanel(page,panels.astro,run);s=await snapshot(page,cdp,panels.astro,'reopened');run.snapshots.push(s);safeGeometry(run,s,'reopened');
 check(run,'reopen_preserves_geometry',nearRect(saved,s.panel.rect),{saved,reopened:s.panel.rect});await capture(page,run,'reopened');
}
async function lifecycleCase(page,cdp,run,config){
 await inspectPanel(page,cdp,run,config);
 for(const s of run.snapshots){
  check(run,s.label+'_computed_dialog_name_matches_title',s.accessibility.role==='dialog'&&!s.accessibility.ignored&&s.accessibility.name===s.title.text&&!!s.title.text,{ax:s.accessibility,title:s.title,ariaLabelledby:s.panel.ariaLabelledby});
  safeGeometry(run,s,s.label);
 }
 check(run,'minimize_restore_close_reopen_completed',!!run.minimized&&!!run.closedViaVisibleControl&&!!run.reopenedViaUi,{minimized:!!run.minimized,closed:run.closedViaVisibleControl,reopened:run.reopenedViaUi});
 const e=await pressEscape(page,run,'single_convert_escape');check(run,'single_convert_closes_on_escape',e.before.convertOpen&&!e.after.convertOpen,e);
}
async function main(){
 assert(process.env.GIS_PANELS_AUDIT==='READONLY_DIAGNOSTIC','audit_execution_not_enabled');assert(SHA&&APP&&fs.existsSync(APP),'pinned_runtime_required');
 assert(!fs.existsSync(path.join(OUT,'audit-results.json')),'existing_results_no_duplicate_execution');fs.mkdirSync(OUT,{recursive:true});
 const bytes=fs.readFileSync(APP);assert(hash(bytes)===SHA,'candidate_hash_mismatch');out.candidateBytes=bytes.length;
 const wanted=(process.env.AUDIT_CASES||'').split(',').filter(Boolean),selected=wanted.length?matrix.filter(c=>wanted.includes(c.name)):matrix;
 assert(!wanted.length||selected.length===wanted.length,'unknown_audit_case');
 const browser=await chromium.launch({headless:true,executablePath:EDGE,args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps','--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']});out.browserVersion=browser.version();
 try{for(const config of selected){
  const run={name:config.name,view:config.view,panel:config.panel||null,actions:[],snapshots:[],observations:[],checks:[],escapeSteps:[],screenshots:[],pageErrors:[],console:{},network:{candidateDocuments:0,blocked:0,blockedPost:0,blockedProvider:0,websockets:0,byOrigin:{},faviconResponses:[],faviconBlocks:0}};
  const ctx=await browser.newContext({viewport:config.view.viewport,isMobile:config.view.isMobile,hasTouch:config.view.hasTouch,deviceScaleFactor:1,serviceWorkers:'block',permissions:[],acceptDownloads:false,ignoreHTTPSErrors:false});
  await ctx.routeWebSocket('**/*',ws=>{run.network.websockets++;ws.close();});
  await ctx.route('**/*',route=>{const q=route.request();if(q.url()===URL&&q.method()==='GET'&&q.isNavigationRequest()){run.network.candidateDocuments++;return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:bytes});}
   const u=new globalThis.URL(q.url());run.network.blocked++;run.network.byOrigin[u.origin]=(run.network.byOrigin[u.origin]||0)+1;if(q.method()==='POST')run.network.blockedPost++;if(/^\/(?:_routing\/gh\/|ors\/|v2\/directions\/)|^\/(?:info|nearest|route)$/.test(u.pathname))run.network.blockedProvider++;return route.abort('blockedbyclient');});
  const page=await ctx.newPage();page.setDefaultTimeout(6000);page.on('pageerror',e=>run.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error'){const t=m.text();run.console[t]=(run.console[t]||0)+1;}});page.on('dialog',async d=>{run.actions.push({label:'unexpected_browser_dialog',type:d.type(),message:d.message()});await d.dismiss();});
  const cdp=await ctx.newCDPSession(page),favIds=new Set();await cdp.send('Network.enable');await cdp.send('Network.setBlockedURLs',{urls:[ORIGIN+'/favicon.ico']});
  cdp.on('Network.requestWillBeSent',e=>{if(e.request.url===ORIGIN+'/favicon.ico')favIds.add(e.requestId);});cdp.on('Network.responseReceived',e=>{if(e.response.url===ORIGIN+'/favicon.ico')run.network.faviconResponses.push(e.response.status);});cdp.on('Network.loadingFailed',e=>{if(favIds.has(e.requestId)&&e.blockedReason==='inspector')run.network.faviconBlocks++;});
  try{
   await page.goto(URL,{waitUntil:'domcontentloaded'});await page.waitForFunction(build=>typeof APP_BUILD_NUM!=='undefined'&&APP_BUILD_NUM===build&&document.body.classList.contains('gis-mode'),BUILD);
   await page.evaluate(()=>{window.__qaWindowEvents=[];document.addEventListener('cancel',e=>window.__qaWindowEvents.push({type:'native_dialog_cancel',id:e.target.id,defaultPrevented:e.defaultPrevented}),true);document.addEventListener('keydown',e=>{if(e.key==='Escape')window.__qaWindowEvents.push({type:'escape_after_application_listeners',targetId:e.target.id,defaultPrevented:e.defaultPrevented});});});
   if(config.kind==='lifecycle')await lifecycleCase(page,cdp,run,config);
   else if(config.kind==='escapePair')await pairCase(page,cdp,run);
   else if(config.kind==='input')await inputCase(page,cdp,run);
   else if(config.kind==='pick')await pickCase(page,cdp,run);
   else if(config.kind==='nativeChild')await nativeChildCase(page,cdp,run);
   else if(config.kind==='astro')await astroCase(page,cdp,run,config);
   run.eventObservations=await page.evaluate(()=>window.__qaWindowEvents);run.completed=true;
  }catch(e){run.harnessOrUiError=String(e.message||e);try{await capture(page,run,'interrupted');run.finalFacts=await facts(page);}catch(_){}
  }finally{
   check(run,'no_javascript_page_errors',run.pageErrors.length===0,run.pageErrors);check(run,'zero_provider_and_post_attempts',run.network.blockedProvider===0&&run.network.blockedPost===0,run.network);
   run.targetedPass=!!run.completed&&run.checks.every(c=>c.pass);await ctx.close();out.runs.push(run);fs.writeFileSync(path.join(OUT,'audit-results.json'),JSON.stringify(out,null,2)+'\n');
  }
  console.log(JSON.stringify({case:run.name,completed:!!run.completed,targetedPass:run.targetedPass,error:run.harnessOrUiError,failedChecks:run.checks.filter(c=>!c.pass).map(c=>c.name),pageErrors:run.pageErrors,providerAttempts:run.network.blockedProvider,postAttempts:run.network.blockedPost,behavior:run.behavior}));
 }}finally{await browser.close();out.finishedAtUtc=new Date().toISOString();out.candidateAfterSha256=hash(fs.readFileSync(APP));out.targetedPass=out.runs.length===selected.length&&out.runs.every(r=>r.targetedPass);fs.writeFileSync(path.join(OUT,'audit-results.json'),JSON.stringify(out,null,2)+'\n');}
}
main().catch(e=>{out.fatal=e.message;fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'audit-results.json'),JSON.stringify(out,null,2)+'\n');console.error(e.message);process.exitCode=1;});
