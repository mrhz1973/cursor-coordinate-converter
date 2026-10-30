// Isolated local browser profile, no remote network; exercises the real app DOM.
const {spawn}=require('child_process');const fs=require('fs');const path=require('path');const {pathToFileURL}=require('url');
const edge='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profile=path.join(__dirname,`edge-test-profile-${process.pid}-${Date.now()}`);
const portfile=path.join(profile,'DevToolsActivePort');
if(fs.existsSync(portfile))throw Error('Profile already used; choose a fresh profile directory');
const proc=spawn(edge,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking','--host-resolver-rules=MAP * ~NOTFOUND','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
  for(let n=0;n<600&&!fs.existsSync(portfile);n++)await sleep(100);
  if(!fs.existsSync(portfile))throw Error('Browser startup timeout');
  const port=Number(fs.readFileSync(portfile,'utf8').split(/\r?\n/)[0]);
  const pages=await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const ws=new WebSocket(pages.find(x=>x.type==='page').webSocketDebuggerUrl);
  await new Promise((ok,fail)=>{ws.onopen=ok;ws.onerror=fail});let id=0;const pending=new Map();
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const [ok,fail]=pending.get(m.id);pending.delete(m.id);m.error?fail(Error(JSON.stringify(m.error))):ok(m.result)}};
  const call=(method,params={})=>new Promise((ok,fail)=>{const n=++id;pending.set(n,[ok,fail]);ws.send(JSON.stringify({id:n,method,params}));});
  await call('Network.enable');await call('Network.setBlockedURLs',{urls:['http://*','https://*']});await call('Page.enable');
  await call('Page.navigate',{url:pathToFileURL('C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html').href});
  let ready=false;
  for(let n=0;n<600;n++){await sleep(100);let r=await call('Runtime.evaluate',{expression:'document.readyState === "complete" && typeof doConvert === "function" && !!document.getElementById("results")',returnByValue:true});if(r.result.value){ready=true;break}}
  if(!ready)throw Error('Application startup timeout');
  const expression=`(async()=>{
    const check=(c,m)=>{if(!c)throw Error(m)};
    state.geocodeReverseAuto=false;state.geocodeBatchLoc=false;state.persist=false;state.mapWaypoints=[];
    const $=id=>document.getElementById(id), formats=['default','dd','ddm','dms','utm','mgrs'];
    const fmt=v=>{const el=$('waypointListCoordFormat');el.value=v;el.dispatchEvent(new Event('change',{bubbles:true}));};
    const set=(id,v)=>{const el=$(id);el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));};
    const src=autoDetect('46 S 389603 6540383');
    function add(){check(waypointAdd(src.lat,src.lon,'Original',{icon:'hq',color:'#2563eb',notes:'old'},{allowNearDuplicate:true,utmSource:src.utm}),'add');return state.mapWaypoints[state.mapWaypoints.length-1];}
    const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    let cases=0;
    for(const from of formats)for(const to of formats){
      let p=add();state._waypointListCoordFormat=from;openWaypointEditor({id:p.id});fmt(to);
      const source=p.utmSource;waypointUpdateLatLon(p.id,44.123456789,8.987654321);
      const movedLat=p.lat,movedLon=p.lon;set('wpFieldName','Changed');commitWaypointEditor();
      check(!state.waypointEditorDraft&&p.name==='Changed'&&p.lat===movedLat&&p.lon===movedLon&&!p.utmSource,'move preserved '+from+' '+to);cases++;
      openWaypointEditor({id:p.id});waypointUpdate(p.id,{lat:src.lat,lon:src.lon,utmSource:source});set('wpFieldColor','#ff0000');commitWaypointEditor();
      check(!state.waypointEditorDraft&&p.lat===src.lat&&p.lon===src.lon&&same(p.utmSource,source)&&p.meta.color==='#ff0000','new UTM source preserved');cases++;
    }
    let p=add();p.meta.extra='legacy';openWaypointEditor({id:p.id});waypointUpdate(p.id,{name:'external',meta:{color:'#00ff00'}});set('wpFieldNotes','new notes');commitWaypointEditor();
    check(!state.waypointEditorDraft&&p.name==='external'&&p.meta.color==='#00ff00'&&p.meta.notes==='new notes'&&p.meta.extra==='legacy','independent fields merge');cases++;
    openWaypointEditor({id:p.id});set('wpFieldNotes','');commitWaypointEditor();check(!p.meta.notes&&p.meta.extra==='legacy','remove notes preserve metadata');cases++;
    openWaypointEditor({id:p.id});set('wpFieldName','mine');waypointUpdate(p.id,{name:'other'});commitWaypointEditor();
    check(!!state.waypointEditorDraft&&p.name==='other'&&$('wpFieldCoordFeedback').textContent.includes('modificat'),'name conflict blocks with visible message');closeWaypointEditor();cases++;
    openWaypointEditor({id:p.id});set('wpFieldCoord','46 S 389700 6540383');waypointUpdate(p.id,{lat:45,lon:9,utmSource:null});commitWaypointEditor();
    check(!!state.waypointEditorDraft&&p.lat===45&&p.lon===9&&!p.utmSource,'coordinate conflict blocks');check($('wpFieldCoord').value==='46 S 389700 6540383','draft retained');closeWaypointEditor();cases++;
    openWaypointEditor({id:p.id});set('wpFieldCoord','46 S 389700 6540383');fmt('dms');commitWaypointEditor();
    check(!state.waypointEditorDraft&&p.utmSource&&p.utmSource.easting===389700,'explicit UTM retained');cases++;
    openWaypointEditor({id:p.id});set('wpFieldCoord','invalid');waypointUpdate(p.id,{lat:44,lon:8,utmSource:null});commitWaypointEditor();check(state.waypointEditorDraft&&p.lat===44,'invalid blocks');closeWaypointEditor();cases++;
    openWaypointEditor({id:p.id});set('wpFieldName','deleted');state.mapWaypoints=state.mapWaypoints.filter(x=>x.id!==p.id);commitWaypointEditor();check(state.waypointEditorDraft&&$('wpFieldCoordFeedback').textContent.includes('rimoss'),'deleted conflict blocks');closeWaypointEditor();cases++;
    p=add();delete p.utmSource;p.meta={icon:'unknown-legacy',other:'keep'};openWaypointEditor({id:p.id});set('wpFieldName','legacy name');commitWaypointEditor();check(p.meta.icon==='unknown-legacy'&&p.meta.other==='keep'&&!p.utmSource,'legacy record preserved');cases++;
    p=add();openWaypointEditor({id:p.id});set('wpFieldColor','#ff0000');waypointUpdate(p.id,{meta:{color:'#00ff00'}});commitWaypointEditor();check(state.waypointEditorDraft&&p.meta.color==='#00ff00','style conflict blocks');closeWaypointEditor();cases++;
    p=add();openWaypointEditor({id:p.id});set('wpFieldCoord','46 S 389700 6540383');delete p.utmSource;commitWaypointEditor();check(state.waypointEditorDraft&&!p.utmSource,'source-only conflict blocks');closeWaypointEditor();cases++;
    p=add();openWaypointEditor({id:p.id});set('wpFieldCoord','46 S 389700 6540383');const next=autoDetect('46 S 389700 6540383');waypointUpdate(p.id,{lat:next.lat,lon:next.lon,utmSource:next.utm});commitWaypointEditor();check(!state.waypointEditorDraft&&p.utmSource.easting===389700,'same concurrent coordinate succeeds');cases++;
    return {cases,formatTransitions:36,network:'blocked',profile:'isolated'};
  })()`;
  const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
  if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));
  console.log(JSON.stringify(r.result.value,null,2));ws.close();
}
run().catch(e=>{console.error(e.stack||e);process.exitCode=1}).finally(()=>proc.kill());
