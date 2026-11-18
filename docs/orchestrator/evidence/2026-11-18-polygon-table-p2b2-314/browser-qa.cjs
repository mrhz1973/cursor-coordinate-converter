'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),http=require('http'),crypto=require('crypto'),{spawn}=require('child_process');
const base=process.env.GIS_QA_OUTPUT||__dirname, html=process.env.GIS_QA_HTML||path.join(base,'repo','coordinate_converter Claude.html'), bytes=fs.readFileSync(html),sha=crypto.createHash('sha256').update(bytes).digest('hex');
const mode=process.argv[2]||'candidate', tmp=fs.mkdtempSync(path.join(os.tmpdir(),'tmar-qa314-browser-')), profile=path.join(tmp,'profile');
const out={mode,build:314,sha256:sha,checks:[],exceptions:[],consoleErrors:[],network:{post:0,blocked:0,documentHashes:[]},nativeClicks:0,fileChooserEvents:0,screenshots:[]};
let srv,browser,ws,seq=0,closing=false,qaOrigin; let mockApi=0,mockOtherApi=0,mockMode='success',allowConsent=false,dialogs=0; const pend=new Map(),sleep=ms=>new Promise(r=>setTimeout(r,ms));
function check(name,pass,details){out.checks.push({name,pass:!!pass,details});if(!pass)console.log(JSON.stringify({finding:name,details}));}
function send(method,params={}){const id=++seq;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pend.delete(id);reject(Error('CDP timeout '+method))},25000);pend.set(id,{resolve,reject,timer,method});ws.send(JSON.stringify({id,method,params}));});}
async function ev(fn,...args){const expression=typeof fn==='string'?fn:'('+fn.toString()+')('+args.map(x=>JSON.stringify(x)).join(',')+')';const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function until(fn){for(let i=0;i<100;i++){try{if(await ev(fn))return}catch(e){}await sleep(100)}throw Error('condition timeout '+String(fn).slice(0,100));}
async function click(selector){
 await ev(sel=>{const e=document.querySelector(sel);if(!e)throw Error('missing '+sel);e.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});},selector);
 await sleep(160);
 const b=await ev(sel=>{const e=document.querySelector(sel);if(!e)throw Error('missing '+sel);e.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});const r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y);return {x,y,w:r.width,h:r.height,disabled:!!e.disabled,hit:hit===e||e.contains(hit)};},selector);
 if(!b.w||!b.h||b.disabled||!b.hit)throw Error('not clickable '+selector+' '+JSON.stringify(b));
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:b.x,y:b.y});await sleep(35);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',x:b.x,y:b.y,button:'left',clickCount:1});await sleep(80);
 await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:b.x,y:b.y,button:'left',clickCount:1});out.nativeClicks++;await sleep(90);
}
async function dragSavedColumn(key,dx){
 const b=await ev(k=>{
  const el=document.querySelector('.saved-tracks-table [data-saved-resize="'+k+'"]');
  if(!el)throw Error('missing drag handle '+k);
  el.scrollIntoView({block:'center',inline:'center',behavior:'instant'});
  const r=el.getBoundingClientRect();
  return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height};
 },key);
 await sleep(140);
 if(b.w<3||b.h<3)throw Error('hidden resizer '+key);
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:b.x,y:b.y});
 await sleep(35);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',x:b.x,y:b.y,button:'left',clickCount:1});
 await sleep(35);
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:b.x+dx,y:b.y,buttons:1});
 await sleep(70);
 await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:b.x+dx,y:b.y,button:'left',clickCount:1});
 await sleep(130);
}
async function dragWpColumn(key,dx){
 const b=await ev(k=>{
  const el=document.querySelector('.wp-modal-table [data-wp-col-resize="'+k+'"]');
  if(!el)throw Error('missing WP resize handle '+k);
  el.scrollIntoView({block:'center',inline:'center',behavior:'instant'});
  const r=el.getBoundingClientRect();
  return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height};
 },key);
 await sleep(140);
 if(b.w<3||b.h<3)throw Error('hidden waypoint resize '+key);
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:b.x,y:b.y});await sleep(35);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',x:b.x,y:b.y,button:'left',clickCount:1});await sleep(40);
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:b.x+dx,y:b.y,buttons:1});await sleep(80);
 await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:b.x+dx,y:b.y,button:'left',clickCount:1});await sleep(120);
}
async function dragPolyColumn(key,dx){
 const p=await ev(k=>{
  const el=document.querySelector('.poly-list-table [data-poly-resize="'+k+'"]');
  if(!el)throw Error('no polygon resize: '+k);
  const root=document.getElementById('polygonPanelList');
  if(k==='actions')root.scrollLeft=root.scrollWidth;
  else if(k==='sel')root.scrollLeft=0;
  el.scrollIntoView({block:'center',inline:'nearest',behavior:'instant'});
  if(k==='actions')root.scrollLeft=root.scrollWidth;
  else if(k!=='sel'){
    const rr=el.getBoundingClientRect(),pr=root.getBoundingClientRect();
    root.scrollLeft+=Math.round(rr.left+rr.width/2-(pr.left+Math.min(root.clientWidth*0.56,220)));
  }
  const r=el.getBoundingClientRect();
  const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
  return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,hit:hit===el||el.contains(hit),
    topHit:hit?hit.tagName+':'+String(hit.className).slice(0,90):null,
    scroll:root.scrollLeft,scrollMax:root.scrollWidth-root.clientWidth};
 },key);
 await sleep(155);
 if(p.w<3||p.h<3||!p.hit)throw Error('inaccessible polygon resizer '+key+' '+JSON.stringify(p));
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.x,y:p.y});await sleep(40);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',clickCount:1});await sleep(45);
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.x+dx,y:p.y,buttons:1});await sleep(85);
 await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x+dx,y:p.y,button:'left',clickCount:1});await sleep(145);
}
async function fill(selector,text){await click(selector);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});await send('Input.insertText',{text});}
async function file(selector,filename){const {root}=await send('DOM.getDocument',{depth:0});const {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector});if(!nodeId)throw Error('file input not found');await send('DOM.setFileInputFiles',{nodeId,files:[filename]});}async function files(selector,filenames){
 const {root}=await send('DOM.getDocument',{depth:0});
 const {nodeId}=await send('DOM.querySelector',{nodeId:root.nodeId,selector});
 if(!nodeId)throw Error('file input not found: '+selector);
 await send('DOM.setFileInputFiles',{nodeId,files:filenames});
}

