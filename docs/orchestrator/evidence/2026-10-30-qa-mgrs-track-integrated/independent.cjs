// Isolated local browser profile, no remote network; exercises the real app DOM.
const {spawn}=require('child_process');const fs=require('fs');const path=require('path');const {pathToFileURL}=require('url');
const edge='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profile=path.join(__dirname,`edge-test-profile-${process.pid}-${Date.now()}`);
const portfile=path.join(profile,'DevToolsActivePort');
if(fs.existsSync(portfile))throw Error('Profile already used; choose a fresh profile directory');
const proc=spawn(edge,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const browserEvents=[];const requestUrls=new Map();
async function run(){
  for(let n=0;n<600&&!fs.existsSync(portfile);n++)await sleep(100);
  if(!fs.existsSync(portfile))throw Error('Browser startup timeout');
  const port=Number(fs.readFileSync(portfile,'utf8').split(/\r?\n/)[0]);
  const pages=await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const ws=new WebSocket(pages.find(x=>x.type==='page').webSocketDebuggerUrl);
  await new Promise((ok,fail)=>{ws.onopen=ok;ws.onerror=fail});let id=0;const pending=new Map();
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.method==='Network.requestWillBeSent')requestUrls.set(m.params.requestId,m.params.request.url);if(m.method==='Network.loadingFailed')browserEvents.push({method:m.method,url:requestUrls.get(m.params.requestId),error:m.params.errorText,blockedReason:m.params.blockedReason});if(m.method==='Runtime.exceptionThrown'||m.method==='Log.entryAdded'||(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error'))browserEvents.push({method:m.method,params:m.params});if(m.id&&pending.has(m.id)){const [ok,fail]=pending.get(m.id);pending.delete(m.id);m.error?fail(Error(JSON.stringify(m.error))):ok(m.result)}};
  const call=(method,params={})=>new Promise((ok,fail)=>{const n=++id;pending.set(n,[ok,fail]);ws.send(JSON.stringify({id:n,method,params}));});
  await call('Runtime.enable');await call('Log.enable');await call('Network.enable');await call('Network.setBlockedURLs',{urls:['http://*','https://*']});await call('Page.enable');
  await call('Page.navigate',{url:pathToFileURL('C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html').href});
  let ready=false;
  for(let n=0;n<600;n++){await sleep(100);let r=await call('Runtime.evaluate',{expression:'document.readyState === "complete" && typeof doConvert === "function" && !!document.getElementById("results")',returnByValue:true});if(r.result.value){ready=true;break}}
  if(!ready)throw Error('Application startup timeout');
  const expression=`(async()=>{
    const check=(c,m)=>{if(!c)throw Error(m)};const $=id=>document.getElementById(id);
    state.geocodeReverseAuto=false;state.persist=true;state.mapWaypoints=[];state.favorites=[];
    let copied='';copyText=s=>{copied=s};let feedback='';setBadge=(k,s)=>{feedback=s};
    const raw=' 01NAA6602100000 ';document.querySelector('.tab[data-tab="mgrs"]').click();$('mgrs-input').value=raw;doConvert();
    const src=state.lastResult.mgrsSource;check(src&&src.raw===raw,'input source');
    openWaypointModal();closeWaypointEditor();$('wpFromConvertedBtn').click();
    let wp=state.mapWaypoints[state.mapWaypoints.length-1];check(wp&&wp.mgrsSource&&wp.mgrsSource.raw===raw,'result to waypoint');
    const start={lat:wp.lat,lon:wp.lon,id:wp.id};const row=$('wp-list').querySelector('[data-wp-row]');
    check(row.textContent.includes('geodetica non verificata')||row.textContent.includes('geodetic validity not verified'),'source validity label');
    row.querySelector('[data-wp-mgrs-copy]').click();check(copied===raw,'literal waypoint copy');
    const modes=['default','dd','ddm','dms','utm','mgrs'], selector=$('waypointListCoordFormat');
    const setMode=m=>{selector.value=m;selector.dispatchEvent(new Event('change',{bubbles:true}))};
    for(const a of modes) for(const b of modes){
      state._waypointListCoordFormat=a;openWaypointEditor({id:wp.id});setMode(b);$('wpFieldName').value='name '+a+' '+b;commitWaypointEditor();
      check(!state.waypointEditorDraft&&wp.lat===start.lat&&wp.lon===start.lon&&wp.mgrsSource&&wp.mgrsSource.raw===raw,'format transition '+a+' '+b);
    }
    openWaypointEditor({id:wp.id});$('wpFieldCoord').value='0, 9';$('wpFieldCoord').dispatchEvent(new Event('input',{bubbles:true}));commitWaypointEditor();
    check(!wp.mgrsSource,'explicit geographic input revokes source');
    waypointUpdate(wp.id,{lat:start.lat,lon:start.lon,mgrsSource:src});check(wp.mgrsSource,'explicit source replacement');
    waypointUpdate(wp.id,{lat:start.lat,lon:start.lon});check(!wp.mgrsSource,'coordinate replacement without source revokes even equal');
    waypointUpdate(wp.id,{lat:start.lat,lon:start.lon,mgrsSource:src});waypointUpdateLatLon(wp.id,start.lat,start.lon);check(!wp.mgrsSource,'move same numeric point revokes');
    waypointUpdate(wp.id,{lat:start.lat,lon:start.lon,mgrsSource:src});
    openWaypointEditor({id:wp.id});$('wpFieldCoord').value='31UDQ1234';$('wpFieldCoord').dispatchEvent(new Event('input',{bubbles:true}));
    wp.mgrsSource={...wp.mgrsSource,raw:wp.mgrsSource.raw+' '};commitWaypointEditor();check(state.waypointEditorDraft,'concurrent source change conflicts');closeWaypointEditor();
    waypointUpdate(wp.id,{lat:start.lat,lon:start.lon,mgrsSource:src});
    state.favorites=[];favoriteAddFromWaypointRowId(wp.id);const fav=state.favorites[0];check(fav&&mgrsSourceFromFavorite(fav).raw===raw,'waypoint to favorite');
    state.mapWaypoints=[];favoriteAddAsWaypoint(fav.id);wp=state.mapWaypoints[0];check(wp&&wp.mgrsSource&&wp.mgrsSource.raw===raw,'favorite to waypoint');
    state.mapWaypoints=[];openWaypointFromFavoritesDialog();const cb=$('waypointFavPickerList').querySelector('.wp-fav-pick-cb');check(cb,'bulk picker');cb.checked=true;cb.dispatchEvent(new Event('change',{bubbles:true}));$('waypointFavPickerAddBtn').click();wp=state.mapWaypoints[0];check(wp&&wp.mgrsSource.raw===raw,'favorite picker to waypoint');
    state.favorites=[];waypointModalSelectedRowIds.add(wp.id);waypointModalAddSelectedRowsToFavorites();check(state.favorites[0]&&mgrsSourceFromFavorite(state.favorites[0]).raw===raw,'bulk waypoint to favorite');
    const previousFavorites=state.favorites.slice();state.favorites=Array.from({length:200},(_,i)=>({id:'f-'+i,name:'f-'+i,lat:20+i/1000,lon:10,meta:null}));
    const favBefore=JSON.stringify(state.favorites), savedSet=Storage.prototype.setItem;waypointModalSelectedRowIds.add(wp.id);
    Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};waypointModalAddSelectedRowsToFavorites();
    check(JSON.stringify(state.favorites)===favBefore&&$('wpListFavFeedback').textContent.includes('Salvataggio non riuscito'),'bulk favorite quota rollback');
    Storage.prototype.setItem=savedSet;state.favorites=previousFavorites;check(saveStore()===true,'restore favorite fixtures');
    state.mapWaypoints=[];state._waypointListCoordFormat='mgrs';openWaypointEditor({});$('wpFieldCoord').value='01NAA6602100000';$('wpFieldCoord').dispatchEvent(new Event('input',{bubbles:true}));$('wpFieldName').value='editor new';handleWaypointEditorCoordEnter();
    check($('wpFieldCoordFeedbackText').textContent.includes('punto rappresentativo')&&$('wpFieldCoordFeedbackText').textContent.includes('60'),'editor preview labels natural-zone representative point');
    check($('wpFieldCoord').value==='01NAA6602100000','editor preview preserves input');commitWaypointEditor();
    wp=state.mapWaypoints[0];check(wp&&wp.mgrsSource&&wp.mgrsSource.raw==='01NAA6602100000','new editor MGRS source');
    const forged={...wp.mgrsSource,raw:'32T NQ 75167 01394'};check(!captureResultMgrsSource(wp.lat,wp.lon,forged),'corrupted source rejected');
    const refs=['31UDQ','31UDQ12','31UDQ1234','31UDQ123456','31UDQ12341234','31UDQ1234512345'];
    for(let precision=0;precision<refs.length;precision++){
      const parsed=parseWaypointEditorCoordText(refs[precision]);check(parsed.ok&&parsed.mgrsSource&&parsed.mgrsSource.precision===precision,'waypoint precision '+precision);
      check(waypointAdd(parsed.lat,parsed.lon,'precision '+precision,{}, {allowNearDuplicate:true,mgrsSource:parsed.mgrsSource}),'waypoint precision add');
      check(state.mapWaypoints[state.mapWaypoints.length-1].mgrsSource.precision===precision,'waypoint precision stored');
    }
    const cellRaw='01XDP',cell=mgrsToLatLonExt(cellRaw),cellSource=mgrsSourceFromInput(cellRaw);
    check(waypointAdd(cell.lat,cell.lon,'outside cell',{}, {allowNearDuplicate:true,mgrsSource:cellSource}),'outside-zone waypoint add');
    const outside=state.mapWaypoints[state.mapWaypoints.length-1];state._waypointListCoordFormat='mgrs';openWaypointEditor({id:outside.id});$('wpFieldName').value='outside renamed';commitWaypointEditor();
    check(!state.waypointEditorDraft&&outside.mgrsSource&&outside.mgrsSource.raw===cellRaw,'out-of-range representative retains original');
    check(buildWaypointTooltipText(outside).includes(cellRaw)&&buildWaypointTooltipText(outside).includes('Fuori range'),'out-of-range tooltip retains source');
    const outsideTrack={id:'outside-track',lat:cell.lat,lon:cell.lon,name:'',mgrsSource:cellSource};const priorTrack=state.track.points;state.track.points=[outsideTrack];state._trackPointsListMode=null;state._trackPointCoordFormat='mgrs';renderTrackPointsList();
    check($('track-points-head').textContent.includes(cellRaw)&&$('track-points-head').textContent.includes('punto rappresentativo'),'out-of-range collapsed track keeps source');state.track.points=priorTrack;
    const ctrlRaw='01NAA6602100000'+String.fromCharCode(1)+'<&"';const ctrlSource=mgrsSourceFromInput(ctrlRaw),ctrl=mgrsToLatLonExt(ctrlRaw);
    check(waypointAdd(ctrl.lat,ctrl.lon,'control literal',{}, {allowNearDuplicate:true,mgrsSource:ctrlSource}),'control waypoint add');renderWpModalList();
    const ctrlWp=state.mapWaypoints[state.mapWaypoints.length-1],ctrlBtn=[...$('wp-list').querySelectorAll('[data-wp-mgrs-copy]')].find(b=>b.getAttribute('data-wp-mgrs-copy')===ctrlWp.id);ctrlBtn.click();check(copied===ctrlRaw,'control literal waypoint copy');

    state.mapWaypoints=[];check(waypointAdd(start.lat,start.lon,'independent identical',{}, {allowNearDuplicate:true}),'independent waypoint add');
    check(!state.mapWaypoints[0].mgrsSource,'independent waypoint with identical coordinates has no source');
    state.track.points=[];check(trackAddPoint(start.lat,start.lon,'independent identical',{},null),'independent track point add');
    check(!state.track.points[0].mgrsSource,'independent track point with identical coordinates has no source');
    state.track.points=[];state.savedTracks=[];state._trackCompleted=false;state._trackPointsListMode='expanded';state._trackPointCoordFormat='mgrs';
    renderMiniMap(start.lat,start.lon,true,{lat:start.lat,lon:start.lon,mgrsSource:src});trackAddCurrent();
    check(state.track.points.length===1&&state.track.points[0].mgrsSource.raw===raw,'current to track retains source');
    state._trackPointsListMode=null;state._trackPointCoordFormat='mgrs';renderTrackPointsList();
    check($('track-points-head').textContent.includes('01NAA6602100000')&&$('track-points-head').textContent.includes('punto rappresentativo'),'single point collapsed summary');
    const textLine=' 31UDQ1234 ';const textResult=trackAddFromText(textLine);check(textResult.ok===1&&!textResult.mgrsNotTransferred&&state.track.points[1].mgrsSource.raw===textLine,'text track retains literal source');
    const tp=state.track.points[0];
    state._trackPointsListMode=null;state._trackPointCoordFormat='mgrs';openTrackModal();renderTrackPointsList();
    const summary=$('track-points-head');check($('track-points').classList.contains('is-collapsed'),'default track list collapsed');
    check(summary.textContent.includes('punto rappresentativo')&&summary.textContent.includes('60N')&&summary.textContent.includes('01NAA6602100000'),'collapsed summary separates point and original');
    const summaryCopy=summary.querySelector('[data-track-summary-copy="'+tp.id+'"]');check(summaryCopy,'summary source copy present');summaryCopy.click();check(copied===raw,'summary literal copy');
    const originalText=tp.mgrsSource.raw;tp.mgrsSource.raw=originalText+'!'.repeat(180);renderTrackPointsList();
    const wrap=$('track-points-head').querySelector('.tps-mgrs-original'),copyTouch=$('track-points-head').querySelector('[data-track-summary-copy="'+tp.id+'"]');
    check(wrap&&getComputedStyle(wrap).overflowWrap==='anywhere'&&wrap.scrollWidth<=wrap.clientWidth+1&&copyTouch.getBoundingClientRect().height>=44,'summary wraps long text and has touch-sized copy');
    tp.mgrsSource.raw=originalText;applyLanguage('en');renderTrackPointsList();check($('track-points-head').textContent.includes('representative point')&&$('track-points-head').textContent.includes('geodetic validity not verified'),'summary localized');applyLanguage('it');
    state._trackPointsListMode='expanded';renderTrackPointsList();
    const trackRow=$('track-points').querySelector('[data-track-mgrs-copy]');check(trackRow,'track original rendered');trackRow.click();check(copied===raw,'track literal copy');
    check(trackRow.closest('.track-point-row').textContent.includes('geodetica non verificata')||trackRow.closest('.track-point-row').textContent.includes('geodetic validity not verified'),'track original validity label');
    // Independent point-centred threshold and failure/retry checks.
    renderMiniMap(start.lat,start.lon,true,{lat:start.lat,lon:start.lon,mgrsSource:src});renderTrackAll();
    const underBefore=JSON.stringify(tp);let underWrites=0;const underSet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(){underWrites++;throw new DOMException('full','QuotaExceededError')};
    for(const [pid,typ,dx,dy,emit] of [[200,'mouse',0,0,false],[201,'mouse',0,0,true],[202,'touch',0,0,true],[203,'mouse',1,1,true],[204,'touch',3,0,true]]){
      const h=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');check(h,'independent handle '+pid);const r=h.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
      h.dispatchEvent(new PointerEvent('pointerdown',{pointerId:pid,pointerType:typ,clientX:x,clientY:y,bubbles:true,cancelable:true}));
      if(emit)document.dispatchEvent(new PointerEvent('pointermove',{pointerId:pid,pointerType:typ,clientX:x+dx,clientY:y+dy,bubbles:true,cancelable:true}));
      document.dispatchEvent(new PointerEvent('pointerup',{pointerId:pid,pointerType:typ,clientX:x+dx,clientY:y+dy,bubbles:true,cancelable:true}));
      check(JSON.stringify(tp)===underBefore,'independent threshold mutated '+pid);check(underWrites===0,'independent click wrote '+pid);check(!$('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'independent false warning '+pid);
    }
    let h=document.querySelector('.trk-handle[data-id="'+tp.id+'"]'),r=h.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
    h.dispatchEvent(new PointerEvent('pointerdown',{pointerId:205,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:205,pointerType:'touch',clientX:x+4,clientY:y,bubbles:true,cancelable:true}));check(!tp.mgrsSource,'independent touch 4px should move');document.dispatchEvent(new PointerEvent('pointerup',{pointerId:205,pointerType:'touch',clientX:x+4,clientY:y,bubbles:true,cancelable:true}));
    check(underWrites===1&&JSON.stringify(tp)===underBefore&&$('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'independent quota rollback and warning');
    h=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');r=h.getBoundingClientRect();x=r.x+r.width/2;y=r.y+r.height/2;h.dispatchEvent(new PointerEvent('pointerdown',{pointerId:206,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:206,pointerType:'touch',clientX:x+3,clientY:y,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:206,pointerType:'touch',clientX:x+3,clientY:y,bubbles:true,cancelable:true}));check(underWrites===1&&JSON.stringify(tp)===underBefore&&$('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'independent jitter should retain error');
    Storage.prototype.setItem=underSet;h=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');r=h.getBoundingClientRect();x=r.x+r.width/2;y=r.y+r.height/2;h.dispatchEvent(new PointerEvent('pointerdown',{pointerId:207,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:207,pointerType:'touch',clientX:x+4,clientY:y,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:207,pointerType:'touch',clientX:x+4,clientY:y,bubbles:true,cancelable:true}));check(!tp.mgrsSource&&!$('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'independent touch retry');
    for(const key of Object.keys(tp))delete tp[key];Object.assign(tp,JSON.parse(underBefore));check(saveStore()===true,'restore independent fixture');
    // Real map pointer drag: a quota failure restores the moved point and source.
    renderMiniMap(start.lat,start.lon,true,{lat:start.lat,lon:start.lon,mgrsSource:src});renderTrackAll();
    let hit=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');check(hit,'track drag handle');
    let clickWrites=0,clickSet=Storage.prototype.setItem;const clickBefore=JSON.stringify(tp);
    Storage.prototype.setItem=function(){clickWrites++;throw new DOMException('quota','QuotaExceededError')};
    hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:40,clientX:160,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:40,clientX:160,clientY:160,bubbles:true,cancelable:true}));
    // Mouse and touch jitter through the same marker, including exactly 3 px.
    for(const [pid,typ,dx,dy] of [[42,'mouse',0,0],[43,'mouse',2,2],[44,'touch',3,0]]){
      hit=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');
      hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:pid,pointerType:typ,clientX:160,clientY:160,bubbles:true,cancelable:true}));
      document.dispatchEvent(new PointerEvent('pointermove',{pointerId:pid,pointerType:typ,clientX:160+dx,clientY:160+dy,bubbles:true,cancelable:true}));
      document.dispatchEvent(new PointerEvent('pointerup',{pointerId:pid,pointerType:typ,clientX:160+dx,clientY:160+dy,bubbles:true,cancelable:true}));
    }
    Storage.prototype.setItem=clickSet;check(clickWrites===0&&JSON.stringify(tp)===clickBefore&&!$('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'track click under quota creates no false error or write');
    hit=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');
    let prior=JSON.stringify(tp),dragSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
    hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:41,pointerType:'touch',clientX:160,clientY:160,bubbles:true,cancelable:true}));
    document.dispatchEvent(new PointerEvent('pointermove',{pointerId:41,pointerType:'touch',clientX:200,clientY:180,bubbles:true,cancelable:true}));check(!tp.mgrsSource,'track drag invalidates source');
    document.dispatchEvent(new PointerEvent('pointerup',{pointerId:41,pointerType:'touch',clientX:200,clientY:180,bubbles:true,cancelable:true}));check(JSON.stringify(tp)===prior,'track drag quota restores point and source');Storage.prototype.setItem=dragSet;
    let mapAlert=$('miniMap').querySelector('[data-mgrs-map-drag-warning]'),panelAlert=$('trackModal').querySelector('[data-mgrs-panel-warning]');
    check(mapAlert&&mapAlert.getBoundingClientRect().height>0&&panelAlert&&panelAlert._mgrsDragPoint===tp,'track drag error visible on map and open panel');
    applyLanguage('en');mapAlert=$('miniMap').querySelector('[data-mgrs-map-drag-warning]');check(mapAlert&&mapAlert.textContent.includes('Save failed'),'map drag error survives redraw and language');applyLanguage('it');
    hit=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:43,clientX:160,clientY:160,bubbles:true,cancelable:true}));
    document.dispatchEvent(new PointerEvent('pointermove',{pointerId:43,clientX:200,clientY:180,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:43,clientX:200,clientY:180,bubbles:true,cancelable:true}));
    check(!tp.mgrsSource&&!$('miniMap').querySelector('[data-mgrs-map-drag-warning]')&&!$('trackModal').querySelector('[data-mgrs-panel-warning]'),'successful track retry clears its error');for(const key of Object.keys(tp))delete tp[key];Object.assign(tp,JSON.parse(prior));check(saveStore()===true,'reset test track source');
    openWaypointModal();await new Promise(r=>setTimeout(r,120));
    state.mapWaypoints=[];check(waypointAdd(start.lat,start.lon,'drag-source',{}, {mgrsSource:src}),'drag waypoint created');const dragWp=state.mapWaypoints[0];
    renderMiniMap(start.lat,start.lon,true,{lat:start.lat,lon:start.lon,mgrsSource:src});renderMapWaypointsAll();hit=document.querySelector('.wpt-handle[data-id="'+dragWp.id+'"]');check(hit,'waypoint drag handle');
    const tooltip=hit.querySelector('title').textContent;check(tooltip.includes('punto rappresentativo')&&tooltip.includes('60N')&&tooltip.includes('01NAA6602100000')&&tooltip.includes('validità geodetica non verificata'),'actual SVG waypoint tooltip distinguishes source and point');
    prior=JSON.stringify(dragWp);dragSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
    hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:42,clientX:160,clientY:160,bubbles:true,cancelable:true}));
    document.dispatchEvent(new PointerEvent('pointermove',{pointerId:42,clientX:200,clientY:180,bubbles:true,cancelable:true}));check(!dragWp.mgrsSource,'waypoint drag invalidates source');
    document.dispatchEvent(new PointerEvent('pointerup',{pointerId:42,clientX:200,clientY:180,bubbles:true,cancelable:true}));check(JSON.stringify(dragWp)===prior,'waypoint drag quota restores point and source');Storage.prototype.setItem=dragSet;
    mapAlert=$('miniMap').querySelector('[data-mgrs-map-drag-warning]');panelAlert=$('waypointModal').querySelector('[data-mgrs-panel-warning]');
    check(mapAlert&&mapAlert.getBoundingClientRect().height>0&&panelAlert&&panelAlert._mgrsDragPoint===dragWp,'waypoint drag error visible on map and open panel');
    hit=document.querySelector('.wpt-handle[data-id="'+dragWp.id+'"]');hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:44,clientX:160,clientY:160,bubbles:true,cancelable:true}));
    document.dispatchEvent(new PointerEvent('pointermove',{pointerId:44,clientX:200,clientY:180,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:44,clientX:200,clientY:180,bubbles:true,cancelable:true}));
    check(!dragWp.mgrsSource&&!$('miniMap').querySelector('[data-mgrs-map-drag-warning]')&&!$('waypointModal').querySelector('[data-mgrs-panel-warning]'),'successful waypoint retry clears its error');
    // Both panels closed: failures remain visible on the map across redraws,
    // an unrelated successful drag does not clear the original point's error.
    closeWaypointModal();closeTrackModal({force:true});check(!$('waypointModal').open&&!$('trackModal').open,'panels closed');
    state.mapWaypoints=[];check(waypointAdd(start.lat,start.lon,'closed-panel-origin',{}, {mgrsSource:src}),'closed panel source created');
    const closedWp=state.mapWaypoints[0];renderMiniMap(start.lat,start.lon,true,{lat:start.lat,lon:start.lon,mgrsSource:src});renderMapWaypointsAll();
    const closedOriginal=JSON.stringify(closedWp),trackOriginal=JSON.stringify(tp);hit=document.querySelector('.wpt-handle[data-id="'+closedWp.id+'"]');
    dragSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
    hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:51,clientX:160,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:51,clientX:200,clientY:180,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:51,clientX:200,clientY:180,bubbles:true,cancelable:true}));Storage.prototype.setItem=dragSet;
    mapAlert=$('miniMap').querySelector('[data-mgrs-map-drag-warning]');check(JSON.stringify(closedWp)===closedOriginal&&mapAlert&&mapAlert.getBoundingClientRect().height>0&&!$('waypointModal').open,'closed waypoint rollback has visible map error');
    renderMiniMap(start.lat,start.lon,false,state.lastPoint);check($('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'map notice survives redraw');
    hit=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');check(hit,'unrelated track handle');hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:52,clientX:160,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:52,clientX:205,clientY:180,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:52,clientX:205,clientY:180,bubbles:true,cancelable:true}));
    check($('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'unrelated successful drag cannot clear waypoint error');
    for(const key of Object.keys(tp))delete tp[key];Object.assign(tp,JSON.parse(trackOriginal));check(saveStore()===true,'reset unrelated track');
    renderMiniMap(start.lat,start.lon,false,state.lastPoint);hit=document.querySelector('.wpt-handle[data-id="'+closedWp.id+'"]');
    hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:53,clientX:160,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:53,clientX:160,clientY:160,bubbles:true,cancelable:true}));check($('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'click without movement cannot clear error');
    hit=document.querySelector('.wpt-handle[data-id="'+closedWp.id+'"]');hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:54,clientX:160,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:54,clientX:200,clientY:180,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:54,clientX:200,clientY:180,bubbles:true,cancelable:true}));
    check(!$('miniMap').querySelector('[data-mgrs-map-drag-warning]')&&!closedWp.mgrsSource,'successful matching waypoint retry clears map error');
    renderMiniMap(start.lat,start.lon,true,{lat:start.lat,lon:start.lon,mgrsSource:src});renderTrackAll();hit=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');
    let trackWriteAttempts=0;dragSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){trackWriteAttempts++;throw new DOMException('quota','QuotaExceededError')};
    hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:55,clientX:160,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:55,clientX:200,clientY:180,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:55,clientX:200,clientY:180,bubbles:true,cancelable:true}));
    mapAlert=$('miniMap').querySelector('[data-mgrs-map-drag-warning]');check(JSON.stringify(tp)===trackOriginal&&mapAlert&&mapAlert.getBoundingClientRect().height>0&&!$('trackModal').open,'closed track rollback has visible map error');
    const attemptsBeforeClick=trackWriteAttempts;hit=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:56,pointerType:'touch',clientX:160,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:56,pointerType:'touch',clientX:162,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:56,pointerType:'touch',clientX:162,clientY:160,bubbles:true,cancelable:true}));
    check(trackWriteAttempts===attemptsBeforeClick&&$('miniMap').querySelector('[data-mgrs-map-drag-warning]'),'track click under quota cannot write or clear existing error');Storage.prototype.setItem=dragSet;
    hit=document.querySelector('.trk-handle[data-id="'+tp.id+'"]');hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:57,clientX:160,clientY:160,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:57,clientX:200,clientY:180,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:57,clientX:200,clientY:180,bubbles:true,cancelable:true}));
    check(!$('miniMap').querySelector('[data-mgrs-map-drag-warning]')&&!tp.mgrsSource,'successful matching track retry clears map error');
    for(const key of Object.keys(tp))delete tp[key];Object.assign(tp,JSON.parse(trackOriginal));check(saveStore()===true,'reset source track after closed-panel test');
    const beforeTrack=JSON.stringify(state.track.points);const oldSetTrack=Storage.prototype.setItem;
    Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
    check(trackAddFromText('31UDQ5678').storageFailed&&JSON.stringify(state.track.points)===beforeTrack,'bulk track quota rollback');
    const oldLib=JSON.stringify(state.savedTracks);check(!saveCurrentTrackToLibrary('quota-track')&&JSON.stringify(state.savedTracks)===oldLib,'saved track quota rollback');
    Storage.prototype.setItem=oldSetTrack;check(saveStore()===true,'persist track after failure');
    check(saveCurrentTrackToLibrary('source track'),'save track');const saved=state.savedTracks.find(x=>x.name==='source track');
    check(saved&&saved.points[0].mgrsSource.raw===raw&&saved.points[1].mgrsSource.raw===textLine,'saved track sources');
    check(trackVerifyPersistedSavedTrack(saved),'saved track verification includes source');
    let exported='';const oldDownload=downloadBlob;downloadBlob=(body)=>{exported=body};exportSavedTrackSingleFile(saved,'geojson');const geo=JSON.parse(exported);
    check(geo&&geo.type==='FeatureCollection'&&!exported.includes('mgrsSource')&&!exported.includes('01NAA6602100000'),'track spatial export does not imply source transfer');downloadBlob=oldDownload;
    const altered=JSON.parse(JSON.stringify(saved));delete altered.points[0].mgrsSource;check(!savedTrackPersistedEqualCanonical(saved,altered),'verification detects missing source');
    window.confirm=()=>true;beginEditSavedTrackById(saved.id);check(state.track.points[0].mgrsSource.raw===raw,'reopen saved track');
    const changed=state.track.points[0];trackUpdatePointLatLon(changed.id,changed.lat,changed.lon);check(!changed.mgrsSource&&trackHasUnsavedDraft(),'movement invalidates and marks track changed');
    trackUpdatePointLatLon(changed.id,tp.lat,tp.lon);check(!changed.mgrsSource,'movement back cannot revive source');
    state._trackEditingSavedId=null;state._trackEditSession=null;state.track.points=JSON.parse(beforeTrack);check(saveStore()===true,'persist current track fixture');
    openTrackExportDialog();await new Promise(r=>setTimeout(r,100));let hint=$('trackMgrsExportHint'), box=hint.getBoundingClientRect();check(box.width>0&&box.height>0&&hint.textContent.includes('riferimento MGRS originale'),'track export warns origin loss');closeTrackExportDialog();
    openWaypointExportDialog();await new Promise(r=>setTimeout(r,100));hint=$('waypointMgrsExportHint');box=hint.getBoundingClientRect();check(box.width>0&&box.height>0&&hint.textContent.includes('riferimento MGRS originale'),'waypoint export warns origin loss');closeWaypointExportDialog();
    // Full MGRS -> waypoint -> favorite -> result -> actual single export,
    // for both waypoint favorite paths. Controls occur before/after 80 chars.
    const xmlControls=[0,1,11,31,0xFFFE,0xD800];let xmlCases=0;
    for(const method of ['single','bulk']) for(let i=0;i<refs.length;i++) for(const padding of [0,85]){
      const literal=refs[i]+' '.repeat(padding)+String.fromCharCode(xmlControls[i])+'<&"'+String.fromCharCode(92);
      state.mapWaypoints=[];state.favorites=[];waypointModalSelectedRowIds.clear();
      document.querySelector('.tab[data-tab="mgrs"]').click();$('mgrs-input').value=literal;const actual=$('mgrs-input').value;doConvert();
      check(state.lastResult.mgrsSource&&state.lastResult.mgrsSource.raw===actual,'XML path input '+method+' '+i);
      waypointAddFromConvertedPoint();const sourceWp=state.mapWaypoints[0];check(sourceWp&&sourceWp.mgrsSource&&sourceWp.mgrsSource.raw===actual,'XML path waypoint');
      renderWpModalList();
      if(method==='single'){
        const star=$('wp-list').querySelector('[data-role="wp-fav"]');check(star,'XML waypoint favorite button');star.click();
      } else {
        waypointModalSelectedRowIds.add(sourceWp.id);renderWpModalList();const bulk=$('wpBatchAddFavoritesBtn');check(!bulk.disabled,'XML batch favorite button enabled');bulk.click();
      }
      const f=state.favorites[0];check(f&&mgrsSourceFromFavorite(f)&&mgrsSourceFromFavorite(f).raw===actual,'XML path favorite '+method);
      loadFavorite(f.id);check(state.lastResult.mgrsSource&&state.lastResult.mgrsSource.raw===actual&&state.lastResult.meta.type!=='MGRS','XML path reopened source without type label');
      const model=buildSinglePointFromResult();check(model.name===mgrsLiteralForExport(actual.slice(0,80)),'XML safe source-based name');
      let output=null;const previousDownload=downloadBlob;downloadBlob=(body,name,type)=>{output={body,name,type}};
      for(const kind of ['gpx','kml']){
        output=null;exportSingle(kind);check(output&&output.name.endsWith('.'+kind),'actual single export '+kind);
        const doc=new DOMParser().parseFromString(output.body,'application/xml');check(!doc.querySelector('parsererror'),'XML well formed '+method+' '+i+' '+padding+' '+kind);
        const names=doc.getElementsByTagName('name'),descs=doc.getElementsByTagName(kind==='gpx'?'desc':'description');
        check(names[kind==='gpx'?0:1].textContent===model.name&&descs[0].textContent===model.desc,'XML name and description roundtrip');
      }
      downloadBlob=previousDownload;xmlCases++;
    }
    check(xmlCases===24,'all XML routes and precisions tested');
    // Failure at the 200-waypoint cap must restore the entire previous array.
    state.mapWaypoints=Array.from({length:200},(_,i)=>({id:'old-'+i,name:'old-'+i,lat:1+i/1000,lon:2,meta:{from:'legacy'}}));
    check(saveStore()===true,'save cap fixture');const before=JSON.stringify(state.mapWaypoints), beforeStorage=localStorage.getItem(STORAGE_KEY), oldSet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
    renderResults(start.lat,start.lon,{type:'MGRS',raw},{skipHistory:true,mgrsSource:src});$('wpFromConvertedBtn').click();
    check(JSON.stringify(state.mapWaypoints)===before&&state._waypointMgrsStorageFailure,'cap failure rollback');
    check(localStorage.getItem(STORAGE_KEY)===beforeStorage,'cap failure leaves storage');
    Storage.prototype.setItem=oldSet;check(saveStore()===true,'later successful save');check(JSON.stringify(JSON.parse(localStorage.getItem(STORAGE_KEY)).mapWaypoints)===before,'later save retains prior 200');
    state.mapWaypoints[199]={id:'protected-origin',name:'protected-origin',lat:start.lat,lon:start.lon,mgrsSource:src};
    const originBefore=JSON.stringify(state.mapWaypoints);check(saveStore()===true,'persist protected source fixture');
    Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
    check(!waypointAdd(45,9,'independent',{}, {allowNearDuplicate:true})&&JSON.stringify(state.mapWaypoints)===originBefore,'independent add cannot evict source after failed save');
    Storage.prototype.setItem=oldSet;check(saveStore()===true&&JSON.stringify(JSON.parse(localStorage.getItem(STORAGE_KEY)).mapWaypoints)===originBefore,'later save keeps existing source');
    state.mapWaypoints=[];check(waypointAdd(start.lat,start.lon,'reload-source',{}, {mgrsSource:src}),'add persisted source');wp=state.mapWaypoints[0];
    const original=JSON.stringify(wp);Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};
    check(!waypointUpdate(wp.id,{lat:0,lon:9,mgrsSource:null}), 'source edit failed');check(JSON.stringify(wp)===original,'source edit rollback');
    Storage.prototype.setItem=oldSet;check(saveStore()===true,'persist final state');
    state.mapWaypoints.push({id:'legacy-wp',lat:start.lat,lon:start.lon,name:'legacy'});state.mapWaypoints.push({id:'invalid-wp',lat:start.lat+1e-5,lon:start.lon,name:'invalid',mgrsSource:src});check(saveStore()===true,'persist legacy fixtures');
    // Feed malformed source into isolated storage directly so both startup
    // sanitizers actually see untrusted data, rather than pre-sanitizing it.
    const payload=JSON.parse(localStorage.getItem(STORAGE_KEY));
    payload.track.points.push({id:'invalid-track',name:'invalid',lat:start.lat+0.1,lon:start.lon,mgrsSource:src});
    payload.track.points.push({id:'legacy-track',name:'legacy',lat:30,lon:30});
    payload.savedTracks.push({id:'bad-saved',name:'bad-saved',savedAt:Date.now(),points:[{id:'bad-p',lat:start.lat+0.1,lon:start.lon,mgrsSource:src},{id:'legacy-p',lat:30,lon:30}],visible:true});
    localStorage.setItem(STORAGE_KEY,JSON.stringify(payload));
    return {resultTransfer:true,explicitCopy:true,formatTransitions:36,editorPreview:true,bulkTransfers:true,sixPrecisions:true,extremeCell:true,controlCopy:true,sourceInvalidation:true,independentCoincidentPoints:true,editConflict:true,favoriteTransfers:true,editorInput:true,quotaRollback:true,trackTransfer:true,trackSaveReopen:true,trackQuotaRollback:true,realDragQuota:true,realDragSuccess:true,dragErrorsVisibleAndScoped:true,trackClickNoMutation:true,trackMouseTouchJitter:true,collapsedSummary:true,actualWaypointTooltip:true,bulkFavoriteQuota:true,independentCapQuota:true,exportWarnings:true,spatialExportLossVerified:true,waypointFavoriteXmlCases:24,untrustedStorage:true};
  })()`;
  const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
  await call('Emulation.setDeviceMetricsOverride',{width:430,height:932,deviceScaleFactor:1,mobile:false});
  const mapVisual=await call('Runtime.evaluate',{expression:`(()=>{closeWaypointModal();closeTrackModal({force:true});const p=state.mapWaypoints.find(x=>x.name==='reload-source');if(!p)throw Error('visual source missing');renderMiniMap(p.lat,p.lon,true,{lat:p.lat,lon:p.lon,mgrsSource:p.mgrsSource});renderMapWaypointsAll();const hit=document.querySelector('.wpt-handle[data-id="'+p.id+'"]'),map=document.querySelector('#miniMap .tile-map');if(!hit||!map)throw Error('visual map marker missing');const rect=map.getBoundingClientRect(),x=rect.left+rect.width/2,y=rect.top+rect.height/2,old=Storage.prototype.setItem;try{Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError')};hit.dispatchEvent(new PointerEvent('pointerdown',{pointerId:71,clientX:x,clientY:y,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointermove',{pointerId:71,clientX:x+40,clientY:y+20,bubbles:true,cancelable:true}));document.dispatchEvent(new PointerEvent('pointerup',{pointerId:71,clientX:x+40,clientY:y+20,bubbles:true,cancelable:true}));}finally{Storage.prototype.setItem=old;}const note=document.querySelector('[data-mgrs-map-drag-warning]');if(!note||!p.mgrsSource||document.getElementById('waypointModal').open)throw Error('visual map alert missing');return true;})()`,returnByValue:true});
  if(mapVisual.exceptionDetails||!mapVisual.result.value)throw Error('Visual map alert setup');await sleep(350);
  const mapShot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(__dirname,'map-drag-warning-mobile.png'),Buffer.from(mapShot.data,'base64'));
  await call('Runtime.evaluate',{expression:`(()=>{const p=state.mapWaypoints.find(x=>x.name==='reload-source');clearMgrsMapDragFailure('waypoint',p);})()`,returnByValue:true});
  const visual=await call('Runtime.evaluate',{expression:`(()=>{closeWaypointModal();state._trackPointsListMode=null;state._trackPointCoordFormat='mgrs';openTrackModal();renderTrackAll();const head=document.getElementById('track-points-head');if(head)head.scrollIntoView({block:'start'});return !!document.querySelector('#track-points-head .tps-mgrs-original');})()`,returnByValue:true});
  if(visual.exceptionDetails||!visual.result.value)throw Error('Visual summary setup');await sleep(500);
  const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(__dirname,'track-summary-mobile.png'),Buffer.from(shot.data,'base64'));
  await call('Page.reload');await sleep(1600);
  const rr=await call('Runtime.evaluate',{expression:`(()=>{const w=state.mapWaypoints.find(p=>p.name==='reload-source'),old=state.mapWaypoints.find(p=>p.id==='legacy-wp'),bad=state.mapWaypoints.find(p=>p.id==='invalid-wp');if(!w||!w.mgrsSource||w.mgrsSource.raw!==' 01NAA6602100000 '||!old||old.mgrsSource||!bad||bad.mgrsSource)throw Error('reload source/legacy/corrupt');const tr=state.track.points,st=state.savedTracks.find(x=>x.name==='source track');if(!tr[0]||!tr[0].mgrsSource||tr[0].mgrsSource.raw!==' 01NAA6602100000 '||!st||!st.points[0].mgrsSource)throw Error('track and saved track reload');const invalid=tr.find(p=>p.id==='invalid-track'),legacy=tr.find(p=>p.id==='legacy-track'),badSaved=state.savedTracks.find(x=>x.id==='bad-saved');if(!invalid||invalid.mgrsSource||!legacy||legacy.mgrsSource||!badSaved||badSaved.points[0].mgrsSource||badSaved.points[1].mgrsSource)throw Error('untrusted track source not rejected');renderWpModalList();return true;})()`,returnByValue:true});
  if(rr.exceptionDetails)throw Error(JSON.stringify(rr.exceptionDetails));r.result.value.reload=rr.result.value;console.log(JSON.stringify(r.result.value,null,2));ws.close();
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1}).finally(()=>{fs.writeFileSync('independent-events.json',JSON.stringify(browserEvents,null,2));proc.kill()});
