'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),http=require('http'),crypto=require('crypto'),{spawn}=require('child_process');
const base=__dirname, html=path.join(base,'repo','coordinate_converter Claude.html'), bytes=fs.readFileSync(html),sha=crypto.createHash('sha256').update(bytes).digest('hex');
const mode=process.argv[2]||'candidate', tmp=fs.mkdtempSync(path.join(os.tmpdir(),'tmar-qa308-browser-')), profile=path.join(tmp,'profile');
const out={mode,build:308,sha256:sha,checks:[],exceptions:[],consoleErrors:[],network:{post:0,blocked:0,documentHashes:[]},nativeClicks:0,fileChooserEvents:0,screenshots:[]};
let srv,browser,ws,seq=0,closing=false,qaOrigin; const pend=new Map(),sleep=ms=>new Promise(r=>setTimeout(r,ms));
function check(name,pass,details){out.checks.push({name,pass:!!pass,details});if(!pass)console.log(JSON.stringify({finding:name,details}));}
function send(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pend.delete(id);reject(Error('CDP timeout '+method))},25000);pend.set(id,{resolve,reject,timer,method});ws.send(JSON.stringify({id,method,params}));});}
async function ev(fn,...args){const expression=typeof fn==='string'?fn:'('+fn.toString()+')('+args.map(x=>JSON.stringify(x)).join(',')+')';const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function until(fn){for(let i=0;i<100;i++){try{if(await ev(fn))return}catch(e){}await sleep(100)}throw Error('condition timeout '+String(fn).slice(0,100));}
async function click(selector){
 const b=await ev(sel=>{const e=document.querySelector(sel);if(!e)throw Error('missing '+sel);e.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});const r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y);return {x,y,w:r.width,h:r.height,disabled:!!e.disabled,hit:hit===e||e.contains(hit)};},selector);
 if(!b.w||!b.h||b.disabled||!b.hit)throw Error('not clickable '+selector+' '+JSON.stringify(b));
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:b.x,y:b.y});await send('Input.dispatchMouseEvent',{type:'mousePressed',x:b.x,y:b.y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:b.x,y:b.y,button:'left',clickCount:1});out.nativeClicks++;await sleep(60);
}
async function fill(selector,text){await click(selector);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});await send('Input.insertText',{text});}
async function file(selector,filename){const {root}=await send('DOM.getDocument',{depth:0});const {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector});if(!nodeId)throw Error('file input not found');await send('DOM.setFileInputFiles',{nodeId,files:[filename]});}
async function screenshot(name){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1100,y:80});await sleep(180);const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const p=path.join(base,mode+'-'+name+'.png');fs.writeFileSync(p,Buffer.from(r.data,'base64'));out.screenshots.push(p);}
async function ready(){await until(()=>typeof APP_BUILD_NUM!=='undefined'&&APP_BUILD_NUM===308&&typeof openTrackModal==='function'&&document.readyState==='complete');}
const fixture=path.join(base,'qa308-mixed.geojson'),current=path.join(base,'qa308-current.gpx');
fs.writeFileSync(fixture,JSON.stringify({type:'FeatureCollection',features:[{type:'Feature',properties:{name:'QA308_ARCHIVE'},geometry:{type:'LineString',coordinates:[[13.101,47.101,120],[13.102,47.102],[13.103,47.103,160]]}},{type:'Feature',properties:{name:'IGNORE_WP'},geometry:{type:'Point',coordinates:[13.4,47.4]}},{type:'Feature',properties:{name:'IGNORE_POLYGON'},geometry:{type:'Polygon',coordinates:[[[13.5,47.5],[13.6,47.5],[13.6,47.6],[13.5,47.5]]]}}]}));
fs.writeFileSync(current,'<?xml version="1.0"?><gpx version="1.1" creator="isolated-QA"><trk><name>QA308_CURRENT</name><trkseg>'+Array.from({length:198},(_,i)=>'<trkpt lat="'+(44+i*.0001).toFixed(6)+'" lon="'+(9+i*.0001).toFixed(6)+'"><ele>'+(100+i)+'</ele></trkpt>').join('')+'</trkseg></trk></gpx>');
(async()=>{
 try{
  srv=http.createServer((req,res)=>{if(req.method==='POST')out.network.post++;if(req.url.startsWith('/gis')&&req.method==='GET'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(bytes)}else{res.writeHead(404);res.end('not found')}});
  await new Promise(r=>srv.listen(0,'127.0.0.1',r));const origin=qaOrigin=mode==='live'?'https://ionos-n8n-new.tailc01234.ts.net':'http://127.0.0.1:'+srv.address().port;
  browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--remote-debugging-port=0','--remote-debugging-address=127.0.0.1','--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-extensions','--disable-gpu','--window-size=1440,900','about:blank'],{stdio:'ignore',windowsHide:true});
  let port;const pf=path.join(profile,'DevToolsActivePort');for(let i=0;i<130;i++){if(fs.existsSync(pf)){port=Number(fs.readFileSync(pf,'utf8').split('\n')[0]);break}await sleep(100)}if(!port)throw Error('Edge failed to start');
  const pages=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(pages.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((ok,no)=>{ws.onopen=ok;ws.onerror=no});
  ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}if(m.id){const x=pend.get(m.id);if(!x)return;clearTimeout(x.timer);pend.delete(m.id);m.error?x.reject(Error(x.method+': '+m.error.message)):x.resolve(m.result||{});return;}
   if(m.method==='Runtime.exceptionThrown')out.exceptions.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);
   if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')out.consoleErrors.push((m.params.args||[]).map(a=>a.value||a.description).join(' ').slice(0,250));
   if(m.method==='Page.fileChooserOpened')out.fileChooserEvents++;
   if(m.method==='Network.requestWillBeSent'&&m.params.request?.method==='POST')out.network.post++;
   if(m.method==='Fetch.requestPaused'){const q=m.params,allow=q.request.method==='GET'&&q.request.url.startsWith(origin+'/gis');if(!allow)out.network.blocked++;send(allow?'Fetch.continueRequest':'Fetch.failRequest',allow?{requestId:q.requestId}:{requestId:q.requestId,errorReason:'BlockedByClient'}).catch(()=>{});}
  };
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Page.setInterceptFileChooserDialog',{enabled:true});await send('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}]});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:origin+'/gis?v='+sha.slice(0,8)});await ready();
  await ev(()=>{openTrackModal();renderTrackAll();});
  const empty=await ev(()=>{const show=id=>document.getElementById(id).getClientRects().length>0;return {currentTitle:document.getElementById('trackCurrentTitle')?.textContent,archiveTitle:document.getElementById('trackArchiveTitle')?.textContent,saveInCurrent:document.getElementById('trackCurrentZone').contains(document.getElementById('btnTrackSaveLibrary')),saveVisible:show('btnTrackSaveLibrary'),saveDisabled:document.getElementById('btnTrackSaveLibrary').disabled,detailsClosed:!document.getElementById('trackCurrentDetails').open,archiveExportHidden:!show('btnTrackArchiveExport'),batchHidden:!show('savedTracksBatchBar'),workbenchOpen:document.getElementById('gisWorkbenchPanel').open};});
  check('Empty desktop: two zones, Save above, no grey archive actions',empty.saveInCurrent&&empty.saveVisible&&empty.saveDisabled&&empty.detailsClosed&&empty.archiveExportHidden&&empty.batchHidden&&!empty.workbenchOpen,empty);
  await screenshot('empty');
  await ev(()=>{waypointAdd(42.111,8.111,'QA308_SENTINEL_WP1',{});waypointAdd(42.112,8.112,'QA308_SENTINEL_WP2',{});gisFeatureAdd('polygon',{type:'Feature',properties:{name:'QA308_SENTINEL_POLYGON'},geometry:{type:'Polygon',coordinates:[[[8,42],[8.1,42],[8.1,42.1],[8,42]]]}},{recordUndo:false});saveStoreReported();window.__qaSentinels={wp:JSON.stringify(state.mapWaypoints),pg:JSON.stringify(state.gisPolygons)};window.__qaHubBefore=JSON.stringify(state._gisImportHub);window.__qaBeforeRaw=localStorage.getItem(STORAGE_KEY);});
  await click('#btnTrackArchiveImport');await file('#trackArchiveFileInput',fixture);await until(()=>!!_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  const preview=await ev(()=>({trackOpen:document.getElementById('trackModal').open,wbOpen:document.getElementById('gisWorkbenchPanel').open,inTrack:document.getElementById('trackModal').contains(document.getElementById('trackArchiveImportPreview')),info:document.getElementById('trackArchiveImportInfo').textContent,name:document.getElementById('trackArchiveImportName').value,ignored:!document.getElementById('trackArchiveImportIgnored').hidden,saved:state.savedTracks.length,hubSame:window.__qaHubBefore===JSON.stringify(state._gisImportHub),rawSame:window.__qaBeforeRaw===localStorage.getItem(STORAGE_KEY)}));
  check('Native picker leads to in-panel preview, no Oggetti GIS or mutation',preview.trackOpen&&!preview.wbOpen&&preview.inTrack&&preview.saved===0&&preview.hubSame&&preview.rawSame&&preview.ignored,preview);
  await screenshot('preview');await click('#trackArchiveImportCancel');
  check('Cancel preview leaves all stores untouched',await ev(()=>!_trackArchivePreview&&document.getElementById('trackArchiveImportPreview').hidden&&window.__qaBeforeRaw===localStorage.getItem(STORAGE_KEY)&&window.__qaSentinels.wp===JSON.stringify(state.mapWaypoints)&&window.__qaSentinels.pg===JSON.stringify(state.gisPolygons)));
  await click('#btnTrackArchiveImport');await file('#trackArchiveFileInput',fixture);await until(()=>!!_trackArchivePreview&&_trackArchivePreview.phase==='preview');await fill('#trackArchiveImportName','QA308 archivio');await click('#trackArchiveImportApply');
  const imported=await ev(()=>({count:state.savedTracks.length,name:state.savedTracks[0]?.name,heights:state.savedTracks[0]?.importedElevations?.heights,waypoints:state.mapWaypoints.length,pg:state.gisPolygons.length,current:state.track.points.length,wb:document.getElementById('gisWorkbenchPanel').open,wpSame:window.__qaSentinels.wp===JSON.stringify(state.mapWaypoints),pgSame:window.__qaSentinels.pg===JSON.stringify(state.gisPolygons),hubSame:window.__qaHubBefore===JSON.stringify(state._gisImportHub)}));
  check('In-panel confirmation saves track and sparse elevations only',imported.count===1&&imported.name==='QA308 archivio'&&JSON.stringify(imported.heights)==='[120,null,160]'&&imported.current===0&&!imported.wb&&imported.wpSame&&imported.pgSame&&imported.hubSame,imported);
  await click('#savedTracksMount .saved-sel-cb');
  check('Selection reveals batch actions',await ev(()=>document.getElementById('savedTracksBatchBar').getClientRects().length>0&&!document.getElementById('btnTrackArchiveExport').disabled));
  await ev(()=>{window.__qaDownloads=[];window.__qaDownloadOriginal=downloadBlob;downloadBlob=(data,name,mime)=>window.__qaDownloads.push({data:typeof data==='string'?data:null,name,mime});});
  await click('#btnTrackArchiveExport');await click('#trackExportDialog [data-track-export-fmt="gpx"]');
  const gpx=await ev(()=>window.__qaDownloads.at(-1));check('Archive export retains only the selected track and original valid heights',gpx?.data?.includes('120')&&gpx?.data?.includes('160')&&(gpx.data.match(/<ele>/g)||[]).length===2&&!gpx.data.includes('QA308_SENTINEL'),{name:gpx?.name,elevations:(gpx?.data?.match(/<ele>/g)||[]).length});
  await click('#btnTrackImport');await file('#trackFileInput',current);await until(()=>state.track.points.length===198);
  const currentInfo=await ev(()=>({points:state.track.points.length,compact:document.getElementById('trackCurrentCompact').textContent,saveEnabled:!document.getElementById('btnTrackSaveLibrary').disabled,detailsClosed:!document.getElementById('trackCurrentDetails').open,wb:document.getElementById('gisWorkbenchPanel').open,wpSame:window.__qaSentinels.wp===JSON.stringify(state.mapWaypoints)}));
  check('Current-file import remains in compact upper zone with usable Save',currentInfo.points===198&&currentInfo.saveEnabled&&currentInfo.detailsClosed&&!currentInfo.wb&&currentInfo.wpSame,currentInfo);
  await screenshot('populated');
  await click('#btnTrackExportOpenBtn');await click('#trackExportDialog [data-track-export-fmt="geojson"]');
  const exported=await ev(()=>{const x=JSON.parse(window.__qaDownloads.at(-1).data);return {count:x.features.length,coordinates:x.features[0].geometry.coordinates};});
  check('Upper export uses current draft, not selected archive row',exported.count===1&&exported.coordinates?.length===198&&exported.coordinates[0][0]===9&&exported.coordinates[0][2]===100,{features:exported.count,points:exported.coordinates?.length,first:exported.coordinates?.[0]});
  await click('#btnTrackSaveLibrary');await until(()=>document.getElementById('trackSaveNameDialog').open);await fill('#trackSaveNameDialogInput','QA308 corrente salvata');await click('#trackSaveNameDialogSaveBtn');
  check('Upper Save preserves current GPX heights in second archive entry',await ev(()=>state.savedTracks.length===2&&state.savedTracks.some(x=>x.name==='QA308 corrente salvata'&&x.points.length===198&&x.importedElevations?.heights?.[197]===297)));
  await send('Page.reload',{ignoreCache:true});await ready();await ev(()=>{openTrackModal();renderTrackAll();});
  const reload=await ev(()=>({saved:state.savedTracks.map(x=>({name:x.name,n:x.points.length,z:x.importedElevations?.heights})),wp:state.mapWaypoints.map(x=>x.name),pg:state.gisPolygons.length}));
  check('Archive survives reload; existing waypoint and polygon stores retained',reload.saved.length===2&&reload.saved.find(x=>x.n===3)?.z?.[1]===null&&reload.saved.find(x=>x.n===198)?.z?.[197]===297&&reload.wp.length===2&&reload.pg===1,{saved:reload.saved.map(x=>({name:x.name,n:x.n})),wp:reload.wp,pg:reload.pg});
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:600,deviceScaleFactor:1,mobile:false});await sleep(180);await screenshot('short-window');
  check('Short desktop: no horizontal overflow in Traccia',await ev(()=>{const b=document.getElementById('trackModalBody');return b.scrollWidth<=b.clientWidth+2;}));
  await click('#trackCurrentDetails > summary');check('Details are available on demand',await ev(()=>document.getElementById('trackCurrentDetails').open&&document.getElementById('trackDisplayUnit').getClientRects().length>0));await click('#trackCurrentDetails > summary');
  await click('#btnTrackArchiveImport');await file('#trackArchiveFileInput',fixture);await until(()=>!!_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  await ev(()=>{window.__qaRawBeforeRollback=localStorage.getItem(STORAGE_KEY);window.__qaIdsBeforeRollback=state.savedTracks.map(x=>x.id);window.__qaSaveOriginal=saveStoreReported;let calls=0;saveStoreReported=function(){if(++calls===1)return {ok:false};return window.__qaSaveOriginal();};});
  await click('#trackArchiveImportApply');
  const rollback=await ev(()=>{saveStoreReported=window.__qaSaveOriginal;return {raw:window.__qaRawBeforeRollback===localStorage.getItem(STORAGE_KEY),ids:JSON.stringify(window.__qaIdsBeforeRollback)===JSON.stringify(state.savedTracks.map(x=>x.id)),phase:_trackArchivePreview?.phase,error:document.getElementById('trackArchiveImportStatus').dataset.error};});
  check('Failed persistence rolls back byte-identical storage and IDs',rollback.raw&&rollback.ids&&rollback.phase==='preview'&&rollback.error==='true',rollback);await click('#trackArchiveImportCancel');
  const late=await ev(async function(){
   const original=gisImportHubParseOneFile,raw=localStorage.getItem(STORAGE_KEY);
   gisImportHubParseOneFile=async function(file){await new Promise(r=>setTimeout(r,120));return original(file);};
   try{
    const f=new File([JSON.stringify({type:'FeatureCollection',features:[{type:'Feature',properties:{name:'LATE'},geometry:{type:'LineString',coordinates:[[15,48,100],[15.1,48.1,110]]}}]})],'late.geojson');
    const pending=trackArchivePreparePreview(f);trackArchiveCancelPreview(false);await pending;
    return {rawSame:raw===localStorage.getItem(STORAGE_KEY),noPreview:!_trackArchivePreview,unlocked:!gisSpatialImportIsBusy(),saved:state.savedTracks.length};
   }finally{gisImportHubParseOneFile=original;}
  });
  check('Cancelled asynchronous parse cannot create a late preview or save',late.rawSame&&late.noPreview&&late.unlocked&&late.saved===2,late);
  const invalid=await ev(async function(){
   const raw=localStorage.getItem(STORAGE_KEY);const ok=await trackArchivePreparePreview(new File(['not geojson'],'invalid.geojson'));
   return {ok,unchanged:raw===localStorage.getItem(STORAGE_KEY),error:document.getElementById('trackArchiveImportStatus').dataset.error,preview:!!_trackArchivePreview};
  });
  check('Invalid archive file is rejected without mutation',!invalid.ok&&invalid.unchanged&&invalid.error==='true'&&!invalid.preview,invalid);
  await ev(()=>trackArchiveCancelPreview(false));
  await click('#btnTrackArchiveImport');await file('#trackArchiveFileInput',fixture);await until(()=>!!_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  await ev(()=>{window.__qaBeforeClose=localStorage.getItem(STORAGE_KEY);});
  await click('#trackModal .app-modal-close');
  check('Closing Traccia cancels its pending import without saving',await ev(()=>!document.getElementById('trackModal').open&&!_trackArchivePreview&&!gisSpatialImportIsBusy()&&window.__qaBeforeClose===localStorage.getItem(STORAGE_KEY)));
  await ev(()=>{openTrackModal();renderTrackAll();});
  await click('#savedTracksMount [data-saved-edit]');
  const editing=await ev(()=>({id:state._trackEditingSavedId,label:document.getElementById('btnTrackSaveLibrary').textContent,correct:document.getElementById('btnTrackSaveLibrary').textContent===t('track.updateLibrary'),details:document.getElementById('trackCurrentDetails').open,ids:state.savedTracks.map(x=>x.id)}));
  check('Edit existing entry shows Update in current zone and opens details',!!editing.id&&editing.correct&&editing.details,editing);
  await click('#btnTrackSaveLibrary');
  check('Updating a saved entry preserves archive identities',await ev(ids=>JSON.stringify(ids)===JSON.stringify(state.savedTracks.map(x=>x.id)),editing.ids));
  await ev(()=>{window.__qaZip=null;downloadBlob=(data,name,mime)=>{window.__qaZip={name,mime,bytes:data?.byteLength||data?.size||0};};});
  await click('#savedTracksSelectAll');
  await click('#btnTrackArchiveExport');await click('#trackExportDialog [data-track-export-fmt="gpx"]');
  const zip=await ev(()=>({selected:getSelectedSavedTrackIdsForExport().length,file:window.__qaZip}));
  check('Multiple selected archive rows export as one ZIP',zip.selected===2&&zip.file?.name?.endsWith('.zip')&&zip.file.bytes>0,zip);
  const poly=await ev(()=>{
   const before=state.gisPolygons[0],coords=JSON.stringify(before.geometry.coordinates),ids=state.savedTracks.map(x=>x.id);
   const fc={type:'FeatureCollection',features:[{type:'Feature',properties:{name:'QA308_POLYGON_ROUNDTRIP'},geometry:before.geometry}]};
   const parsed=spatialKmlToFeatureCollection(spatialGeoJSONToKml(fc));
   const created=gisFeatureAdd('polygon',parsed.features.find(x=>x.geometry?.type==='Polygon'),{recordUndo:false});
   const persisted=saveStoreReported();
   return {created:!!created,geometrySame:JSON.stringify(created?.geometry?.coordinates)===coords,persisted:persisted?.ok,pg:state.gisPolygons.length,tracksSame:JSON.stringify(ids)===JSON.stringify(state.savedTracks.map(x=>x.id)),wp:state.mapWaypoints.length};
  });
  check('Canonical GIS polygon KML roundtrip preserves geometry and track store',poly.created&&poly.geometrySame&&poly.persisted&&poly.pg===2&&poly.tracksSame&&poly.wp===2,poly);
  await send('Page.reload',{ignoreCache:true});await ready();await ev(()=>{openTrackModal();renderTrackAll();});
  check('Polygon roundtrip and both tracks survive another reload',await ev(()=>state.gisPolygons.length===2&&state.savedTracks.length===2&&state.mapWaypoints.length===2));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await sleep(180);
  const mobile=await ev(()=>({singleHidden:document.getElementById('trackSimpleUi').hidden,saveHidden:document.getElementById('btnTrackSaveLibrary').getClientRects().length===0,archiveHidden:document.getElementById('btnTrackArchiveImport').getClientRects().length===0,topRestored:!!document.getElementById('btnTrackImport').closest('.track-toolbar'),ptsParent:document.getElementById('track-points-section').parentElement.classList.contains('track-builder')}));
  check('Mobile viewport restores original DOM layout and controls',mobile.singleHidden&&mobile.saveHidden&&mobile.archiveHidden&&mobile.topRestored&&mobile.ptsParent,mobile);
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await sleep(150);check('Returning to desktop restores two-zone layout without duplicate IDs',await ev(()=>!document.getElementById('trackSimpleUi').hidden&&document.querySelectorAll('#btnTrackSaveLibrary').length===1&&document.getElementById('trackCurrentZone').contains(document.getElementById('btnTrackSaveLibrary'))));
  check('Native file selector used',out.fileChooserEvents>=5,{fileChooserEvents:out.fileChooserEvents,nativeClicks:out.nativeClicks});
  check('No POST requests',out.network.post===0,out.network.post);check('No JavaScript exceptions',out.exceptions.length===0,out.exceptions);check('No console errors',out.consoleErrors.length===0,out.consoleErrors);
 }catch(e){out.fatal={message:e.message,stack:e.stack?.slice(0,1500)};console.log(JSON.stringify({fatal:out.fatal}));try{await screenshot('failure')}catch(_){}}
 finally{closing=true;try{if(ws&&ws.readyState===1&&qaOrigin){await send('Storage.clearDataForOrigin',{origin:qaOrigin,storageTypes:'all'});out.dataCleanup=await ev(()=>localStorage.length===0);}}catch(e){out.dataCleanup=false;out.dataCleanupError=e.message;}try{if(ws&&ws.readyState===1)await Promise.race([send('Browser.close'),sleep(1200)])}catch(_){}try{ws?.close()}catch(_){}for(const p of pend.values())clearTimeout(p.timer);pend.clear();if(browser&&!browser.killed)browser.kill();if(srv)await new Promise(r=>srv.close(r));await sleep(500);try{fs.rmSync(tmp,{recursive:true,force:true,maxRetries:2,retryDelay:100});out.cleanup=true}catch(e){out.cleanup=false;out.cleanupError=e.message}out.pass=!out.fatal&&out.checks.length>=27&&out.checks.every(x=>x.pass)&&out.dataCleanup;fs.writeFileSync(path.join(base,mode+'-qa308.json'),JSON.stringify(out,null,2));console.log(JSON.stringify({mode,pass:out.pass,checks:out.checks.length,passed:out.checks.filter(x=>x.pass).length,failed:out.checks.filter(x=>!x.pass),fatal:out.fatal,sha256:sha,nativeClicks:out.nativeClicks,fileChooserEvents:out.fileChooserEvents,exceptions:out.exceptions,consoleErrors:out.consoleErrors,screenshots:out.screenshots,dataCleanup:out.dataCleanup,profileDirectoryRemoved:out.cleanup}));process.exitCode=out.pass?0:1;}
})();