async function screenshot(name){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1100,y:80});await sleep(180);const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const p=path.join(base,mode+'-'+name+'.png');fs.writeFileSync(p,Buffer.from(r.data,'base64'));out.screenshots.push(p);}
async function ready(){await until(()=>typeof APP_BUILD_NUM!=='undefined'&&APP_BUILD_NUM===314&&typeof openTrackModal==='function'&&document.readyState==='complete');}
const fixture=path.join(base,'qa309-mixed.geojson'),current=path.join(base,'qa309-current.gpx');
fs.writeFileSync(fixture,JSON.stringify({type:'FeatureCollection',features:[{type:'Feature',properties:{name:'QA309_ARCHIVE'},geometry:{type:'LineString',coordinates:[[13.101,47.101,120],[13.102,47.102],[13.103,47.103,160]]}},{type:'Feature',properties:{name:'IGNORE_WP'},geometry:{type:'Point',coordinates:[13.4,47.4]}},{type:'Feature',properties:{name:'IGNORE_POLYGON'},geometry:{type:'Polygon',coordinates:[[[13.5,47.5],[13.6,47.5],[13.6,47.6],[13.5,47.5]]]}}]}));
fs.writeFileSync(current,'<?xml version="1.0"?><gpx version="1.1" creator="isolated-QA"><trk><name>QA309_CURRENT</name><trkseg>'+Array.from({length:198},(_,i)=>'<trkpt lat="'+(44+i*.0001).toFixed(6)+'" lon="'+(9+i*.0001).toFixed(6)+'"><ele>'+(100+i)+'</ele></trkpt>').join('')+'</trkseg></trk></gpx>');
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
   if(m.method==='Page.javascriptDialogOpening'){dialogs++;send('Page.handleJavaScriptDialog',{accept:allowConsent}).catch(()=>{});return;}
   if(m.method==='Page.fileChooserOpened')out.fileChooserEvents++;
   if(m.method==='Network.requestWillBeSent'&&m.params.request?.method==='POST')out.network.post++;
   if(m.method==='Fetch.requestPaused'){
    const q=m.params;
    if(q.request.url.startsWith('https://api.open-meteo.com/v1/elevation?')){
      const u=new URL(q.request.url);
      const latParam=u.searchParams.get('latitude')||'';
      if(latParam.includes(','))mockApi++;else mockOtherApi++;
      const lats=latParam.split(',').map(Number);
      const elevations=lats.map((lat,idx)=>Math.round(100+lat*10+idx/10));
      const code=mockMode==='error'?503:200;
      const payload=mockMode==='error'?{error:true,reason:'QA simulated upstream error'}:{elevation:elevations};
      send('Fetch.fulfillRequest',{requestId:q.requestId,responseCode:code,
        responseHeaders:[{name:'Access-Control-Allow-Origin',value:'*'},{name:'Content-Type',value:'application/json'}],
        body:Buffer.from(JSON.stringify(payload)).toString('base64')}).catch(e=>out.exceptions.push('mock '+e.message));
      return;
    }
    const allow=q.request.method==='GET'&&q.request.url.startsWith(origin+'/gis');
    if(!allow)out.network.blocked++;
    send(allow?'Fetch.continueRequest':'Fetch.failRequest',allow?{requestId:q.requestId}:{requestId:q.requestId,errorReason:'BlockedByClient'}).catch(()=>{});
   }
  };
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Page.setInterceptFileChooserDialog',{enabled:true});await send('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}]});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:origin+'/gis?v='+sha.slice(0,8)});await ready();
  const fixtureGpx=path.join(base,'qa311-mixed.gpx');
  const fixtureKml=path.join(base,'qa311-2.kml');
  const fixtureGeo=path.join(base,'qa311-multi.geojson');
  const fixtureFour=path.join(base,'qa311-four.gpx');
  const fixtureEleven=path.join(base,'qa311-eleven.geojson');
  const fixtureInvalid=path.join(base,'qa311-invalid.geojson');
  const gpxTrack=(name,i,includeEle=true)=>'<trk><name>'+name+'</name><trkseg>'+
    [0,1,2].map(j=>'<trkpt lat="'+(44+i*.01+j*.001).toFixed(6)+'" lon="'+(9+i*.01+j*.001).toFixed(6)+'">'+
      (includeEle?'<ele>'+(100+i*10+j*20)+'</ele>':'')+'</trkpt>').join('')+
    '</trkseg></trk>';
  fs.writeFileSync(fixtureGpx,'<?xml version="1.0"?><gpx version="1.1" creator="QA311">'+
    '<wpt lat="44" lon="9.1"><name>QA waypoint ignored</name></wpt>'+
    '<trk><name>GPX-Alfa</name><trkseg>'+
    '<trkpt lat="44.1" lon="9.1"><ele>100</ele></trkpt>'+
    '<trkpt lat="44.101" lon="9.102"></trkpt>'+
    '<trkpt lat="44.102" lon="9.104"><ele>200</ele></trkpt>'+
    '</trkseg></trk></gpx>');
  fs.writeFileSync(fixtureKml,'<?xml version="1.0"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>'+
    '<Placemark><name>KML-Uno</name><LineString><altitudeMode>absolute</altitudeMode>'+
    '<coordinates>9.2,44.2,41 9.21,44.21,59 9.22,44.22,61</coordinates></LineString></Placemark>'+
    '<Placemark><name>KML-Due</name><LineString>'+
    '<coordinates>9.3,44.3 9.31,44.31</coordinates></LineString></Placemark>'+
    '</Document></kml>');
  const line=(name,coordinates)=>({type:'Feature',properties:{name},geometry:{type:'LineString',coordinates}});
  fs.writeFileSync(fixtureGeo,JSON.stringify({type:'FeatureCollection',features:[
    line('GEO-Luno',[[10,45,23],[10.01,45.01],[10.02,45.02,24]]),
    {type:'Feature',properties:{name:'DUP'},geometry:{type:'MultiLineString',coordinates:[
      [[10.1,45.1],[10.11,45.11]],[[10.2,45.2,35],[10.21,45.21,36]]
    ]}},
    {type:'Feature',properties:{name:'IGNORE_WP'},geometry:{type:'Point',coordinates:[10.4,45.4]}},
    {type:'Feature',properties:{name:'IGNORE_PG'},geometry:{type:'Polygon',coordinates:[[[10.5,45.5],[10.6,45.5],[10.6,45.6],[10.5,45.5]]]}}
  ]}));
  fs.writeFileSync(fixtureFour,'<gpx version="1.1" creator="QA311">'+
    Array.from({length:4},(_,i)=>gpxTrack('DUP',i+1,false)).join('')+'</gpx>');
  fs.writeFileSync(fixtureEleven,JSON.stringify({type:'FeatureCollection',features:Array.from({length:11},(_,i)=>
    line('ELEVEN_'+i,[[9.1+i*.01,44.1],[9.11+i*.01,44.11]]))}));
  fs.writeFileSync(fixtureInvalid,JSON.stringify({type:'FeatureCollection',features:[
    line('valid',[[9.1,44.1],[9.11,44.11]]),
    line('invalid',[[9.2,120],[9.21,44.12]])
  ]}));
  const elevenFilePaths=[];
  for(let i=0;i<11;i++){
    const f=path.join(base,'qa311-file-'+i+'.gpx');
    fs.writeFileSync(f,'<gpx version="1.1" creator="QA311">'+gpxTrack('Single_'+i,i+30,false)+'</gpx>');
    elevenFilePaths.push(f);
  }
  const tenFilePaths=elevenFilePaths.slice(0,10);
  await ev(()=>{openTrackModal();renderTrackAll();});
  check('Lower archive picker supports multiple files; upper current stays single',await ev(()=>{
    const lower=document.getElementById('trackArchiveFileInput');
    const upper=document.getElementById('trackFileInput');
    return !!lower && lower.multiple && !!upper && !upper.multiple &&
      document.getElementById('trackArchiveImportItems')!==null;
  }));
  const startState=await ev(()=>({
    archive:JSON.stringify(state.savedTracks),draft:JSON.stringify(state.track),
    waypoints:JSON.stringify(state.mapWaypoints),polygons:JSON.stringify(state.gisPolygons),
    features:JSON.stringify(state.gisTracks),raw:localStorage.getItem(STORAGE_KEY)
  }));
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',[fixtureGpx,fixtureKml,fixtureGeo,fixtureFour]);
  await until(()=>_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  const overview=await ev(()=>({
    count:_trackArchivePreview.items.length,files:_trackArchivePreview.files.length,
    names:_trackArchivePreview.items.map(x=>x.suggestedName),
    inputRows:document.querySelectorAll('#trackArchiveImportItems input').length,
    ignored:_trackArchivePreview.ignoredCount,
    paneVisible:!document.getElementById('trackArchiveImportPreview').hidden
  }));
  check('Four files produce ten separate preview rows',overview.count===10&&overview.files===4&&overview.inputRows===10&&overview.paneVisible,overview);
  check('Names from GPX/KML/GeoJSON maintained and duplicates suffixed',overview.names.some(x=>x.includes('GPX-Alfa'))&&overview.names.some(x=>x.includes('KML-Uno'))&&
    overview.names.some(x=>x.includes('GEO-Luno'))&&new Set(overview.names).size===10,overview.names);
  check('Point/present elevation counts shown separately',await ev(()=>[
    ...document.querySelectorAll('.track-batch-preview-item .hint')].length===10 &&
    document.querySelector('.track-batch-preview-item .hint')?.textContent.includes('quote')));
  check('Unrelated features are marked for exclusion',overview.ignored>0,overview);
  await screenshot('batch-ten-preview');
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:600,deviceScaleFactor:1,mobile:false});
  await sleep(130);
  check('Ten-row preview remains scrollable on short desktop',await ev(()=>{
    const list=document.getElementById('trackArchiveImportItems');
    const pane=document.getElementById('trackArchiveImportPreview');
    return !pane.hidden&&list.scrollHeight>list.clientHeight&&
      list.getBoundingClientRect().width>200 && list.clientHeight<=360;
  }));
  await screenshot('batch-ten-short-preview');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  const archiveCapResult=await ev(()=>{
    const backup=state.savedTracks.slice();
    state.savedTracks=Array.from({length:SAVED_TRACKS_CAP},(_,i)=>({
      id:'qa311-cap-'+i,name:'cap-'+i,points:[{id:'p1',lat:40,lon:9},{id:'p2',lat:40.1,lon:9.1}],
      savedAt:1,closed:false,visible:false
    }));
    const r=trackArchiveBatchPrevalidate(_trackArchivePreview);
    state.savedTracks=backup;
    return r.reason;
  });
  check('Archive capacity is prevalidated before mutation',archiveCapResult==='archive_full',archiveCapResult);
  await ev(()=>{window.__qaCancelClickCount=0; document.getElementById('trackArchiveImportCancel').addEventListener('click',()=>{window.__qaCancelClickCount++;},{once:true});});
  await click('#trackArchiveImportCancel');
  await sleep(300);
  const cancelState = await ev((start)=>{
    const nowRaw = localStorage.getItem(STORAGE_KEY);
    const baseRaw = start.raw;
    const before = baseRaw ? JSON.parse(baseRaw) : null;
    const after = nowRaw ? JSON.parse(nowRaw) : null;
    return {
      archive: JSON.stringify(state.savedTracks)===start.archive,
      draft: JSON.stringify(state.track)===start.draft,
      waypoints: JSON.stringify(state.mapWaypoints)===start.waypoints,
      raw: nowRaw===baseRaw,
      previewCleared: _trackArchivePreview===null,
      clickCount: window.__qaCancelClickCount,
      phase: _trackArchivePreview?.phase||null,
      paneHidden: document.getElementById('trackArchiveImportPreview').hidden,
      generation: _trackArchiveGeneration,
      rawBeforeLength: baseRaw?.length||0,
      rawAfterLength: nowRaw?.length||0,
      rawTopLevelChanged: JSON.stringify(Object.keys(before||{}))!==JSON.stringify(Object.keys(after||{})),
      settingsBefore: JSON.stringify(before?.settings||{}).slice(0,500),
      settingsAfter: JSON.stringify(after?.settings||{}).slice(0,500)
    };
  },startState);
  check('Cancelling preview leaves archive/draft/raw storage unchanged',
    cancelState.archive&&cancelState.draft&&cancelState.waypoints&&cancelState.raw&&cancelState.previewCleared,cancelState);
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',[fixtureEleven]);
  await until(()=>document.getElementById('trackArchiveImportStatus').textContent.includes('Massimo'));
  check('Eleven paths inside one file fail without changes',await ev((start)=>_trackArchivePreview===null &&
    document.getElementById('trackArchiveImportPreview').hidden &&
    JSON.stringify(state.savedTracks)===start.archive&&localStorage.getItem(STORAGE_KEY)===start.raw,startState));
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',elevenFilePaths);
  await until(()=>document.getElementById('trackArchiveImportStatus').textContent.includes('Massimo'));
  check('Eleven selected files rejected atomically',await ev((start)=>_trackArchivePreview===null &&
    JSON.stringify(state.savedTracks)===start.archive&&localStorage.getItem(STORAGE_KEY)===start.raw,startState));
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',[fixtureInvalid]);
  await until(()=>document.getElementById('trackArchiveImportStatus').textContent.includes('non valide'));
  check('Invalid coordinate aborts batch without partial import',await ev((start)=>
    state.savedTracks.length===0&&localStorage.getItem(STORAGE_KEY)===start.raw,startState));
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',[fixtureGpx,fixtureKml,fixtureGeo,fixtureFour]);
  await until(()=>_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  await fill('#trackArchiveBatchName0',' ');
  await click('#trackArchiveImportApply');
  check('Blank track name blocks batch with no storage mutation',await ev((start)=>
    _trackArchivePreview?.phase==='preview'&&state.savedTracks.length===0&&
    localStorage.getItem(STORAGE_KEY)===start.raw,startState));
  await fill('#trackArchiveBatchName0','QA311 Personalizzata');
  const preConfirm = await ev(()=>({
    files:_trackArchivePreview.files.length,tracks:_trackArchivePreview.items.length,
    heights:_trackArchivePreview.items.map(x=>x.heights),names:[...document.querySelectorAll('#trackArchiveImportItems input')].map(i=>i.value)
  }));
  check('Editable names and mixed original altitude survive pre-confirmation',preConfirm.names[0]==='QA311 Personalizzata'&&preConfirm.heights.some(v=>v>0)&&preConfirm.heights.some(v=>v===0),preConfirm);
  await click('#trackArchiveImportApply');
  await until(()=>state.savedTracks.length===10&&_trackArchivePreview===null);
  check('Ten tracks saved individually, all initially hidden',await ev(()=>
    state.savedTracks.length===10&&state.savedTracks.every(s=>s.visible===false)&&
    state.savedTracks[0].name==='QA311 Personalizzata'&&
    new Set(state.savedTracks.map(s=>s.id)).size===10));
  const cols=await ev(()=>({
   handles:[...document.querySelectorAll('.saved-tracks-table [data-saved-resize]')].map(e=>e.dataset.savedResize),
   headers:[...document.querySelectorAll('.saved-tracks-table [data-saved-sort]')].map(e=>e.dataset.savedSort),
   rows:document.querySelectorAll('.saved-tracks-table tbody tr[data-saved-row]').length,
   xscroll:document.querySelector('.saved-tracks-scroll-inner')?.scrollWidth>
     document.querySelector('.saved-tracks-scroll-inner')?.clientWidth
  }));
  check('P2-A all seven columns have resizing handles',cols.handles.join(',')==='sel,vis,name,pts,when,dist,actions',cols);
  check('P2-A five existing sort headers retained',cols.headers.join(',')==='vis,name,pts,when,dist',cols);
  check('P2-A all row and select-all checkboxes retained',await ev(()=>
   document.querySelectorAll('.saved-sel-cb').length===10&&!!document.getElementById('savedTracksSelectAll')));
  const colsStart=await ev(()=>({
   tracks:JSON.stringify(state.savedTracks),
   draft:JSON.stringify(state.track),
   waypoint:JSON.stringify(state.mapWaypoints),
   polygons:JSON.stringify(state.gisPolygons)
  }));
  let dragsPass=true;
  const dragRecords=[];
  for(const key of ['sel','vis','name','pts','when','dist','actions']){
   await dragSavedColumn(key,24);
   const r=await ev(k=>{
    const table=document.querySelector('.saved-tracks-table');
    const v=state._savedTracksColumnWidths?.[k];
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {key:k,current:v,persisted:raw?.settings?.savedTracksColumnWidths?.[k],
      css:table?.style.getPropertyValue('--saved-'+k+'-col'),
      hasRaw:!!raw?.settings?.savedTracksColumnWidths};
   },key);
   dragRecords.push(r);
   dragsPass=dragsPass&&typeof r.current==='number'&&r.current===r.persisted&&
     r.css.trim()===String(r.current)+'px';
  }
  check('P2-A seven native drag gestures persist 7 column widths',dragsPass,dragRecords);
  const pers=await ev(()=>{
    const w=state._savedTracksColumnWidths||{};
    return {widths:{...w},raw:JSON.parse(localStorage.getItem(STORAGE_KEY)).settings.savedTracksColumnWidths};
  });
  check('P2-A width preferences strictly whitelisted numeric',await ev(()=>{
    const v=savedTracksSanitizeColumnWidths({sel:-5,vis:Infinity,name:'500',pts:700,
     when:92.6,dist:95,actions:NaN,evil:100});
    return v.sel===36&&!('vis'in v)&&!('name'in v)&&v.pts===180&&v.when===93&&
     !('actions'in v)&&!('evil'in v);
  }));
  await click('#savedTracksMount [data-saved-sort="name"]');
  const sort1=await ev(()=>({...state._savedTracksSort}));
  await click('#savedTracksMount [data-saved-sort="name"]');
  const sort2=await ev(()=>({...state._savedTracksSort}));
  check('P2-A name sort toggles asc/desc',sort1.key==='name'&&sort1.dir==='asc'&&
   sort2.key==='name'&&sort2.dir==='desc',{sort1,sort2});
  let otherSorts=true;
  for(const key of ['vis','pts','when','dist']){
   await click('#savedTracksMount [data-saved-sort="'+key+'"]');
   const val=await ev(()=>({...state._savedTracksSort}));
   otherSorts=otherSorts&&val.key===key&&val.dir==='desc';
  }
  check('P2-A state sort supports vis, pts, date, distance',otherSorts);
  check('P2-A sort stored under canonical settings',await ev(()=>{
   const j=JSON.parse(localStorage.getItem(STORAGE_KEY));
   return j.settings.savedTracksSort.key==='dist'&&j.settings.savedTracksSort.dir==='desc';
  }));
  await click('#savedTracksMount .saved-sel-cb[data-saved-sel]');
  check('P2-A one row select remains functional',await ev(()=>state._savedTracksSelectedIds?.length===1));
  await click('#savedTracksSelectAll');
  check('P2-A select all remains functional',await ev(()=>state._savedTracksSelectedIds?.length===10));
  await click('#savedTracksSelectAll');
  check('P2-A deselect all remains functional',await ev(()=>state._savedTracksSelectedIds?.length===0));
  check('P2-A sorting and resizing never change geographic data',await ev((start)=>
    JSON.stringify(state.savedTracks)===start.tracks &&
    JSON.stringify(state.track)===start.draft &&
    JSON.stringify(state.mapWaypoints)===start.waypoint &&
    JSON.stringify(state.gisPolygons)===start.polygons,colsStart));
  const preQuota=await ev(()=>({w:JSON.stringify(state._savedTracksColumnWidths),raw:localStorage.getItem(STORAGE_KEY)}));
  await ev(()=>{
    window.__qaP2OldSet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){
      if(k===STORAGE_KEY)throw Error('QA P2 simulated quota');
      return window.__qaP2OldSet.call(this,k,v);
    };
  });
  await dragSavedColumn('name',22);
  const afterQuota=await ev((prev)=>({
    widths:JSON.stringify(state._savedTracksColumnWidths)===prev.w,
    raw:localStorage.getItem(STORAGE_KEY)===prev.raw,
    errorVisible:!!document.getElementById('trackArchiveImportStatus')?.textContent
  }),preQuota);
  await ev(()=>{Storage.prototype.setItem=window.__qaP2OldSet;});
  check('P2-A failed preference write rolls back without touching stored GIS data',
    afterQuota.widths&&afterQuota.raw&&afterQuota.errorVisible,afterQuota);
  await screenshot('p2a-all-columns');
  const expectedWidths=await ev(()=>({...state._savedTracksColumnWidths}));
  const expectedSort=await ev(()=>({...state._savedTracksSort}));
  await send('Page.reload',{ignoreCache:true});await ready();
  await ev(()=>{openTrackModal();});
  check('P2-A all widths and last sort survive full reload',await ev((w,s)=>{
   const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
   const table=document.querySelector('.saved-tracks-table');
   return Object.keys(SAVED_TRACKS_COLUMN_SPECS).every(k=>
      w[k]===state._savedTracksColumnWidths[k]&&raw.settings.savedTracksColumnWidths[k]===w[k]&&
      table.style.getPropertyValue('--saved-'+k+'-col')===w[k]+'px')&&
      JSON.stringify(state._savedTracksSort)===JSON.stringify(s);
  },expectedWidths,expectedSort));
  check('Distinct geometry not fused, originals include partial heights',await ev(()=>{
    const tracks=state.savedTracks;
    const p=tracks[0],vals=p.importedElevations?.heights||[];
    return p.points.length===3&&vals.length===3&&vals[0]===100&&vals[1]===null&&vals[2]===200&&
      tracks.some(x=>!x.importedElevations)&&tracks.every(x=>x.points.length>=2);
  }));
  check('Atomic persistence read-back of all ten tracks',await ev(()=>state.savedTracks.every(st=>
    trackVerifyPersistedSavedTrack(st)&&savedTrackReadPersistedById(st.id)?.visible===false)));
  check('Batch import cannot mutate draft, waypoints, polygons or GIS objects',await ev((start)=>
    JSON.stringify(state.track)===start.draft&&JSON.stringify(state.mapWaypoints)===start.waypoints&&
    JSON.stringify(state.gisPolygons)===start.polygons&&JSON.stringify(state.gisTracks)===start.features,startState));
  const mapBefore=await ev(()=>({lat:state.viewCenter?.lat,lon:state.viewCenter?.lon,visible:state.savedTracks.filter(x=>x.visible).length}));
  check('No imported track auto-visible on map',mapBefore.visible===0,mapBefore);
  await screenshot('batch-ten-imported');
  const persistedNames=await ev(()=>state.savedTracks.map(s=>s.name));
  await send('Page.reload',{ignoreCache:true});await ready();
  await ev(()=>{openTrackModal();});
  check('Ten separate hidden saved tracks survive browser reload',await ev((expected)=>
    state.savedTracks.length===10 && state.savedTracks.every(s=>s.visible===false)&&
    state.savedTracks.map(s=>s.name).every((x,i)=>x===expected[i]),persistedNames));
  check('Partial GPX heights preserved through save/reload',await ev(()=>{
    const x=state.savedTracks.find(s=>s.name==='QA311 Personalizzata');
    return x&&JSON.stringify(x.importedElevations.heights)==='[100,null,200]';
  }));
  const beforePartialFailure=await ev(()=>({
    archive:JSON.stringify(state.savedTracks),raw:localStorage.getItem(STORAGE_KEY)
  }));
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',[fixtureGeo]);
  await until(()=>_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  await ev(()=>{
    window.__qa311OrigAdd=window.savedTrackAddFromPoints;
    window.__qa311NumAdds=0;
    window.savedTrackAddFromPoints=function(...args){
      window.__qa311NumAdds++;
      if(window.__qa311NumAdds===3)throw Error('QA third track failure');
      return window.__qa311OrigAdd(...args);
    };
  });
  await click('#trackArchiveImportApply');
  await until(()=>document.getElementById('trackArchiveImportStatus').textContent.includes('ripristinati'));
  check('Third-track failure leaves no partial import',await ev((prev)=>
    JSON.stringify(state.savedTracks)===prev.archive &&
    localStorage.getItem(STORAGE_KEY)===prev.raw,beforePartialFailure));
  await ev(()=>{window.savedTrackAddFromPoints=window.__qa311OrigAdd;});
  await click('#trackArchiveImportCancel');
  const beforeReadbackFailure=await ev(()=>({
    archive:JSON.stringify(state.savedTracks),raw:localStorage.getItem(STORAGE_KEY)
  }));
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',[fixtureGeo]);
  await until(()=>_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  await ev(()=>{
    window.__qa311OrigVerify=window.trackVerifyPersistedSavedTrack;
    window.trackVerifyPersistedSavedTrack=function(){return false;};
  });
  await click('#trackArchiveImportApply');
  await until(()=>document.getElementById('trackArchiveImportStatus').textContent.includes('ripristinati'));
  check('Readback failure restores previously written raw storage',await ev((prev)=>
    JSON.stringify(state.savedTracks)===prev.archive&&
    localStorage.getItem(STORAGE_KEY)===prev.raw,beforeReadbackFailure));
  await ev(()=>{window.trackVerifyPersistedSavedTrack=window.__qa311OrigVerify;});
  await click('#trackArchiveImportCancel');
  const beforeFailure=await ev(()=>({
    archive:JSON.stringify(state.savedTracks),draft:JSON.stringify(state.track),
    waypoints:JSON.stringify(state.mapWaypoints),polygons:JSON.stringify(state.gisPolygons),
    raw:localStorage.getItem(STORAGE_KEY)
  }));
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',[fixtureGeo]);
  await until(()=>_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  await ev(()=>{window.__qa311SetItem=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){if(k===STORAGE_KEY)throw Error('QA simulated quota failure');
      return window.__qa311SetItem.call(this,k,v);};
  });
  await click('#trackArchiveImportApply');
  await until(()=>_trackArchivePreview&&_trackArchivePreview.phase==='preview'&&
    document.getElementById('trackArchiveImportStatus').textContent.includes('ripristinati'));
  check('Quota failure triggers full in-memory and storage rollback',await ev((prev)=>
    JSON.stringify(state.savedTracks)===prev.archive&&JSON.stringify(state.track)===prev.draft&&
    JSON.stringify(state.mapWaypoints)===prev.waypoints&&
    JSON.stringify(state.gisPolygons)===prev.polygons&&localStorage.getItem(STORAGE_KEY)===prev.raw,beforeFailure));
  await ev(()=>{Storage.prototype.setItem=window.__qa311SetItem;});
  await click('#trackArchiveImportCancel');
  await click('#btnTrackArchiveImport');
  await files('#trackArchiveFileInput',tenFilePaths);
  await until(()=>_trackArchivePreview&&_trackArchivePreview.phase==='preview');
  check('Ten separate file selection previews exactly ten traces',await ev(()=>
    _trackArchivePreview.files.length===10&&_trackArchivePreview.items.length===10));
  await click('#trackArchiveImportApply');
  await until(()=>state.savedTracks.length===20&&_trackArchivePreview===null);
  check('Ten file batch persists as ten additional hidden tracks',await ev(()=>
    state.savedTracks.length===20&&state.savedTracks.every(st=>st.visible===false)&&
    state.savedTracks.every(st=>trackVerifyPersistedSavedTrack(st))));
  check('Archive list offers explicit Show and Center controls',await ev(()=>!!document.querySelector(
    '#savedTracksMount [data-saved-fly]')&& !!document.querySelector('#savedTracksMount [data-saved-sel]')));
  await ev(()=>{state.savedTracks.slice(0,1).forEach(st=>st.visible=true);saveStoreReported();renderSavedTracksList();});
  check('Explicit Show can change visibility independently',await ev(()=>
    state.savedTracks.filter(s=>s.visible).length===1&&state.savedTracks.length===20));
  await click('#btnTrackImport');
  await file('#trackFileInput',fixtureGpx);
  await until(()=>state.track.points.length===3);
  check('Upper import remains one current editable trace, archive unchanged',await ev(()=>
    !document.getElementById('trackFileInput').multiple&&state.track.points.length===3&&
    state.savedTracks.length===20));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await sleep(140);
  check('Desktop batch UI absent from mobile layout',await ev(()=>
    document.getElementById('trackSimpleUi').hidden ||
    document.getElementById('trackArchiveFileInput').getClientRects().length===0));
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await sleep(100);
  const polygonRoundtrip=await ev(()=>{
    const f={type:'Feature',properties:{name:'P2A-QA-Polygon'},
      geometry:{type:'Polygon',coordinates:[[[9,44],[9.1,44],[9.1,44.1],[9,44]]]}};
    const created=gisFeatureAdd('polygon',f,{recordUndo:false});
    const saved=saveStoreReported();
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
    const exp=gisAllAsFeatureCollection({});
    const exported=exp.features.find(x=>x&&x.id===created?.id&&x.geometry?.type==='Polygon');
    const parsed=exported?spatialNormalizeGeoJSON(exported):null;
    const cls=parsed?gisImportHubClassifyFeatureCollection(parsed):null;
    return {id:created?.id,valid:!!created&&!!saved?.ok&&
      !!raw.gisPolygons?.some(x=>x.id===created.id)&&
      !!exported&&!!cls&&cls.polygons===1&&cls.payload.polygons.length===1,
      geom:created?.geometry};
  });
  check('P2-A polygon retains valid geometry through save, export and import parser',
    polygonRoundtrip.valid,polygonRoundtrip);
  await send('Page.reload',{ignoreCache:true});await ready();
  check('P2-A polygon remains unchanged after reload with table preferences',
    await ev(p=>state.gisPolygons?.some(x=>x.id===p.id&&
      JSON.stringify(x.geometry)===JSON.stringify(p.geom)),polygonRoundtrip));
  // P2-B1 waypoint table: preserve canonical geometry and every existing action.
  const wpFixture=await ev(()=>{
    ensureMapWaypointsState();
    const labels=[
      {lat:44.30,lon:9.41,name:'WP-Zeta',when:1700000004000},
      {lat:43.90,lon:9.31,name:'WP-Alfa',when:1700000001000},
      {lat:44.12,lon:9.21,name:'WP-Delta',when:1700000003000},
      {lat:44.01,lon:9.51,name:'WP-Beta',when:1700000002000}
    ];
    for(const f of labels){
      if(!waypointAdd(f.lat,f.lon,f.name,{icon:'hq'}))throw Error('waypointAdd fixture');
      const last=state.mapWaypoints[state.mapWaypoints.length-1];
      last.updatedAt=f.when;last.createdAt=f.when;
    }
    if(!saveStoreReported()?.ok)throw Error('wp fixture not persisted');
    openWaypointModal();
    return {ids:state.mapWaypoints.map(x=>x.id),
      points:JSON.stringify(state.mapWaypoints),polygons:JSON.stringify(state.gisPolygons),
      saved:JSON.stringify(state.savedTracks)};
  });
  await until(()=>document.querySelectorAll('#wp-list .wp-modal-table tbody tr[data-wp-row]').length===state.mapWaypoints.length);
  const wpSummary=await ev(()=>({
    handles:[...document.querySelectorAll('#wp-list .wp-modal-table [data-wp-col-resize]')].map(x=>x.dataset.wpColResize),
    sort:[...document.querySelectorAll('#wp-list [data-wp-table-sort]')].map(x=>x.dataset.wpTableSort),
    rows:[...document.querySelectorAll('#wp-list tr[data-wp-row]')].map(x=>x.dataset.id),
    sel:!!document.getElementById('wpSelectAll'),
    actions:document.querySelectorAll('#wp-list [data-role="wp-edit"]').length
  }));
  check('P2-B1 Waypoint all six columns have resize handles',
    wpSummary.handles.join(',')==='sel,vis,name,when,details,actions',wpSummary);
  check('P2-B1 sortable fields are name, date and numeric coordinates',
    wpSummary.sort.join(',')==='name,when,details',wpSummary);
  check('P2-B1 waypoint selection, actions and identities preserved',
    wpSummary.rows.length===wpFixture.ids.length&&wpSummary.sel&&wpSummary.actions===wpFixture.ids.length&&
    wpSummary.rows.every(id=>wpFixture.ids.includes(id)),wpSummary);
  let wpAllDragged=true;const wpDrags=[];
  for(const key of ['sel','vis','name','when','details','actions']){
    await dragWpColumn(key,24);
    const v=await ev(k=>{
      const store=JSON.parse(localStorage.getItem(STORAGE_KEY));
      const table=document.querySelector('.wp-modal-table');
      return {key:k,v:state._wpTableColumnWidths?.[k],stored:store.settings.wpTableColumnWidths?.[k],
        css:table.style.getPropertyValue('--wp-'+k+'-col')};
    },key);
    wpDrags.push(v);
    wpAllDragged=wpAllDragged&&typeof v.v==='number'&&v.v===v.stored&&v.css===v.v+'px';
  }
  check('P2-B1 6/6 actual pointer drags persist widths',wpAllDragged,wpDrags);
  check('P2-B1 numeric width whitelist rejects malformed values',await ev(()=>{
    const a=wpTableSanitizeWidths({sel:0,vis:Infinity,name:'300',when:93.5,details:99999,actions:NaN,unlisted:99});
    return a.sel===36&&!('vis'in a)&&!('name'in a)&&a.when===94&&
      a.details===620&&!('actions'in a)&&!('unlisted'in a);
  }));
  await click('#wp-list [data-wp-table-sort="name"]');
  const nameAsc=await ev(()=>({sort:{...state._wpTableSort},names:[...document.querySelectorAll('#wp-list [data-wp-row]')].map(tr=>{
    const id=tr.dataset.id;return state.mapWaypoints.find(x=>x.id===id).name;
  })}));
  check('P2-B1 sort name ascending uses locale text comparison',
    nameAsc.sort.key==='name'&&nameAsc.sort.dir==='asc'&&
    nameAsc.names.filter(n=>n.startsWith('WP-')).join(',')==='WP-Alfa,WP-Beta,WP-Delta,WP-Zeta',nameAsc);
  await click('#wp-list [data-wp-table-sort="name"]');
  const nameDesc=await ev(()=>({...state._wpTableSort}));
  check('P2-B1 repeated name click reverses sort direction',
    nameDesc.key==='name'&&nameDesc.dir==='desc',nameDesc);
  await click('#wp-list [data-wp-table-sort="details"]');
  const numericOrder=await ev(()=>({
    sort:{...state._wpTableSort},
    coords:[...document.querySelectorAll('#wp-list [data-wp-row]')].map(tr=>state.mapWaypoints.find(x=>x.id===tr.dataset.id).lat)
  }));
  check('P2-B1 details sort uses numeric latitude then longitude',
    numericOrder.sort.key==='details'&&numericOrder.sort.dir==='asc'&&
    numericOrder.coords.filter(n=>[43.9,44.01,44.12,44.3].includes(n)).join(',')==='43.9,44.01,44.12,44.3',numericOrder);
  await click('#wp-list [data-wp-table-sort="when"]');
  const whenDesc=await ev(()=>({
    sort:{...state._wpTableSort},
    dates:[...document.querySelectorAll('#wp-list [data-wp-row]')].map(tr=>state.mapWaypoints.find(x=>x.id===tr.dataset.id).updatedAt)
  }));
  check('P2-B1 dates sort descending by numeric timestamp',whenDesc.sort.key==='when'&&
    whenDesc.sort.dir==='desc'&&whenDesc.dates.filter(n=>[1700000004000,1700000003000,1700000002000,1700000001000].includes(n)).join(',')==='1700000004000,1700000003000,1700000002000,1700000001000',whenDesc);
  await click('#wp-list .wp-sel-cb[data-wp-sel]');
  check('P2-B1 one selected waypoint is tracked by stable ID',await ev(()=>waypointModalSelectedRowIds.size===1));
  await click('#wpSelectAll');
  check('P2-B1 checkbox Select all remains functional',await ev(()=>waypointModalSelectedRowIds.size===state.mapWaypoints.length));
  await click('#wpSelectAll');
  check('P2-B1 checkbox Deselect all remains functional',await ev(()=>waypointModalSelectedRowIds.size===0));
  check('P2-B1 waypoint sort and resize preserve canonical geometry and other stores',
    await ev(prev=>JSON.stringify(state.mapWaypoints)===prev.points&&
      JSON.stringify(state.gisPolygons)===prev.polygons&&
      JSON.stringify(state.savedTracks)===prev.saved,wpFixture));
  const beforeFail=await ev(()=>({
    widths:JSON.stringify(state._wpTableColumnWidths),
    sort:JSON.stringify(state._wpTableSort),
    raw:localStorage.getItem(STORAGE_KEY)
  }));
  await ev(()=>{
    window.__qaWpOldSet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){
      if(k===STORAGE_KEY)throw Error('P2B1 simulated quota');
      return window.__qaWpOldSet.call(this,k,v);
    };
  });
  await dragWpColumn('name',25);
  const afterWidthFail=await ev(prev=>({
    sameWidths:JSON.stringify(state._wpTableColumnWidths)===prev.widths,
    sameRaw:localStorage.getItem(STORAGE_KEY)===prev.raw
  }),beforeFail);
  check('P2-B1 failing width save restores raw store and previous preference',
    afterWidthFail.sameWidths&&afterWidthFail.sameRaw,afterWidthFail);
  const sortResult=await ev(()=>wpTableApplySort('name'));
  check('P2-B1 failing sort save restores previous state and raw storage',
    sortResult===false&&await ev(prev=>
      JSON.stringify(state._wpTableSort)===prev.sort &&
      localStorage.getItem(STORAGE_KEY)===prev.raw,beforeFail));
  await ev(()=>{Storage.prototype.setItem=window.__qaWpOldSet;});
  await screenshot('p2b1-waypoint-all-columns');
  const prefsBeforeReload=await ev(()=>({
    widths:{...state._wpTableColumnWidths},sort:{...state._wpTableSort}
  }));
  await send('Page.reload',{ignoreCache:true});await ready();
  await ev(()=>openWaypointModal());
  await until(()=>document.querySelectorAll('#wp-list [data-wp-row]').length===state.mapWaypoints.length);
  check('P2-B1 six widths and sort survive full reload',
    await ev(p=>{
      const w=state._wpTableColumnWidths,store=JSON.parse(localStorage.getItem(STORAGE_KEY));
      const table=document.querySelector('.wp-modal-table');
      return Object.keys(WP_TABLE_COL_SPECS).every(k=>
        w[k]===p.widths[k]&&store.settings.wpTableColumnWidths[k]===p.widths[k]&&
        table.style.getPropertyValue('--wp-'+k+'-col')===p.widths[k]+'px') &&
        JSON.stringify(state._wpTableSort)===JSON.stringify(p.sort);
    },prefsBeforeReload));
  check('P2-B1 waypoint IDs, coordinates remain unchanged after reload',
    await ev(p=>JSON.stringify(state.mapWaypoints)===p.points,wpFixture));
  // Mobile is paused: do not surface new buttons/handles and do not sort the mobile table.
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await sleep(140);
  await ev(()=>renderWpModalList());
  check('P2-B1 mobile hides new sort buttons and column handles',
    await ev(()=>document.querySelectorAll('#wp-list [data-wp-table-sort]').length===0&&
      [...document.querySelectorAll('#wp-list [data-wp-col-resize]')].every(e=>
        getComputedStyle(e).display==='none')));
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await sleep(120);
  await ev(()=>renderWpModalList());
  check('P2-B1 desktop sorting restored after mobile viewport',
    await ev(()=>document.querySelectorAll('#wp-list [data-wp-table-sort]').length===3));
  // P2-B2 polygon table. The QA uses synthetic features on its isolated storage origin.
  await ev(()=>{if(state.waypointsModalOpen)closeWaypointModal();});
  const polyFixture=await ev(()=>{
    ensureGisState();
    const rows=[
      {name:'P2B2-Zeta',lat:44.31,lon:9.11,visible:false,ts:'2024-01-04T10:00:00.000Z'},
      {name:'P2B2-Alfa',lat:44.12,lon:9.28,visible:true,ts:'2024-01-01T10:00:00.000Z'},
      {name:'P2B2-Beta',lat:44.23,lon:9.35,visible:false,ts:'2024-01-03T10:00:00.000Z'},
      {name:'P2B2-Delta',lat:44.01,lon:9.48,visible:true,ts:'2024-01-02T10:00:00.000Z'}
    ];
    const created=[];
    for(let i=0;i<rows.length;i++){
      const r=rows[i], d=.01+.002*i;
      const feat={type:'Feature',
        properties:{name:r.name,visible:r.visible,created_at:r.ts,updated_at:r.ts},
        geometry:{type:'Polygon',coordinates:[[[r.lon,r.lat],[r.lon+d,r.lat],[r.lon+d,r.lat+d],[r.lon,r.lat+d],[r.lon,r.lat]]]}};
      const c=gisFeatureAdd('polygon',feat,{recordUndo:false});
      if(!c||!c.id)throw Error('polygon fixture create '+i);
      created.push(c.id);
    }
    if(!saveStoreReported()?.ok)throw Error('polygon fixture save failed');
    openPolygonPanel();
    return {ids:created,
      polygon:JSON.stringify(state.gisPolygons),
      savedTracks:JSON.stringify(state.savedTracks),
      mapWaypoints:JSON.stringify(state.mapWaypoints),
      gisTracks:JSON.stringify(state.gisTracks)};
  });
  await until(()=>document.querySelectorAll('#polygonPanelList tr[data-poly-row]').length===state.gisPolygons.length);
  const polySummary=await ev(()=>({
    handles:[...document.querySelectorAll('#polygonPanelList [data-poly-resize]')].map(x=>x.dataset.polyResize),
    sort:[...document.querySelectorAll('#polygonPanelList [data-poly-sort]')].map(x=>x.dataset.polySort),
    rows:[...document.querySelectorAll('#polygonPanelList tr[data-poly-row]')].map(x=>x.dataset.polyId),
    selectAll:!!document.getElementById('polygonPanelSelectAll'),
    editActions:document.querySelectorAll('#polygonPanelList [data-role="poly-edit"]').length
  }));
  check('P2-B2 polygon all nine columns offer resizing handles',
    polySummary.handles.join(',')==='sel,vis,name,vtx,area,perim,style,when,actions',polySummary);
  check('P2-B2 polygon six meaningful sort columns are retained',
    polySummary.sort.join(',')==='vis,name,vtx,area,perim,when',polySummary);
  check('P2-B2 polygon row IDs and existing edit/actions retained',
    polySummary.rows.length>=polyFixture.ids.length&&polySummary.selectAll&&
    polySummary.editActions===polySummary.rows.length&&
    polyFixture.ids.every(id=>polySummary.rows.includes(id)),polySummary);
  let dragPass=true;const polygonDrags=[];
  for(const key of ['sel','vis','name','vtx','area','perim','style','when','actions']){
    await dragPolyColumn(key,20);
    const entry=await ev(k=>{
      const v=state._polygonPanelColumnWidths?.[k];
      const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
      const tbl=document.querySelector('.poly-list-table');
      return {key:k,v,raw:raw?.settings?.polygonPanelColumnWidths?.[k],
        css:tbl.style.getPropertyValue('--poly-'+k+'-col'),
        minWidth:tbl.style.minWidth};
    },key);
    polygonDrags.push(entry);
    dragPass=dragPass&&typeof entry.v==='number'&&entry.v===entry.raw&&entry.css===entry.v+'px';
  }
  check('P2-B2 9/9 native resize gestures and persistence verified',dragPass,polygonDrags);
  check('P2-B2 numeric whitelist clamps, rejects invalid values and unknown keys',await ev(()=>{
    const w=polygonPanelSanitizeColumnWidths({sel:0,vis:Infinity,name:'200',vtx:500,
      area:77.8,perim:66,style:NaN,when:75,actions:1500,evil:90});
    return w.sel===36&&!('vis'in w)&&!('name'in w)&&w.vtx===120&&w.area===78&&
      !('style'in w)&&w.actions===480&&!('evil'in w);
  }));
  const sortKeys=['vis','name','vtx','area','perim','when'];
  let sortCorrect=true;const sortEvents=[];
  for(const key of sortKeys){
    await click('#polygonPanelList [data-poly-sort="'+key+'"]');
    const first=await ev(()=>({...state._polygonPanelListSort}));
    await click('#polygonPanelList [data-poly-sort="'+key+'"]');
    const second=await ev(()=>({...state._polygonPanelListSort}));
    sortEvents.push({key,first,second});
    sortCorrect=sortCorrect&&first.key===key&&second.key===key&&first.dir!==second.dir;
  }
  check('P2-B2 polygon six headers toggle asc/desc on repeat click',sortCorrect,sortEvents);
  check('P2-B2 polygon sort preference stored in canonical settings',await ev(()=>{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
    return raw.settings.polygonPanelSort.key===state._polygonPanelListSort.key &&
      raw.settings.polygonPanelSort.dir===state._polygonPanelListSort.dir;
  }));
  await ev(()=>{document.getElementById('polygonPanelList').scrollLeft=0;});
  await sleep(120);
  await click('#polygonPanelList .poly-sel-cb[data-poly-sel]');
  check('P2-B2 polygon single selection uses stable feature ID',await ev(()=>state._polygonPanelSelectedIds.length===1));
  await click('#polygonPanelSelectAll');
  check('P2-B2 polygon select all remains functional',await ev(()=>
    state._polygonPanelSelectedIds.length===state.gisPolygons.length));
  await click('#polygonPanelSelectAll');
  check('P2-B2 polygon deselect all remains functional',await ev(()=>state._polygonPanelSelectedIds.length===0));
  check('P2-B2 geometry and other canonical data unchanged by resize/sort',
    await ev(prev=>JSON.stringify(state.gisPolygons)===prev.polygon &&
      JSON.stringify(state.savedTracks)===prev.savedTracks &&
      JSON.stringify(state.mapWaypoints)===prev.mapWaypoints &&
      JSON.stringify(state.gisTracks)===prev.gisTracks,polyFixture));
  const beforeFailedWrite=await ev(()=>({
    widths:JSON.stringify(state._polygonPanelColumnWidths),
    sort:JSON.stringify(state._polygonPanelListSort),
    raw:localStorage.getItem(STORAGE_KEY)
  }));
  await ev(()=>{
    window.__qaPolySet=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){
      if(k===STORAGE_KEY)throw Error('P2B2 simulated QuotaExceeded');
      return window.__qaPolySet.call(this,k,v);
    };
  });
  await dragPolyColumn('name',25);
  const rollback=await ev(prev=>({
    widths:JSON.stringify(state._polygonPanelColumnWidths)===prev.widths,
    raw:localStorage.getItem(STORAGE_KEY)===prev.raw
  }),beforeFailedWrite);
  check('P2-B2 failed width write rolls back preference and raw storage',rollback.widths&&rollback.raw,rollback);
  await ev(()=>applyPolygonPanelListSortHeaderClick('name'));
  check('P2-B2 failed sort write restores old sort and storage',await ev(prev=>
    JSON.stringify(state._polygonPanelListSort)===prev.sort&&
    localStorage.getItem(STORAGE_KEY)===prev.raw,beforeFailedWrite));
  await ev(()=>{Storage.prototype.setItem=window.__qaPolySet;});
  await screenshot('p2b2-polygons-nine-columns');
  const pref=await ev(()=>({
    widths:{...state._polygonPanelColumnWidths},sort:{...state._polygonPanelListSort},
    polygons:JSON.stringify(state.gisPolygons)
  }));
  await send('Page.reload',{ignoreCache:true});await ready();
  await ev(()=>openPolygonPanel());
  await until(()=>document.querySelectorAll('#polygonPanelList tr[data-poly-row]').length===state.gisPolygons.length);
  check('P2-B2 nine column widths and polygon sort survive reload',await ev(p=>{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY));
    const widths=state._polygonPanelColumnWidths,table=document.querySelector('.poly-list-table');
    return Object.keys(POLYGON_PANEL_COLUMN_SPECS).every(k=>
      widths[k]===p.widths[k]&&raw.settings.polygonPanelColumnWidths[k]===p.widths[k]&&
      table.style.getPropertyValue('--poly-'+k+'-col')===p.widths[k]+'px')&&
      JSON.stringify(state._polygonPanelListSort)===JSON.stringify(p.sort);
  },pref));
  check('P2-B2 polygon geometries survive reload unchanged',
    await ev(p=>JSON.stringify(state.gisPolygons)===p.polygons,pref));
  check('P2-B2 polygon export and parser round-trip preserve geometry',await ev(()=>{
    const exported=gisAllAsFeatureCollection({});
    const polygons=exported.features.filter(x=>x&&x.geometry?.type==='Polygon');
    const normalized=spatialNormalizeGeoJSON(exported);
    const parsed=normalized?gisImportHubClassifyFeatureCollection(normalized):null;
    return polygons.length>=4&&!!parsed&&parsed.polygons===polygons.length&&
      parsed.payload.polygons.length===polygons.length;
  }));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await sleep(160);
  await ev(()=>renderPolygonPanelList());
  check('P2-B2 new selection resize handle hidden on mobile',await ev(()=>{
    const el=document.querySelector('.poly-sel-col-resize');
    return !el || getComputedStyle(el).display==='none';
  }));
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await sleep(130);
  await ev(()=>renderPolygonPanelList());
  check('No POST, browser exceptions, console errors',out.network.post===0&&
    out.exceptions.length===0&&out.consoleErrors.length===0,
    {post:out.network.post,exceptions:out.exceptions,consoleErrors:out.consoleErrors});
 }catch(e){out.fatal={message:e.message,stack:e.stack?.slice(0,1500)};console.log(JSON.stringify({fatal:out.fatal}));try{await screenshot('failure')}catch(_){}}
 finally{closing=true;try{if(ws&&ws.readyState===1&&qaOrigin){await send('Storage.clearDataForOrigin',{origin:qaOrigin,storageTypes:'all'});out.dataCleanup=await ev(()=>localStorage.length===0);}}catch(e){out.dataCleanup=false;out.dataCleanupError=e.message;}try{if(ws&&ws.readyState===1)await Promise.race([send('Browser.close'),sleep(1200)])}catch(_){}try{ws?.close()}catch(_){}for(const p of pend.values())clearTimeout(p.timer);pend.clear();if(browser&&!browser.killed)browser.kill();if(srv)await new Promise(r=>srv.close(r));await sleep(500);try{fs.rmSync(tmp,{recursive:true,force:true,maxRetries:2,retryDelay:100});out.cleanup=true}catch(e){out.cleanup=false;out.cleanupError=e.message}out.pass=!out.fatal&&out.checks.length>=17&&out.checks.every(x=>x.pass)&&out.dataCleanup;fs.writeFileSync(path.join(base,mode+'-qa314.json'),JSON.stringify(out,null,2));console.log(JSON.stringify({mode,pass:out.pass,checks:out.checks.length,passed:out.checks.filter(x=>x.pass).length,failed:out.checks.filter(x=>!x.pass),fatal:out.fatal,sha256:sha,nativeClicks:out.nativeClicks,fileChooserEvents:out.fileChooserEvents,exceptions:out.exceptions,consoleErrors:out.consoleErrors,screenshots:out.screenshots,dataCleanup:out.dataCleanup,profileDirectoryRemoved:out.cleanup}));process.exitCode=out.pass?0:1;}
})();
