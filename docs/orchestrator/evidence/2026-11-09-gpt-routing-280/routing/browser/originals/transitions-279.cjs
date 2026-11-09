const fs=require('fs'), crypto=require('crypto');
const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
const app='C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/routing-merge-276/routing-candidate-279-routing-8bada07.html';
const out=__dirname, bytes=fs.readFileSync(app), sha=crypto.createHash('sha256').update(bytes).digest('hex');
if(!process.env.EXPECTED_SHA || sha!==process.env.EXPECTED_SHA) throw Error('unexpected candidate');
const J=JSON.stringify, results=[], requests=[]; let scenario;
function reply(service,b,kind){
 let pts=(service==='gh'?b.points:b.coordinates)||[];
 let loop=b.algorithm==='round_trip'||!!b.options?.round_trip;
 let coords=loop?[[...pts[0]],[pts[0][0]+.01,pts[0][1]+.01],[...pts[0]]]:pts.map(p=>p.slice());
 let end=coords.length-1, val=kind==='ferry'?(service==='gh'?'ferry':9):(kind==='bridge'?'bridge':'road');
 let intervals=kind==='missing'?undefined:[[0,end,service==='gh'?val:(kind==='ferry'?9:1)]];
 if(kind==='gap') intervals=[[0,0,service==='gh'?'road':1]];
 let snapped=pts.map(p=>p.slice()); if(kind==='snapfar') snapped[0]=[snapped[0][0]+.02,snapped[0][1]];
 if(service==='gh') return {paths:[{distance:loop?9900:1200,time:900000,points:{type:'LineString',coordinates:coords},snapped_waypoints:{type:'LineString',coordinates:snapped},details:intervals?{road_environment:intervals}:{}}]};
 if(kind==='snapfar') coords[0][0]+=.02;
 return {type:'FeatureCollection',features:[{type:'Feature',geometry:{type:'LineString',coordinates:coords},properties:{summary:{distance:loop?9900:1200,duration:900},way_points:loop?[0]:coords.map((_,i)=>i),extras:intervals?{waytype:{values:intervals}}:{}}}]};
}
const filters=x=> x.service==='gh'? x.body['ch.disable']===true&&x.body.snap_preventions?.includes('ferry')&&x.body.details?.includes('road_environment')&&x.body.custom_model?.priority?.some(p=>p.if==='road_environment == FERRY'&&p.multiply_by==='0') : x.body.options?.avoid_features?.includes('ferries')&&x.body.extra_info?.includes('waytype');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
 try {
 for(const s of ['graphhopper','ors'].flatMap(service=>['strict','offline'].map(transition=>({name:service+' transition '+transition,service,transition})))){
 scenario=s; const ctx=await browser.newContext(); const records=[]; let phase='startup', before=[];
 await ctx.route('**/*',async route=>{
   const q=route.request(), u=q.url(), record={phase,method:q.method(),type:q.resourceType(),url:u};
   if(u==='https://app.invalid/') return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:bytes});
   let service=u.includes('/ors/v2/directions/')?'ors':u.includes('/route')?'gh':null;
   if(service&&q.method()==='POST'){
     record.service=service; try{record.body=JSON.parse(q.postData())}catch{};records.push(record);
     if(s.transition) await new Promise(resolve=>setTimeout(resolve,1500));
     if(s.kind==='timeout'){await new Promise(resolve=>setTimeout(resolve,23000));return route.abort().catch(()=>{});}
     if(s.kind==='network')return route.abort('failed');
     if(s.kind==='reject')return route.fulfill({status:400,contentType:'application/json',body:J({message:'parameter rejected'})});
     return route.fulfill({status:200,contentType:'application/json',body:J(reply(service,record.body,s.kind))});
   }
   records.push(record);
   if(u.endsWith('/info')) {if(s.fallback&&new URL(u).hostname==='127.0.0.1')return route.abort('failed'); return route.fulfill({status:200,contentType:'application/json',body:J({profiles:['hiking','hiking_easy','mtb_touring','mtb_trail'].map(name=>({name})),bbox:[9.7,9.95,43.95,44.2]})});}
   if(u.includes('/nearest?')){let [lat,lon]=new URL(u).searchParams.get('point').split(',').map(Number);return route.fulfill({status:200,contentType:'application/json',body:J({coordinates:[lon,lat],distance:0})});}
   if(u.endsWith('/ors/status')) return route.fulfill({status:200,contentType:'application/json',body:J({status:'ready',secret:'PRESENT',profiles:['foot-hiking','foot-walking','cycling-mountain']})});
   return route.abort();
 });
 const page=await ctx.newPage(); page.setDefaultTimeout(12000);let errors=[];page.on('pageerror',e=>errors.push(String(e)));
 try{
  await page.goto('https://app.invalid/',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(300);
  phase='setup'; await page.evaluate(svc=>openRoutingPlannerPanel(svc),s.service); await page.waitForSelector('#routingPlannerPanel[open]');
  await page.locator('#routingProfileSelect').selectOption(s.profile||(s.service==='ors'?'foot-hiking':'hiking'));
  await page.evaluate(({avoid,gate,fallback})=>{let r=state._routing; [[9.8236,44.1024],[9.829,44.107]].forEach(([lon,lat],i)=>routingSetPointCoordinates(r.points[i].id,lat,lon,'map')); if(avoid){_routingAvoidSession.areas=[{id:'qa',enabled:true,vertices:[{lat:44.11,lon:9.82},{lat:44.11,lon:9.83},{lat:44.12,lon:9.83}]}];routingSyncAvoidAreasUi();} if(fallback)r.provider='auto'; if(gate==='strict') state.opsecStrict=true; if(gate==='offline') state.forceOffline=true; routingSyncCalculateBtnUi();routingSyncCompareUi();},{avoid:s.avoid,gate:s.gate,fallback:s.fallback});
  await page.waitForTimeout(200); before=records.filter(x=>x.service); phase='action';
  if(s.compare){await page.locator('#routingCompareBtn').click();await page.waitForFunction(()=>!_routingCompareSession.loading,null,{timeout:30000});}
  else {const pending = s.transition ? page.waitForRequest(q=>q.method()==='POST'&&(q.url().includes('/route')||q.url().includes('/ors/v2/directions/')), {timeout:12000}) : null; await page.locator('#routingCalculateBtn').click(); if(pending){await pending; for(let i=0;i<100&&!records.some(x=>x.service);i++) await new Promise(resolve=>setTimeout(resolve,10)); if(!records.some(x=>x.service)) throw Error('intercepted request not observed'); phase='after-policy'; await page.evaluate(t=>{if(t==='strict')state.opsecStrict=true; else state.forceOffline=true; routingOnNetworkPolicyChange();},s.transition); await page.waitForTimeout(2000);} await page.waitForFunction(()=>!state._routing.requestLoading&&!state._routing.infoLoading,null,{timeout:30000});}
  await page.waitForTimeout(100);
  let ui=await page.evaluate(()=>({preview:!!state._routing.previewCoordinates,saveDisabled:document.querySelector('#routingSaveAsTrackBtn').disabled,cardHidden:document.querySelector('#routingResultCard').hidden,status:document.querySelector('#routingPlannerStatus').innerText,compare:{gh:_routingCompareSession.gh?.status||null,ors:_routingCompareSession.ors?.status||null,chooseGh:document.querySelector('#routingCompareChooseGh').disabled,chooseOrs:document.querySelector('#routingCompareChooseOrs').disabled}}));
  let saved=null;
  if(s.choose){await page.locator(s.choose==='gh'?'#routingCompareChooseGh':'#routingCompareChooseOrs').click(); await page.locator('#routingSaveAsTrackBtn').click(); await page.locator('#routingSaveAsTrackName').fill('QA Synthetic'); await page.locator('#routingSaveAsTrackConfirmBtn').click(); await page.waitForTimeout(300); saved=await page.evaluate(()=>({status:document.querySelector('#routingPlannerStatus').innerText,feedback:document.querySelector('#routingSaveAsTrackFeedback').innerText,preview:!!state._routing.previewCoordinates}));}
  const posts=records.filter(x=>x.service), constrained=posts.every(filters), avoidOk=!s.avoid||posts.every(x=>x.service==='gh'?!!x.body.custom_model?.areas&&x.body.custom_model.priority.some(p=>p.if.startsWith('in_')):!!x.body.options?.avoid_polygons);
  let passed;
  if(s.transition) passed=posts.length===1&&constrained&&!ui.preview&&ui.saveDisabled&&ui.cardHidden&&records.filter(x=>x.phase==='after-policy'&&(x.service||x.url.endsWith('/info')||x.url.includes('/nearest?')||x.url.endsWith('/ors/status'))).length===0;
  else if(s.gate)passed=records.filter(x=>x.phase==='action'&&(x.service||x.url.endsWith('/info')||x.url.includes('/nearest?')||x.url.endsWith('/ors/status'))).length===0&&posts.length===0&&!ui.preview&&ui.saveDisabled&&(!s.compare||(ui.compare.gh==='fail'&&ui.compare.ors==='fail'));
  else if(s.compare&&['ferry','missing'].includes(s.kind))passed=posts.length===2&&constrained&&ui.compare.gh==='fail'&&ui.compare.ors==='fail'&&ui.compare.chooseGh&&ui.compare.chooseOrs&&!ui.preview&&ui.saveDisabled;
  else if(s.compare)passed=posts.length===2&&constrained&&avoidOk&&ui.compare.gh==='pass'&&ui.compare.ors==='pass'&&(!s.choose||(!!saved&&/salvat|saved/i.test(saved.status)));
  else if(['ferry','missing','gap','snapfar','reject','network','timeout'].includes(s.kind))passed=posts.length===1&&constrained&&!ui.preview&&ui.saveDisabled&&ui.cardHidden&&(s.kind!=='timeout'||/tempo|timeout/i.test(ui.status));
  else passed=posts.length===1&&constrained&&avoidOk&&ui.preview&&!ui.saveDisabled&&(!s.fallback||(records.some(x=>x.phase==='action'&&x.url.includes('127.0.0.1')&&x.url.endsWith('/info'))&&records.some(x=>x.phase==='action'&&!x.url.includes('127.0.0.1')&&x.url.endsWith('/info'))));
  passed=passed&&before.length===0&&errors.length===0;
  results.push({name:s.name,passed,preActionRoutingPosts:before.length,providerRequests:records.filter(x=>x.url.includes('/info')||x.url.includes('/nearest?')||x.url.includes('/ors/status')||x.service).map(({phase,method,url})=>({phase,method,category:url.includes('/nearest?')?'nearest':url.includes('/info')?'info':url.includes('/ors/status')?'status':'route',local:url.includes('127.0.0.1')})),posts:posts.map(({service,body})=>({service,body})),constrained,avoidOk,ui,saved,pageErrors:errors,blockedOtherCount:records.filter(x=>!x.service).length});
 }catch(e){results.push({name:s.name,passed:false,error:String(e),requests:records.filter(x=>x.service),pageErrors:errors});}
 await ctx.close();
 }
 }finally{await browser.close()}
 if(results.some(x=>!x.passed))process.exitCode=1;
 fs.writeFileSync(out+'/'+(process.env.QA_OUTPUT||'transitions.json'),J({sha,policy:'All browser requests intercepted, app fulfilled directly from bytes, mocks or abort; no server and no real network.',results},null,2));
 console.log(J(results.map(x=>({name:x.name,passed:x.passed,posts:x.posts?.length,pre:x.preActionRoutingPosts,status:x.ui?.status,compare:x.ui?.compare,saved:x.saved,error:x.error})),null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
