"use strict";
const fs = require('fs');
const path = require('path');
const original = fs.readFileSync(path.join(__dirname, 'attempt1', 'real-routing-280.cjs'), 'utf8');
const prefix = original.slice(0, original.indexOf('async function main(){'));
const diagnostics = String.raw`
const diagnostic={candidateSha256:EXPECTED_SHA,startedAtUtc:new Date().toISOString(),
  mode:'fully_intercepted_offline_diagnosis',realNetworkRequests:0,cases:[]};
const fixtureSnaps=[[9.8236,44.10241],[9.82901,44.107]];
function freshRun(name){return {name,inputChecks:[],requests:[],expectedGhProfile:'hiking',expectedOrsProfile:null,
  nearestRequested:[0,0],nearestReceived:[null,null],requestPolicyValid:true,
  counts:{ghInfo:0,ghNearest:0,ghRoute:0,orsStatus:0,orsRoute:0,blockedPolicy:0},
  intercepted:[],pageErrors:[]};}
async function makeContext(browser, bytes, run, timing){
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block',
    acceptDownloads:false,permissions:[],ignoreHTTPSErrors:false});
  const pending=new Set();
  let releaseObserver;
  const routeSeen=new Promise(resolve=>{releaseObserver=resolve;});
  const responseIndex=new Map();
  await ctx.routeWebSocket('**/*',ws=>ws.close());
  await ctx.route('**/*',async route=>{
    const req=route.request(),u=new URL(req.url());
    if(req.url()===CANDIDATE_URL&&req.method()==='GET')return route.fulfill({status:200,contentType:'text/html',body:bytes});
    if(timing&&u.origin===ORIGIN&&u.pathname==='/_routing/gh/info'){
      run.intercepted.push({kind:'info',fulfilled:true});
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({profiles:
        ['hiking','hiking_easy','mtb_touring','mtb_trail'].map(name=>({name}))})});
    }
    if(timing&&u.origin===ORIGIN&&u.pathname==='/_routing/gh/nearest'){
      const policy=classifyRequest(req,CANDIDATE_URL,run);
      assert(policy&&policy.kind==='ghNearest','offline_nearest_fixture_not_allowed');
      const i=policy.targetIndex;responseIndex.set(req,i);
      run.intercepted.push({kind:'nearest',targetIndex:i,fulfilled:true,coordinates:fixtureSnaps[i]});
      return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({type:'Point',
        coordinates:fixtureSnaps[i],distance:haversineM(SYNTHETIC[i],{lon:fixtureSnaps[i][0],lat:fixtureSnaps[i][1]})})});
    }
    if(timing&&u.origin===ORIGIN&&u.pathname==='/_routing/gh/route'&&req.method()==='POST'){
      const observedAtDispatch=run.nearestReceived.map(x=>x&&x.slice());
      const actual=classifyRequest(req,CANDIDATE_URL,run);
      const known={...run,nearestReceived:fixtureSnaps,counts:{...run.counts},requestPolicyValid:true};
      const afterObservation=classifyRequest(req,CANDIDATE_URL,known);
      run.guard={body:JSON.parse(req.postData()),observerAtDispatch:observedAtDispatch,
        admittedAtDispatch:!!actual,admittedAfterObserver:!!afterObservation,
        distancesFromPublicInputs:fixtureSnaps.map((p,i)=>haversineM(SYNTHETIC[i],{lon:p[0],lat:p[1]})),
        actualProviderRequestSent:false};
      releaseObserver();
      return route.abort('blockedbyclient');
    }
    if(u.origin===ORIGIN&&(/routing|^\/ors\//.test(u.pathname)))run.intercepted.push({pathname:u.pathname,blocked:true});
    return route.abort('blockedbyclient');
  });
  if(timing)ctx.on('response',res=>{
    if(!responseIndex.has(res.request()))return;
    const i=responseIndex.get(res.request());
    const work=(async()=>{
      const data=JSON.parse((await res.body()).toString('utf8'));
      await res.securityDetails();
      if(timing==='observer_barrier_witness')await routeSeen;
      run.nearestReceived[i]=data.coordinates.slice(0,2);
    })();pending.add(work);work.finally(()=>pending.delete(work));
  });
  const page=await ctx.newPage();page.setDefaultTimeout(10000);
  page.on('pageerror',e=>run.pageErrors.push(e.message));page.on('dialog',d=>d.dismiss());
  return {ctx,page,finish:async()=>{releaseObserver();await Promise.all([...pending]);await ctx.close();}};
}
async function compareSnapshot(page){return page.evaluate(()=>({
  disabled:document.querySelector('#routingCompareBtn').disabled,
  pair:routingCompareResolveProfilePair(),mode:routingGetRouteMode(),
  points:routingCompareClonePointsForMode(routingGetRouteMode()),
  loading:{compare:_routingCompareSession.loading,route:state._routing.requestLoading,info:state._routing.infoLoading},
  pairNote:document.querySelector('#routingComparePairNote').textContent,
  selectedProfile:document.querySelector('#routingProfileSelect').value
}));}
async function offlineMain(){
  const bytes=fs.readFileSync(APP);assert(hash(bytes)===EXPECTED_SHA,'candidate_hash_mismatch');
  const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
  const browser=await chromium.launch({headless:true,
    executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps',
      '--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']});
  try{
    const run=freshRun('compare_initial_ui');
    const env=await makeContext(browser,bytes,run,null);
    try{
      await enterUi(env.page,run,{service:'graphhopper',profile:'mtb_trail'});
      run.before=await compareSnapshot(env.page);
      await env.page.screenshot({path:path.join(__dirname,'compare-disabled-before.png')});
      await env.page.evaluate(()=>routingSyncCompareUi());
      run.afterDiagnosticSync=await compareSnapshot(env.page);
      await env.page.screenshot({path:path.join(__dirname,'compare-enabled-after-diagnostic-sync.png')});
      run.missingSyncReproduced=run.before.disabled&&run.before.pair.ok&&!run.afterDiagnosticSync.disabled;
      run.diagnosticOnlyMutation='Called existing UI synchronizer once; no runtime source/state/provider mutation';
    }catch(e){run.error=e.message;}finally{await env.finish();diagnostic.cases.push(run);}
    for(const timing of ['native_async_observer','observer_barrier_witness']){
      const run=freshRun('gh_guard_'+timing),env=await makeContext(browser,bytes,run,timing);
      try{
        await enterUi(env.page,run,{service:'graphhopper',profile:'hiking'});
        await env.page.locator('#routingCalculateBtn').click();
        await env.page.waitForFunction(()=>!state._routing.requestLoading&&!state._routing.infoLoading&&!!state._routing.routeError,null,{timeout:15000});
        run.ui=await readUi(env.page);delete run.ui.preview;
        assert(!!run.guard,'gh_post_not_observed');
      }catch(e){run.error=e.message;}finally{await env.finish();diagnostic.cases.push(run);}
    }
  }finally{await browser.close();diagnostic.finishedAtUtc=new Date().toISOString();
    fs.writeFileSync(path.join(__dirname,'offline-diagnostics.json'),JSON.stringify(diagnostic,null,2)+'\n');}
  console.log(JSON.stringify({cases:diagnostic.cases.map(c=>({name:c.name,error:c.error,missingSyncReproduced:c.missingSyncReproduced,
    guard:c.guard&&{admittedAtDispatch:c.guard.admittedAtDispatch,admittedAfterObserver:c.guard.admittedAfterObserver}})),realNetworkRequests:0}));
}
offlineMain().catch(e=>{diagnostic.fatal=e.message;fs.writeFileSync(path.join(__dirname,'offline-diagnostics.json'),JSON.stringify(diagnostic,null,2)+'\n');console.error(e.message);process.exitCode=1;});
`;
eval(prefix + '\n' + diagnostics);
