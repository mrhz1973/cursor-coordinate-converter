'use strict';
const fs=require('fs'),path=require('path'),os=require('os'),crypto=require('crypto');
const {spawn}=require('child_process');
const root=process.argv[2],mode=process.argv[3]||'candidate';
if(!root||!['candidate','live'].includes(mode))throw new Error('root and candidate/live mode required');
const expected=process.argv[4]||'5ffa64ff3ba9746de9a5463cc4adfc058ceb7de77e095aacdd51259e39d72464';
const sourceCommit=process.argv[5]||'95080bac23a1642c1a2c6f8c0bdd4885b7bac960';
const moduleName=process.argv[6]||'qa305-phases.cjs';
const runName=mode+(moduleName.includes('polygon')?'-polygons':'');
const phaseModule=require(path.join(root,moduleName));
const phases={phase1:phaseModule.phase1||phaseModule.polygonPhase1,phase2:phaseModule.phase2||phaseModule.polygonPhase2};
const candidate=fs.readFileSync(path.join(root,'candidate305.html'));
if(crypto.createHash('sha256').update(candidate).digest('hex')!==expected)throw new Error('Candidate byte mismatch');
const profile=fs.mkdtempSync(path.join(root,'edge-'+mode+'-'));
const url='https://ionos-n8n-new.tailc01234.ts.net/gis?v='+expected.slice(0,8)+'&qa305='+runName+'-'+Date.now();
const output={mode,runName,url,expectedSha256:expected,sourceCommit,
 browser:'Microsoft Edge headless / Windows / isolated temporary profile',htmlSubstituted:mode==='candidate',
 network:{post:0,blocked:0,documents:0},exceptions:[],consoleErrors:[],harnessErrors:[],documentResponses:[],interceptionCancellations:[]};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
let child,ws,seq=0,closing=false,navigationEpoch=0;
const pending=new Map();
const networkFailures=new Map(),interceptionRaces=[];
const send=(method,params={})=>new Promise((resolve,reject)=>{
 const id=++seq,timeout=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout '+method));},45000);
 pending.set(id,{resolve,reject,timeout,method});
 ws.send(JSON.stringify({id,method,params}));
});
const evaluate=async expression=>{
 const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
 if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);
 return r.result.value;
};
const ready=async()=>{for(let i=0;i<120;i++){
 try{if(await evaluate('typeof APP_BUILD_NUM!=="undefined" && APP_BUILD_NUM===305 && typeof state==="object" && document.readyState==="complete"'))return;}catch(e){}
 await pause(150);
 }throw new Error('Application readiness timeout');};
