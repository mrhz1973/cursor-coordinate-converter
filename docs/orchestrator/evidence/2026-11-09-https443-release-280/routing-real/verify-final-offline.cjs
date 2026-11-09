"use strict";
const fs=require('fs'),path=require('path');
let source=fs.readFileSync(path.join(__dirname,'real-routing-280.cjs'),'utf8');
source=source.slice(0,source.indexOf('async function main(){'));
source=source.replace("assert(run.responses.every(r=>r.tls&&r.tls.protocol),'tls_details_missing');",
  "assert(run.responses.every(r=>!r.tls?.protocol),'offline_fixture_has_unexpected_tls');run.offlineFixtureTlsExpected=true;");
const appended=String.raw`
const evidence={candidateSha256:EXPECTED_SHA,mode:'fully_offline_focused_regression',
  startedAtUtc:new Date().toISOString(),realNetworkRequests:0,syntheticApiReplies:0};
const fixtureSnaps=[[9.8236,44.10241],[9.82901,44.107]];
const line=[[...fixtureSnaps[0],10],[9.8263,44.1047,12],[...fixtureSnaps[1],11]];
const ghReply={paths:[{distance:811,time:600000,ascend:2,descend:1,
  points:{type:'LineString',coordinates:line},
  snapped_waypoints:{type:'LineString',coordinates:fixtureSnaps},
  details:{road_environment:[[0,2,'ROAD']]}}]};
async function snapshot(page){return page.evaluate(()=>({disabled:document.querySelector('#routingCompareBtn').disabled,
  pair:routingCompareResolveProfilePair(),note:document.querySelector('#routingComparePairNote').textContent,
  profile:document.querySelector('#routingProfileSelect').value,
  points:state._routing.points.map(p=>({lat:p.lat,lon:p.lon})),
  loading:{route:state._routing.requestLoading,info:state._routing.infoLoading,compare:_routingCompareSession.loading}}));}
async function finalOfflineMain(){
  const bytes=fs.readFileSync(APP);assert(hash(bytes)===EXPECTED_SHA,'candidate_hash_mismatch');
  const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
  const browser=await chromium.launch({headless:true,
    executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps',
      '--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']});
  try{
    const ctx=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block',permissions:[]});
    const cmp={inputChecks:[],requests:[],providerAttempts:[]};evidence.compare=cmp;
    await ctx.routeWebSocket('**/*',ws=>ws.close());
    await ctx.route('**/*',route=>{
      const q=route.request(),u=new URL(q.url());
      if(q.url()===CANDIDATE_URL&&q.method()==='GET')return route.fulfill({status:200,contentType:'text/html',body:bytes});
      if(u.origin===ORIGIN&&(/\/_routing\/gh\/|\/ors\//.test(u.pathname)))cmp.providerAttempts.push({method:q.method(),pathname:u.pathname});
      return route.abort('blockedbyclient');
    });
    const page=await ctx.newPage();
    try{
      await enterUi(page,cmp,{service:'graphhopper',profile:'mtb_trail'});
      cmp.initial=await snapshot(page);
      assert(!cmp.initial.disabled&&cmp.initial.note.includes('mtb_trail')&&cmp.initial.note.includes('cycling-mountain'),'compare_initial_not_coherent');
      await page.locator('#routingProfileSelect').selectOption('hiking_easy');
      cmp.incompatible=await snapshot(page);
      assert(cmp.incompatible.disabled&&!cmp.incompatible.pair.ok,'incompatible_profile_not_disabled');
      await page.locator('#routingProfileSelect').selectOption('mtb_trail');
      cmp.restored=await snapshot(page);
      assert(!cmp.restored.disabled&&cmp.restored.pair.ok&&cmp.restored.note.includes('mtb_trail'),'compare_profile_restore_not_coherent');
      assert(cmp.providerAttempts.length===0,'compare_edit_triggered_provider_network');
      cmp.passed=true;cmp.manualSyncInvocations=0;
      await page.screenshot({path:path.join(__dirname,'final-compare-ui-pass.png')});
    }finally{await ctx.close();}
    const offlineBrowser={newContext:async options=>{
      const ctx=await browser.newContext(options),originalRoute=ctx.route.bind(ctx);
      ctx.route=async (pattern,handler)=>originalRoute(pattern,async route=>{
        const proxy=new Proxy(route,{get(target,key){
          if(key==='continue')return async()=>{
            const req=target.request(),u=new URL(req.url());let data;
            if(u.origin!==ORIGIN)throw new Error('offline_continuation_origin_not_authorized');
            if(u.pathname==='/_routing/gh/info')data={profiles:['hiking','hiking_easy','mtb_touring','mtb_trail'].map(name=>({name}))};
            else if(u.pathname==='/_routing/gh/nearest'){
              const latlon=u.searchParams.get('point').split(',').map(Number),i=SYNTHETIC.findIndex(p=>p.lat===latlon[0]&&p.lon===latlon[1]);
              assert(i>=0,'offline_fixture_point_mismatch');
              data={type:'Point',coordinates:fixtureSnaps[i],distance:haversineM(SYNTHETIC[i],{lon:fixtureSnaps[i][0],lat:fixtureSnaps[i][1]})};
            }else if(u.pathname==='/_routing/gh/route'&&req.method()==='POST')data=ghReply;
            else throw new Error('unexpected_offline_continuation');
            evidence.syntheticApiReplies++;
            return target.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
          };
          const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
        }});
        return handler(proxy);
      });return ctx;
    }};
    evidence.guardRegression=await executeScenario(offlineBrowser,bytes,{name:'offline-gh-guard-fixed',service:'graphhopper',profile:'hiking'});
    assert(evidence.guardRegression.passed,'focused_guard_regression_failed_'+evidence.guardRegression.failure);
    assert(evidence.guardRegression.counts.ghRoute===1&&evidence.guardRegression.counts.blockedPolicy===0,'guard_still_blocks_valid_post');
    evidence.passed=true;
  }finally{await browser.close();evidence.finishedAtUtc=new Date().toISOString();
    fs.writeFileSync(path.join(__dirname,'final-offline-regression.json'),JSON.stringify(evidence,null,2)+'\n');}
  console.log(JSON.stringify({passed:evidence.passed,compare:evidence.compare.passed,guard:evidence.guardRegression.passed,
    realNetworkRequests:evidence.realNetworkRequests,syntheticApiReplies:evidence.syntheticApiReplies}));
}
finalOfflineMain().catch(e=>{evidence.error=e.message;fs.writeFileSync(path.join(__dirname,'final-offline-regression.json'),JSON.stringify(evidence,null,2)+'\n');console.error(e.message);process.exitCode=1;});
`;
eval(source+'\n'+appended);
