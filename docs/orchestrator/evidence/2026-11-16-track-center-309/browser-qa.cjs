'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),http=require('http'),crypto=require('crypto'),{spawn}=require('child_process');
const base=process.env.GIS_QA_OUTPUT||__dirname, html=process.env.GIS_QA_HTML||path.join(base,'repo','coordinate_converter Claude.html'), bytes=fs.readFileSync(html),sha=crypto.createHash('sha256').update(bytes).digest('hex');
const mode=process.argv[2]||'candidate', tmp=fs.mkdtempSync(path.join(os.tmpdir(),'tmar-qa309-browser-')), profile=path.join(tmp,'profile');
const out={mode,build:309,sha256:sha,checks:[],exceptions:[],consoleErrors:[],network:{post:0,blocked:0,documentHashes:[]},nativeClicks:0,fileChooserEvents:0,screenshots:[]};
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
async function ready(){await until(()=>typeof APP_BUILD_NUM!=='undefined'&&APP_BUILD_NUM===309&&typeof openTrackModal==='function'&&document.readyState==='complete');}
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
   if(m.method==='Page.fileChooserOpened')out.fileChooserEvents++;
   if(m.method==='Network.requestWillBeSent'&&m.params.request?.method==='POST')out.network.post++;
   if(m.method==='Fetch.requestPaused'){const q=m.params,allow=q.request.method==='GET'&&q.request.url.startsWith(origin+'/gis');if(!allow)out.network.blocked++;send(allow?'Fetch.continueRequest':'Fetch.failRequest',allow?{requestId:q.requestId}:{requestId:q.requestId,errorReason:'BlockedByClient'}).catch(()=>{});}
  };
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Page.setInterceptFileChooserDialog',{enabled:true});await send('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}]});
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url:origin+'/gis?v='+sha.slice(0,8)});await ready();
  await ev(()=>{openTrackModal();renderTrackAll();});
  check('Centra visible in current actions and disabled for empty track',await ev(()=>{const b=document.getElementById('btnTrackCenterCurrent');return b.textContent==='Centra'&&b.disabled&&b.getClientRects().length>0&&document.getElementById('trackCurrentActions').contains(b);}));
  await click('#btnTrackImport');await file('#trackFileInput',current);await until(()=>state.track.points.length===198);
  await click('#btnTrackSaveLibrary');await until(()=>document.getElementById('trackSaveNameDialog').open);await fill('#trackSaveNameDialogInput','QA309 prima traccia');await click('#trackSaveNameDialogSaveBtn');
  check('First current track saved to archive by native controls',await ev(()=>state.savedTracks.length===1&&state.savedTracks[0].points.length===198));
  const far=path.join(base,'qa309-sydney.gpx');fs.writeFileSync(far,'<gpx version="1.1"><trk><name>QA309 Sydney</name><trkseg>'+[[-33.86,151.15,45],[-33.82,151.20,51],[-33.89,151.26,63]].map(p=>'<trkpt lat="'+p[0]+'" lon="'+p[1]+'"><ele>'+p[2]+'</ele></trkpt>').join('')+'</trkseg></trk></gpx>');
  await click('#btnTrackImport');await file('#trackFileInput',far);await until(()=>state.track.points.length===3&&state.track.points[0].lon===151.15);
  check('Second imported current track enables Centra without saving',await ev(()=>!document.getElementById('btnTrackCenterCurrent').disabled&&state.savedTracks.length===1&&state.track.points[0].lat===-33.86));
  await ev(()=>{window.__qaArchive=JSON.stringify(state.savedTracks);window.__qaGeometry=JSON.stringify(state.track.points);window.__qaHeights=JSON.stringify(state.track.importedElevations);state.viewCenter={lat:44,lon:9};state.mapZoom=12;renderTileMap(44,9,12);});
  const view=()=>{const root=document.getElementById('miniMap'),u=gisMapUsableRect(root),p=state.track.points,c=state.viewCenter;return {center:c,zoom:state.mapZoom,usable:u,inside:gisMapPtsInUsable(root,p,u,GIS_MAP_FIT_EDGE_PAD,trackLonsAlignToView(trackLonsUnwrapTransient(p.map(q=>q.lon)),c.lon),c,state.mapZoom)};};
  await click('#btnTrackCenterCurrent');await sleep(250);const fitted=await ev(view);
  check('Native Centra frames all Sydney points in map area beside panel',fitted.inside&&Math.abs(fitted.center.lat+33.85)<1&&Math.abs(fitted.center.lon-151.20)<2,fitted);
  check('Centering preserves archive, current geometry and original heights',await ev(()=>window.__qaArchive===JSON.stringify(state.savedTracks)&&window.__qaGeometry===JSON.stringify(state.track.points)&&window.__qaHeights===JSON.stringify(state.track.importedElevations)));
  await screenshot('centered-current');
  await click('#savedTracksMount [data-saved-fly]');const archivedView=await ev(()=>({...state.viewCenter}));
  await click('#btnTrackCenterCurrent');const returned=await ev(view);
  check('Saved-row Centra and current Centra target their own tracks',Math.abs(archivedView.lon-9)<2&&Math.abs(returned.center.lon-151.20)<2&&returned.inside,{archivedView,currentView:returned.center});
  await send('Emulation.setDeviceMetricsOverride',{width:1280,height:600,deviceScaleFactor:1,mobile:false});await sleep(150);await click('#btnTrackCenterCurrent');const shortFit=await ev(view);
  check('Short desktop keeps all current points in usable map area',shortFit.inside,shortFit);
  check('Centra remains visible without horizontal panel overflow',await ev(()=>{const b=document.getElementById('btnTrackCenterCurrent'),r=b.getBoundingClientRect(),panel=document.getElementById('trackModalBody');return r.width>0&&r.top>=0&&r.bottom<=innerHeight&&panel.scrollWidth<=panel.clientWidth+2;}));
  await screenshot('short-window');
  await ev(()=>{state.track.points=[{id:'qa309-d1',lat:10,lon:179.8},{id:'qa309-d2',lat:10.1,lon:-179.8},{id:'qa309-d3',lat:10.2,lon:-179.7}];state.track.closed=false;renderTrackAll();});
  await click('#btnTrackCenterCurrent');const dateLine=await ev(view);
  check('Dateline track uses short longitude span and stays framed',dateLine.inside&&Math.abs(dateLine.center.lon)>175&&dateLine.zoom>=7,dateLine);
  await ev(()=>{state.track.points=[{id:'qa309-single',lat:40.71,lon:-74.00}];renderTrackAll();});
  await click('#btnTrackCenterCurrent');const single=await ev(view);
  check('Single current point is centerable without archive save',single.inside&&Math.abs(single.center.lat-40.71)<1&&Math.abs(single.center.lon+74)<2,single);
  await ev(()=>{state.track.points=[];renderTrackAll();});
  check('Clearing current geometry disables Centra',await ev(()=>document.getElementById('btnTrackCenterCurrent').disabled));
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await sleep(120);
  check('Existing mobile layout hides desktop-only Centra',await ev(()=>document.getElementById('btnTrackCenterCurrent').getClientRects().length===0&&!!document.getElementById('btnTrackImport').closest('.track-toolbar')));
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});await sleep(120);
  check('Desktop restore has one Centra with unchanged archived geometry',await ev(()=>document.querySelectorAll('#btnTrackCenterCurrent').length===1&&window.__qaArchive===JSON.stringify(state.savedTracks)));
  check('Native file selectors used',out.fileChooserEvents>=2,{fileChooserEvents:out.fileChooserEvents,nativeClicks:out.nativeClicks});
  check('No POST requests',out.network.post===0,out.network.post);check('No JavaScript exceptions',out.exceptions.length===0,out.exceptions);check('No console errors',out.consoleErrors.length===0,out.consoleErrors);
 }catch(e){out.fatal={message:e.message,stack:e.stack?.slice(0,1500)};console.log(JSON.stringify({fatal:out.fatal}));try{await screenshot('failure')}catch(_){}}
 finally{closing=true;try{if(ws&&ws.readyState===1&&qaOrigin){await send('Storage.clearDataForOrigin',{origin:qaOrigin,storageTypes:'all'});out.dataCleanup=await ev(()=>localStorage.length===0);}}catch(e){out.dataCleanup=false;out.dataCleanupError=e.message;}try{if(ws&&ws.readyState===1)await Promise.race([send('Browser.close'),sleep(1200)])}catch(_){}try{ws?.close()}catch(_){}for(const p of pend.values())clearTimeout(p.timer);pend.clear();if(browser&&!browser.killed)browser.kill();if(srv)await new Promise(r=>srv.close(r));await sleep(500);try{fs.rmSync(tmp,{recursive:true,force:true,maxRetries:2,retryDelay:100});out.cleanup=true}catch(e){out.cleanup=false;out.cleanupError=e.message}out.pass=!out.fatal&&out.checks.length>=17&&out.checks.every(x=>x.pass)&&out.dataCleanup;fs.writeFileSync(path.join(base,mode+'-qa309.json'),JSON.stringify(out,null,2));console.log(JSON.stringify({mode,pass:out.pass,checks:out.checks.length,passed:out.checks.filter(x=>x.pass).length,failed:out.checks.filter(x=>!x.pass),fatal:out.fatal,sha256:sha,nativeClicks:out.nativeClicks,fileChooserEvents:out.fileChooserEvents,exceptions:out.exceptions,consoleErrors:out.consoleErrors,screenshots:out.screenshots,dataCleanup:out.dataCleanup,profileDirectoryRemoved:out.cleanup}));process.exitCode=out.pass?0:1;}
})();