async function onEvent(m){
 if(m.method==='Fetch.requestPaused'){
  const p=m.params;
  const requestEpoch=navigationEpoch;
  if(p.request.method==='POST')output.network.post++;
  if(p.resourceType==='Document'&&p.request.url===url){
   output.network.documents++;
   if(mode==='candidate')await send('Fetch.fulfillRequest',{requestId:p.requestId,responseCode:200,
    responseHeaders:[{name:'Content-Type',value:'text/html; charset=utf-8'}],body:candidate.toString('base64')});
   else await send('Fetch.continueRequest',{requestId:p.requestId});
  }else{
   output.network.blocked++;
   try{await send('Fetch.failRequest',{requestId:p.requestId,errorReason:'BlockedByClient'});}
   catch(e){
    if(e.message.includes('Invalid InterceptionId'))interceptionRaces.push({networkId:p.networkId,requestEpoch,completionEpoch:navigationEpoch,closing});
    else throw e;
   }
  }
 }
 if(m.method==='Network.loadingFailed')networkFailures.set(m.params.requestId,{canceled:!!m.params.canceled,errorText:m.params.errorText});
 if(m.method==='Runtime.exceptionThrown')output.exceptions.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);
 if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')output.consoleErrors.push(m.params.args.map(a=>a.value||a.description||'').join(' '));
 if(m.method==='Network.responseReceived'&&m.params.type==='Document')output.documentResponses.push({id:m.params.requestId,status:m.params.response.status,url:m.params.response.url});
}
(async()=>{
 try{
  child=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',[
   '--headless=new','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',
   '--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-background-networking','about:blank'
  ],{stdio:'ignore',windowsHide:true});
  child.on('error',e=>output.harnessErrors.push('Edge spawn: '+e.message));
  let port;
  for(let i=0;i<120;i++){const f=path.join(profile,'DevToolsActivePort');if(fs.existsSync(f)){port=Number(fs.readFileSync(f,'utf8').split('\n')[0]);break;}await pause(150);}
  if(!port)throw new Error('Edge CDP not ready');
  const targets=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();
  const protocol=await(await fetch('http://127.0.0.1:'+port+'/json/protocol')).json();
  const networkEnable=protocol.domains.find(d=>d.domain==='Network')?.commands.find(c=>c.name==='enable');
  const networkCapture={maxTotalBufferSize:160000000,maxResourceBufferSize:80000000};
  if(networkEnable?.parameters?.some(p=>p.name==='enableDurableMessages'))networkCapture.enableDurableMessages=true;
  output.networkCapture=networkCapture;
  const target=targets.find(t=>t.type==='page');if(!target)throw new Error('No isolated page target');
  ws=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  ws.addEventListener('message',event=>{
   const m=JSON.parse(event.data);
   if(m.id){const p=pending.get(m.id);if(!p)return;clearTimeout(p.timeout);pending.delete(m.id);if(m.error)p.reject(new Error(p.method+': '+m.error.message));else p.resolve(m.result);}
   else if(!closing)onEvent(m).catch(e=>{if(!closing)output.harnessErrors.push(e.message);});
  });
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable',networkCapture);
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Fetch.enable',{patterns:[{urlPattern:'*'}]});
  await send('Page.navigate',{url});await ready();
  output.build=await evaluate('APP_BUILD_NUM');
  if(mode==='live'){
   const doc=output.documentResponses.filter(x=>x.url===url).at(-1);if(!doc)throw new Error('Missing native document response');
   const body=await send('Network.getResponseBody',{requestId:doc.id});
   const bytes=Buffer.from(body.body,body.base64Encoded?'base64':'utf8');
   output.nativeDocument={status:doc.status,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
   if(output.nativeDocument.sha256!==expected)throw new Error('Native HTTPS byte mismatch');
  }
  output.phase1=await evaluate(phases.phase1);
  if(output.phase1.pass){
   navigationEpoch++;
   await send('Page.reload',{ignoreCache:true});await pause(250);await ready();
   output.phase2=await evaluate(phases.phase2);
  }
  try{
   await evaluate('(()=>{const st=state.savedTracks.find(s=>s.name==="QA305-partial");if(st)document.querySelector(\'[data-saved-profile="\'+st.id+\'"]\').click();return true;})()');
   const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   fs.writeFileSync(path.join(root,runName+'-profile.png'),Buffer.from(shot.data,'base64'));
  }catch(e){output.screenshotError=e.message;}
 }catch(e){output.pass=false;output.fatal={message:e.message,stack:e.stack};}
 finally{
  closing=true;
  try{if(ws&&ws.readyState===1)await send('Browser.close');}catch(e){}
  if(ws)ws.close();
  for(const p of pending.values()){clearTimeout(p.timeout);p.reject(new Error('Runner cleanup'));}pending.clear();
  if(child&&child.exitCode===null){await pause(300);if(child.exitCode===null)child.kill();}
  await pause(300);
  try{fs.rmSync(profile,{recursive:true,force:true});output.profileCleanup=true;}catch(e){output.profileCleanup=false;output.profileCleanupError=e.message;}
  for(const race of interceptionRaces){
   const failure=networkFailures.get(race.networkId);
   if(race.closing||race.requestEpoch<race.completionEpoch||failure?.canceled||failure?.errorText==='net::ERR_ABORTED')
    output.interceptionCancellations.push({...race,failure});
   else output.harnessErrors.push('Unexplained Invalid InterceptionId for '+race.networkId);
  }
  output.pass=!!(!output.fatal&&output.phase1?.pass&&output.phase2?.pass&&output.network.post===0&&output.exceptions.length===0&&output.harnessErrors.length===0);
  output.timestamp=new Date().toISOString();
  fs.writeFileSync(path.join(root,runName+'-result.json'),JSON.stringify(output,null,2));
  const checks=[...(output.phase1?.checks||[]),...(output.phase2?.checks||[])];
  console.log(JSON.stringify({mode,runName,pass:output.pass,build:output.build,checks:checks.length,passed:checks.filter(c=>c.pass).length,
    failed:checks.filter(c=>!c.pass),fatal:output.fatal,phase1Fatal:output.phase1?.fatal,phase2Fatal:output.phase2?.fatal,
    network:output.network,exceptions:output.exceptions,consoleErrors:output.consoleErrors,harnessErrors:output.harnessErrors,
    nativeDocument:output.nativeDocument,interceptionCancellations:output.interceptionCancellations.length,profileCleanup:output.profileCleanup,resultPath:path.join(root,runName+'-result.json')}));
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
