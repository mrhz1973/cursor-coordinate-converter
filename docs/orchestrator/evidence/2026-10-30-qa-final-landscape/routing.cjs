const fs=require('fs'),http=require('http'),crypto=require('crypto'),path=require('path');
const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
const app='C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html';
const out='C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/qa-final-landscape';
const bytes=fs.readFileSync(app), sha=crypto.createHash('sha256').update(bytes).digest('hex');
const expected='fcc92f798b30e9bd0ffb60102f75ba847415c0bb0e5ee89d66b0ad07f9e8eb93';
if(sha!==expected) throw new Error('Candidate SHA mismatch: '+sha);
const externalBlocked=[];const records=[];
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html;charset=utf-8');r.setHeader('Cache-Control','no-store');r.end(bytes)});
function json(body){return JSON.stringify(body)}
function closeEnough(p,q){return Array.isArray(p)&&Array.isArray(q)&&Math.abs(p[0]-q[0])<1e-8&&Math.abs(p[1]-q[1])<1e-8}
function ghResponse(body, mode, failure){
 const pts=body.points||[]; if(failure) return {hints:[{message:'Connection not found',details:'com.graphhopper.routing.ConnectionNotFoundException'}]};
 let coords=pts.map(p=>[p[0],p[1],25]);
 if(mode==='round_trip'){const p=pts[0];coords=[[p[0],p[1],25],[p[0]+0.05,p[1]+0.02,40],[p[0],p[1],25]];}
 const details={road_environment:[[0,coords.length-1,'road']]};
 const path={distance:mode==='round_trip'?9900:1200,time:900000,points:{type:'LineString',coordinates:coords},snapped_waypoints:{type:'LineString',coordinates:mode==='round_trip'?[coords[0],coords[1],coords[2]]:pts.map(p=>[p[0],p[1]])},details};
 return {paths:[path]};
}
function orsResponse(body,mode,failure){
 if(failure)return {error:'ors_not_found',message:'No route found'};
 const pts=body.coordinates||[];let coords=pts.map(p=>[p[0],p[1]]);
 if(mode==='round_trip'){const p=pts[0];coords=[[p[0],p[1]],[p[0]+0.004,p[1]+0.003],[p[0],p[1]]];}
 const wi=mode==='round_trip'?[0]:coords.map((_,i)=>i);
 const end=coords.length-1;
 return {type:'FeatureCollection',features:[{type:'Feature',geometry:{type:'LineString',coordinates:coords},properties:{summary:{distance:mode==='round_trip'?9900:1200,duration:900},way_points:mode==='round_trip'?[0]:coords.map((_,i)=>i),extras:{waytype:{values:[[0,end,1]]}}}}]};
}
function responseFor(req,url,scenario){let body={};try{body=JSON.parse(req.postData()||'{}')}catch{};let service=url.includes('/ors/v2/directions/')?'ors':'gh';let mode=body.algorithm==='round_trip'||!!(body.options&&body.options.round_trip)?'round_trip':'route';let fail=scenario&&scenario.fail;records.push({scenario:scenario&&scenario.name,service,mode,url,method:req.method(),body});return {status:fail?404:200,contentType:'application/json',body:json(service==='gh'?ghResponse(body,mode,fail):orsResponse(body,mode,fail))}}
server.listen(0,'127.0.0.1',async()=>{
 process.stdout.write('server-ready\\n'); const browser=await chromium.launch({headless:true,timeout:60000,executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'}); process.stdout.write('browser-ready\\n');
 const report={candidate:{path:app,sha256:sha},viewports:[],networkPolicy:'All requests intercepted; localhost app served locally; only GraphHopper and ORS routing requests fulfilled by deterministic mock; every other non-local request aborted.',limits:[]};
 try{
  for(const vp of [{name:'desktop',width:1440,height:960},{name:'mobile-emulated',width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true}]){
   const context=await browser.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:vp.deviceScaleFactor||1,isMobile:!!vp.isMobile,hasTouch:!!vp.hasTouch});
   const external=[];
   await context.route('**/*',async route=>{
    const req=route.request(),url=req.url();
    if(url.startsWith('http://127.0.0.1:')) return route.continue();
    if(url.includes('100.99.54.93:8989')&&url.endsWith('/info')) return route.fulfill({status:200,contentType:'application/json',body:json({profiles:['hiking','hiking_easy','mtb_touring','mtb_trail'].map(name=>({name})),bbox:[9.7,9.95,43.95,44.2]})});
    if(url.includes('100.99.54.93:8989')&&url.includes('/nearest?')) {const u=new URL(url),[lat,lon]=u.searchParams.get('point').split(',').map(Number);return route.fulfill({status:200,contentType:'application/json',body:json({coordinates:[lon,lat],distance:0})});}
    if(url.includes('ionos-n8n-new.tailc01234.ts.net')&&url.endsWith('/ors/status')) return route.fulfill({status:200,contentType:'application/json',body:json({status:'ready',secret:'PRESENT',profiles:['foot-hiking','foot-walking','cycling-mountain']})});
    if(url.includes('100.99.54.93:8989')&&url.includes('/route')) return route.fulfill(responseFor(req,url,activeScenario));
    if(url.includes('ionos-n8n-new.tailc01234.ts.net')&&url.includes('/ors/v2/directions/')) return route.fulfill(responseFor(req,url,activeScenario));
    external.push({url,method:req.method(),resourceType:req.resourceType()});externalBlocked.push({viewport:vp.name,url,method:req.method(),resourceType:req.resourceType()});
    return route.abort();
   });
   const vpResult={name:vp.name,width:vp.width,height:vp.height,cases:[],pageErrors:[],blockedRequests:external};
   let page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>vpResult.pageErrors.push(String(e)));
   await page.goto('http://127.0.0.1:'+server.address().port+'/',{timeout:60000});await page.waitForTimeout(350);process.stdout.write('page-ready '+vp.name+'\\n');
   const scenarios=[
    {name:'GH VIA',service:'graphhopper',mode:'via',profile:'hiking',points:[[9.8236,44.1024],[9.8263,44.1047],[9.829,44.107]]},
    {name:'GH alternative',service:'graphhopper',mode:'alternative',profile:'hiking',points:[[9.8236,44.1024],[9.829,44.107]]},
    {name:'ORS VIA',service:'ors',mode:'via',profile:'foot-hiking',points:[[9.8236,44.1024],[9.8263,44.1047],[9.829,44.107]]},
    {name:'ORS alternative',service:'ors',mode:'alternative',profile:'foot-hiking',points:[[9.8236,44.1024],[9.829,44.107]]},
    {name:'GH out-and-back',service:'graphhopper',mode:'out_and_back',profile:'hiking',points:[[9.8236,44.1024],[9.829,44.107]]},
    {name:'ORS out-and-back',service:'ors',mode:'out_and_back',profile:'foot-hiking',points:[[9.8236,44.1024],[9.829,44.107]]},
    {name:'GH round-trip',service:'graphhopper',mode:'round_trip',profile:'hiking',points:[[9.8236,44.1024]]},
    {name:'ORS round-trip',service:'ors',mode:'round_trip',profile:'foot-hiking',points:[[9.8236,44.1024]]},
    {name:'GH no-land failure',service:'graphhopper',mode:'one_way',profile:'hiking',points:[[9.8236,44.1024],[9.829,44.107]],fail:true},
    {name:'ORS no-land failure',service:'ors',mode:'one_way',profile:'foot-hiking',points:[[9.8236,44.1024],[9.829,44.107]],fail:true},
    {name:'GH strict gate',service:'graphhopper',mode:'one_way',profile:'hiking',points:[[9.8236,44.1024],[9.829,44.107]],gate:'strict'},
    {name:'ORS offline gate',service:'ors',mode:'one_way',profile:'foot-hiking',points:[[9.8236,44.1024],[9.829,44.107]],gate:'offline'}
   ];
   for(const s of scenarios){process.stdout.write('scenario '+vp.name+' '+s.name+'\\n');
    activeScenario=s;const before=records.length;
    await page.evaluate(()=>{state.opsecStrict=false;state.forceOffline=false;try{if(document.querySelector('#routingPlannerPanel')?.open)closeRoutingPlannerPanel()}catch{};});
    await page.evaluate(svc=>openRoutingPlannerPanel(svc),s.service);
    await page.waitForSelector('#routingPlannerPanel[open]');
    await page.locator('#routingProfileSelect').selectOption(s.profile);
    if(s.mode==='via') await page.locator('#routingAddViaBtn').click();
    if(s.mode==='out_and_back') await page.locator('[data-routing-mode="out_and_back"]').click();
    if(s.mode==='round_trip') await page.locator('[data-routing-mode="round_trip"]').click();
    await page.evaluate(points=>{
      const r=state._routing;for(let i=0;i<points.length;i++){if(!r.points[i])continue;const [lon,lat]=points[i];routingSetPointCoordinates(r.points[i].id,lat,lon,'map');}
      routingSyncCalculateBtnUi();
    },s.points);
    if(s.gate) await page.evaluate(g=>{if(g==='strict')state.opsecStrict=true;if(g==='offline')state.forceOffline=true;},s.gate);
    const reqStart=records.length;
    await page.locator('#routingCalculateBtn').click();
    await page.waitForFunction(()=>!state._routing.requestLoading&&!state._routing.infoLoading,null,{timeout:30000});
    await page.waitForTimeout(100);
    const captured=records.slice(reqStart);
    const stateNow=await page.evaluate(()=>({preview:!!state._routing.previewCoordinates,saveDisabled:!!document.querySelector('#routingSaveAsTrackBtn')?.disabled,cardHidden:!!document.querySelector('#routingResultCard')?.hidden,status:document.querySelector('#routingPlannerStatus')?.innerText||'',roundTripStatus:document.querySelector('#routingRoundTripFeedback')?.innerText||'',pointCount:state._routing.points.length,routeMode:state._routing.routeMode,previewCount:state._routing.previewCoordinates?.length||0}));
    const expectedReq=captured.length>0&&captured.every(x=>x.method==='POST'&&(x.service==='gh'?Array.isArray(x.body.snap_preventions)&&x.body.snap_preventions.includes('ferry')&&x.body.details?.includes('road_environment')&&x.body.custom_model?.priority?.some(p=>p.if==='road_environment == FERRY'):x.body.options?.avoid_features?.includes('ferries')&&x.body.extra_info?.includes('waytype')));
    let modeEvidence=true;
    if(s.mode==='alternative') modeEvidence=captured.length===1&&(s.service==='graphhopper'?captured[0].body.algorithm==='alternative_route':!!captured[0].body.alternative_routes);
    if(s.mode==='via') modeEvidence=captured.length===1&&(s.service==='graphhopper'?captured[0].body.points?.length===3:captured[0].body.coordinates?.length===3);
    if(s.mode==='round_trip') modeEvidence=captured.length>=1&&captured.every(x=>s.service==='graphhopper'?x.body.algorithm==='round_trip':!!x.body.options?.round_trip);
    if(s.mode==='out_and_back') modeEvidence=captured.length===2&&captured.every(x=>s.service==='graphhopper'?(x.body.algorithm!=='round_trip'&&x.body.points?.length===2):(x.body.options?.round_trip==null&&x.body.coordinates?.length===2));
    const noLeak=external.slice(before).filter(x=>x.url.includes('100.99.54.93')||x.url.includes('ionos-n8n-new')).length===0;
    const ok=s.fail?(!stateNow.preview&&!stateNow.saveDisabled&&false):true;
    // `saveDisabled` must stay true on rejected routes; no preview or save controls should be exposed.
    const caseResult={name:s.name,service:s.service,mode:s.mode,requests:captured.map(x=>({method:x.method,url:x.url,body:x.body})),payloadFiltersOk:expectedReq,payloadModeOk:modeEvidence,ui:stateNow,providerRequestsStayedMocked:noLeak,passed:s.gate?(captured.length===0&&noLeak&&!stateNow.preview&&stateNow.saveDisabled&&(s.gate==='strict'?/OPSEC strict/i.test(stateNow.status+' '+stateNow.roundTripStatus):/offline/i.test(stateNow.status+' '+stateNow.roundTripStatus))):(expectedReq&&modeEvidence&&noLeak&&(s.fail?(!stateNow.preview&&stateNow.saveDisabled&&stateNow.cardHidden&&/terrestr|colleg|disponib/i.test(stateNow.status+' '+stateNow.roundTripStatus)):stateNow.preview&&!stateNow.saveDisabled&&!stateNow.cardHidden)),};
    vpResult.cases.push(caseResult);
    await page.screenshot({path:path.join(out,`final-${vp.name}-${s.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.png`),fullPage:false});
    // close and reopen clears transient route state for next case
    await page.evaluate(()=>{try{closeRoutingPlannerPanel()}catch{}});await page.waitForTimeout(80);
   }
   vpResult.result=vpResult.cases.every(c=>c.passed)&&vpResult.pageErrors.length===0;
   report.viewports.push(vpResult);await context.close();
  }
 }finally{await browser.close();server.close();}
 const counts=arr=>arr.reduce((m,x)=>{let h='unknown';try{h=new URL(x.url).host}catch{};let k=h+' '+x.method+' '+x.resourceType;m[k]=(m[k]||0)+1;return m;},{}); report.blockedExternalRequestCounts=counts(externalBlocked); report.viewports.forEach(v=>{v.blockedRequestCounts=counts(v.blockedRequests);delete v.blockedRequests;});
 report.totals={cases:report.viewports.reduce((a,v)=>a+v.cases.length,0),passed:report.viewports.reduce((a,v)=>a+v.cases.filter(c=>c.passed).length,0),failed:report.viewports.reduce((a,v)=>a+v.cases.filter(c=>!c.passed).length,0),pageErrors:report.viewports.flatMap(v=>v.pageErrors)};
 report.limits=['Mock provider responses verify browser request bodies and UI handling only; they do not verify live provider routing semantics or land-only behavior on the network.','Coordinates are public synthetic values; setup calls routingSetPointCoordinates while all route calculation and route-mode actions use the visible UI.','Strict/offline gates are not yet included in this browser replay.','No physical mobile device, provider health, preview pixel comparison, or persistent user data was exercised.'];
 fs.writeFileSync(path.join(out,'results-final.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({sha,totals:report.totals,views:report.viewports.map(v=>({name:v.name,result:v.result,cases:v.cases.map(c=>({name:c.name,passed:c.passed,requests:c.requests.length,filters:c.payloadFiltersOk,mode:c.payloadModeOk,preview:c.ui.preview,saveDisabled:c.ui.saveDisabled,status:c.ui.status}))})),externalBlocked},null,2));
 if(report.totals.failed||report.totals.pageErrors.length)process.exitCode=1;
});
let activeScenario=null;







