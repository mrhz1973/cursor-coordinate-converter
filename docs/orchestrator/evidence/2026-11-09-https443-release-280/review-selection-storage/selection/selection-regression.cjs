"use strict";
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const ORIGIN='https://ionos-n8n-new.tailc01234.ts.net';
const CANDIDATE_URL=ORIGIN+'/gis';
const SYNTHETIC=[{lon:9.8236,lat:44.1024},{lon:9.829,lat:44.107}];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
const BASE='C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/gpt-resume-20261109';
const candidates=[{label:'old',sha:'1e6c11cf0825d5c76dd06147cec2378f023a4c323ba4dfcdb623cdce2a57576a',path:BASE+'/candidate-280-1e6c11cf.html'},
{label:'fixed',sha:'70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde',path:BASE+'/candidate-280-70553e52.html'}];
const FIXTURE_SHA='ddfc9b7cc9551f52b5fa06b2bfd23126c45f4e6bcaecb6149d5deb3231129c1f';
const fixtureBytes=fs.readFileSync(path.join(__dirname,'ors-foot-hiking-ors.json'));
const fixture=JSON.parse(fixtureBytes);
const summary={startedAtUtc:new Date().toISOString(),scope:'Targeted selection handler regression, not a general suite or provider QA',
transport:'Playwright fulfill/abort only; dead local proxy and DNS blocking',providerRequestsForwarded:0,
fixtureSha256:FIXTURE_SHA,candidates:candidates.map(c=>({label:c.label,sha256:c.sha})),
runs:[],compareSetup:'Memory-only session fixtures made from the runtime-validated captured ORS response; no Compare workflow/provider claim'};
function pointsEqual(actual, reference, tolerance=1e-8) {
  return Array.isArray(actual) && actual.length===reference.length && actual.every((p,i)=>
    Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat-reference[i][1])<=tolerance && Math.abs(p.lon-reference[i][0])<=tolerance);
}


async function verifyInput(page,run,label) {
  await page.waitForFunction(points=>{
    const r=state._routing;
    return r&&Array.isArray(r.points)&&r.points.length===2&&r.points.every((p,i)=>
      Math.abs(Number(p.lat)-points[i].lat)<1e-8&&Math.abs(Number(p.lon)-points[i].lon)<1e-8);
  },SYNTHETIC,{timeout:10000});
  const check=await page.evaluate(points=>{
    const r=state._routing;
    const rows=Array.from(document.querySelectorAll('#routingPointsList .routing-point-row'));
    return {statePoints:r.points.map(p=>({lat:p.lat,lon:p.lon,snapStatus:p.snapStatus||'unverified'})),
      stateMatch:r.points.length===2&&r.points.every((p,i)=>Math.abs(Number(p.lat)-points[i].lat)<1e-8&&Math.abs(Number(p.lon)-points[i].lon)<1e-8),
      inputValues:rows.map(row=>({lat:row.querySelector('input[data-routing-coord="lat"]')?.value,
                                lon:row.querySelector('input[data-routing-coord="lon"]')?.value})),
      profile:document.querySelector('#routingProfileSelect').value,
      forcedOffline:!!state.forceOffline,opsecStrict:!!state.opsecStrict,
      pending:!!r.infoLoading||!!r.requestLoading};
  },SYNTHETIC);
  check.label=label;
  run.inputChecks.push(check);
  assert(check.stateMatch,'state_points_mismatch_'+label);
  assert(check.inputValues.length===2&&check.inputValues.every((p,i)=>
    Math.abs(Number(p.lat)-SYNTHETIC[i].lat)<1e-8&&Math.abs(Number(p.lon)-SYNTHETIC[i].lon)<1e-8),'visible_input_points_mismatch_'+label);
  assert(!check.forcedOffline&&!check.opsecStrict,'network_policy_not_opted_in');
}

async function enterUi(page,run,scenario) {
  await page.goto(CANDIDATE_URL,{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('[data-role="track-map-toggle"]').click();
  await page.waitForSelector('#trackModal[open]');
  if(scenario.service==='ors'){
    await page.locator('#btnRoutingServiceMenu').click();
    await page.locator('#routingServiceMenu [data-routing-service="ors"]').click();
  } else await page.locator('#btnRoutingPlannerOpen').click();
  await page.waitForSelector('#routingPlannerPanel[open]');
  await page.locator('#routingProfileSelect').selectOption(scenario.profile);
  await page.locator('#routingCoordEditBtn').click();
  for(let i=0;i<2;i++){
    const row=page.locator('#routingPointsList .routing-point-row').nth(i);
    await row.locator('input[data-routing-coord="lat"]').fill(String(SYNTHETIC[i].lat));
    await row.locator('input[data-routing-coord="lon"]').fill(String(SYNTHETIC[i].lon));
    await row.locator('button[data-routing-act="apply-coords"]').click();
    await page.waitForFunction(({i,p})=>{
      const q=state._routing.points[i];return q&&Math.abs(Number(q.lat)-p.lat)<1e-8&&Math.abs(Number(q.lon)-p.lon)<1e-8;
    },{i,p:SYNTHETIC[i]},{timeout:10000});
  }
  await verifyInput(page,run,'before_calculation');
  assert(run.requests.every(r=>!r.kind.endsWith('Route')),'routing_post_before_explicit_action');
}


async function readUi(page) {
  return page.evaluate(()=>{
    const r=state._routing, cmp=_routingCompareSession;
    return {status:document.querySelector('#routingPlannerStatus')?.textContent||'',
      routeError:r.routeError||null,loading:!!r.requestLoading,infoLoading:!!r.infoLoading,
      resultVisible:!document.querySelector('#routingResultCard').hidden,
      summary:document.querySelector('#routingResultSummary').textContent,
      detailsVisible:!document.querySelector('#routingResultDetails').hidden,
      preview:r.previewCoordinates||[],previewLines:document.querySelectorAll('.routing-route-preview-line').length,
      selectedAlternative:r.selectedAlternative,activeOverlayKey:r.activeOverlayKey||null,
      snap:r.points.map(p=>({status:p.snapStatus||'unverified',distanceM:p.snapDistanceM??null,lat:p.lat,lon:p.lon})),
      saveEnabled:!document.querySelector('#routingSaveAsTrackBtn').disabled,
      compare:{loading:!!cmp.loading,gh:cmp.gh?.status||null,ors:cmp.ors?.status||null,
        ghProfile:cmp.gh?.profile||null,orsProfile:cmp.ors?.profile||null,
        ghError:cmp.gh?.errorKey||cmp.gh?.errKey||null,orsError:cmp.ors?.errorKey||cmp.ors?.errKey||null,
        chosen:cmp.chosen||null},
      originals:r.points.map(p=>({lat:p.lat,lon:p.lon})),
      alternatives:Array.from(document.querySelectorAll('#routingAlternativesChips [data-routing-alt-index]')).map(e=>
        ({provider:e.dataset.routingAltProvider,index:Number(e.dataset.routingAltIndex),pressed:e.getAttribute('aria-pressed')}))};
  });
}

async function saveAndCheck(page,run,provider,expectedCoordinates) {
  const name='QA REAL 280 '+run.name+' '+provider;
  await page.locator('#routingSaveAsTrackBtn').click();
  await page.locator('#routingSaveAsTrackName').fill(name);
  await page.locator('#routingSaveAsTrackConfirmBtn').click();
  await page.waitForFunction(n=>state.savedTracks&&state.savedTracks.some(t=>t.name===n),name,{timeout:10000});
  const saved=await page.evaluate(n=>{
    const track=state.savedTracks.find(t=>t.name===n);
    const stored=JSON.parse(localStorage.getItem('coordconv_v2')||'{}');
    const persisted=stored.savedTracks?.find(t=>t.name===n);
    return {name:n,id:track?.id,points:track?.points?.map(p=>({lat:p.lat,lon:p.lon})),
      persistedPoints:persisted?.points?.map(p=>({lat:p.lat,lon:p.lon})),
      elevationPresent:!!persisted?.elevationProfile,
      status:document.querySelector('#routingPlannerStatus').textContent,
      formHidden:document.querySelector('#routingSaveAsTrackForm').hidden};
  },name);
  assert(saved.formHidden&&/salvat|saved/i.test(saved.status),'save_ui_not_confirmed');
  assert(pointsEqual(saved.points,expectedCoordinates)&&pointsEqual(saved.persistedPoints,expectedCoordinates),'saved_points_differ_from_provider');
  run.saved.push({name,id:saved.id,points:saved.points.length,persistedPoints:saved.persistedPoints.length,
    geometryMatchesProvider:true,elevationPresent:saved.elevationPresent,status:saved.status,
    geometrySha256:hash(JSON.stringify(saved.persistedPoints))});
  run.savedExpected.push({name,coordinates:expectedCoordinates});
}

async function snapshot(page) {
  const ui=await readUi(page);
  const extra=await page.evaluate(()=>{
    const r=state._routing;
    return {metrics:r.routeMetrics,metricsValues:Array.from(document.querySelectorAll('#routingResultSummary .routing-metric-value')).map(x=>x.textContent),
      overlays:routingCollectPreviewOverlayTracks().map(t=>({key:t.key,active:t.active,points:t.pts.length})),
      activeSvg:Array.from(document.querySelectorAll('.routing-route-preview-line.is-route-active')).map(x=>x.getAttribute('class')),
      elevation:r.elevationProfile,alternatives:r.alternatives};
  });
  return Object.assign(ui,extra);
}

function compact(ui) {
  const x={...ui,previewPointCount:ui.preview.length,previewSha256:hash(JSON.stringify(ui.preview)),elevationSha256:hash(JSON.stringify(ui.elevation))};
  delete x.preview;delete x.elevation;delete x.alternatives;return x;
}

async function seedCompareSession(page,kind) {
  return page.evaluate(kind=>{
    if(kind==='empty')return {kind,injection:false,gh:_routingCompareSession.gh,ors:_routingCompareSession.ors,chosen:_routingCompareSession.chosen};
    const r=state._routing;
    const validated={ok:true,alternatives:r.alternatives};
    const ors=routingComparePackFromValidated(validated,{provider:'ors',profile:'foot-hiking',endpoint:location.origin+'/ors'});
    const ghValidated={ok:true,alternatives:[r.alternatives[2],r.alternatives[0],r.alternatives[1]]};
    const gh=routingComparePackFromValidated(ghValidated,{provider:'vps',profile:'hiking',endpoint:location.origin+'/_routing/gh'});
    _routingCompareSession.gh=kind==='failed'||kind==='live-one'?routingComparePackFail('routing.errorNoPath'):gh;
    _routingCompareSession.ors=kind==='failed'?routingComparePackFail('routing.errorNoPath'):ors;
    _routingCompareSession.chosen=null;
    _routingCompareSession.loading=false;
    r.activeOverlayKey=null;
    routingSyncCompareUi();routingSyncAlternativesRowUi();refreshTileMapForTrackUi();
    return {kind,injection:true,gh:_routingCompareSession.gh.status,ors:_routingCompareSession.ors.status,chosen:_routingCompareSession.chosen,
      packSource:'runtime-validated original ORS fixture; GH-labelled pack uses a permutation of the same geometry, not a GH provider result'};
  },kind);
}

async function normalSelection(page,run,index) {
  await page.locator('#routingAlternativesChips button[data-routing-alt-provider="ors"][data-routing-alt-index="'+index+'"]').click();
  await page.waitForFunction(i=>state._routing.selectedAlternative===i,index,{timeout:5000});
  const ui=await snapshot(page), expected=fixture.features[index], geometry=expected.geometry.coordinates;
  const geometryMatches=pointsEqual(ui.preview,geometry);
  const metricsMatch=Math.abs(ui.metrics.distanceM-expected.properties.summary.distance)<1e-7&&
    Math.abs(ui.metrics.durationMs-expected.properties.summary.duration*1000)<1e-6;
  const visibleKm=Number(String(ui.metricsValues[0]).split(/\s/)[0].replace(',','.'));
  const visibleDistanceMatches=Number.isFinite(visibleKm)&&Math.abs(visibleKm*1000-expected.properties.summary.distance)<=0.501;
  const active=ui.overlays.filter(t=>t.active);
  const pressed=ui.alternatives;
  const pressedDom=await page.locator('#routingAlternativesChips button[data-routing-alt-index][aria-pressed="true"]').evaluateAll(els=>els.map(e=>({provider:e.dataset.routingAltProvider,index:Number(e.dataset.routingAltIndex)})));
  const mapMatches=active.length===1&&active[0].key==='ors:'+index&&ui.activeSvg.some(x=>x.split(' ').includes('is-route-ors-'+index));
  run.selections.push({index,geometryMatches,metricsMatch,visibleDistanceMatches,mapMatches,pressedDom,ui:compact(ui)});
  assert(geometryMatches&&metricsMatch&&visibleDistanceMatches&&mapMatches,'selection_geometry_metrics_map_mismatch_'+index);
  assert(pressedDom.length===1&&pressedDom[0].index===index&&pressedDom[0].provider==='ors','pressed_chip_mismatch_'+index);
  assert(ui.resultVisible&&ui.detailsVisible&&ui.saveEnabled,'result_ui_not_ready_'+index);
  await saveAndCheck(page,run,'ors-alt'+index,geometry);
}

async function verifySavedReopen(page,run) {
  run.phase='reload';
  await page.reload({waitUntil:'domcontentloaded',timeout:60000});
  const restored=await page.evaluate(names=>names.map(n=>{
    const t=state.savedTracks.find(t=>t.name===n);return {name:n,id:t?.id,points:t?.points?.map(p=>({lat:p.lat,lon:p.lon}))};
  }),run.savedExpected.map(s=>s.name));
  run.reloadChecks=restored.map((r,i)=>({name:r.name,id:r.id,points:r.points?.length||0,matchesProvider:pointsEqual(r.points,run.savedExpected[i].coordinates)}));
  assert(run.reloadChecks.every(x=>x.matchesProvider),'reload_geometry_mismatch');
  await page.locator('[data-role="track-map-toggle"]').click();
  await page.waitForSelector('#trackModal[open]');
  run.reopenChecks=[];
  for(let i=0;i<restored.length;i++){
    const id=restored[i].id;
    await page.locator('#savedTracksMount [data-saved-edit="'+id+'"]').click();
    await page.waitForFunction(id=>state._trackEditingSavedId===id,id,{timeout:5000});
    const opened=await page.evaluate(()=>({id:state._trackEditingSavedId,points:state.track.points.map(p=>({lat:p.lat,lon:p.lon}))}));
    const match=pointsEqual(opened.points,run.savedExpected[i].coordinates);
    run.reopenChecks.push({id,points:opened.points.length,matchesProvider:match,via:'visible Modifica saved-track button'});
    assert(match,'reopened_edit_geometry_mismatch');
  }
}

async function verifyLiveOverlay(page,run,kind) {
  const before=await snapshot(page);
  run.overlayChecks=[];
  const keys=kind==='live-two'?['ors:1','gh:2','ors:2']:['ors:1','ors:2'];
  for(const key of keys){
    const [provider,idx]=key.split(':');
    await page.locator('#routingAlternativesChips button[data-routing-alt-provider="'+provider+'"][data-routing-alt-index="'+idx+'"]').click();
    const ui=await snapshot(page),active=ui.overlays.filter(t=>t.active);
    const preserved=ui.selectedAlternative===before.selectedAlternative&&JSON.stringify(ui.preview)===JSON.stringify(before.preview)&&JSON.stringify(ui.metrics)===JSON.stringify(before.metrics);
    const highlighted=ui.activeOverlayKey===key&&active.length===1&&active[0].key===key&&ui.activeSvg.some(c=>c.split(' ').includes('is-route-'+provider+'-'+idx));
    const checked={key,preserved,highlighted,chosen:ui.compare.chosen,ui:compact(ui)};
    run.overlayChecks.push(checked);
    assert(preserved&&highlighted&&!ui.compare.chosen,'live_overlay_semantics_changed_'+key);
  }
}

async function execute(browser,candidate,kind,expectBug=false) {
  const run={name:candidate.label+'-'+kind,candidateSha256:candidate.sha,kind,expectBug,phase:'startup',inputChecks:[],requests:[],pageErrors:[],
    selections:[],saved:[],savedExpected:[],documentServes:0,network:{mockedOrs:0,blocked:0,websocketsBlocked:0,forwarded:0,blockedOrigins:{}},passed:false};
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block',acceptDownloads:false,permissions:[],ignoreHTTPSErrors:false});
  await ctx.routeWebSocket('**/*',ws=>{run.network.websocketsBlocked++;ws.close();});
  await ctx.route('**/*',async route=>{
    const req=route.request(),u=new URL(req.url());
    if(req.url()===CANDIDATE_URL&&req.method()==='GET'){
      run.documentServes++;return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:candidate.bytes});
    }
    if(u.origin===ORIGIN&&u.pathname==='/ors/v2/directions/foot-hiking/geojson'&&req.method()==='POST'){
      const body=req.postDataJSON();
      run.requests.push({kind:'orsRoute',phase:run.phase,body});
      if(run.phase!=='action'||run.network.mockedOrs!==0||!Array.isArray(body?.coordinates)||body.coordinates.length!==2||
        !body.coordinates.every((p,i)=>Math.abs(p[0]-SYNTHETIC[i].lon)<1e-8&&Math.abs(p[1]-SYNTHETIC[i].lat)<1e-8)){
        run.network.unexpectedRoute=true;return route.abort('blockedbyclient');
      }
      run.network.mockedOrs++;
      return route.fulfill({status:200,contentType:'application/geo+json',body:fixtureBytes});
    }
    run.network.blocked++;run.network.blockedOrigins[u.origin]=(run.network.blockedOrigins[u.origin]||0)+1;
    return route.abort('blockedbyclient');
  });
  const page=await ctx.newPage();page.setDefaultTimeout(12000);
  page.on('pageerror',e=>run.pageErrors.push(String(e.message||e).slice(0,500)));
  page.on('dialog',d=>d.dismiss());
  try{
    await enterUi(page,run,{service:'ors',profile:'foot-hiking'});
    run.phase='action';await page.locator('#routingCalculateBtn').click();
    await page.waitForFunction(()=>!state._routing.requestLoading&&state._routing.alternatives?.length===3,null,{timeout:10000});
    assert(run.network.mockedOrs===1,'mock_response_not_consumed_once');
    run.initial=compact(await snapshot(page));
    run.seed=await seedCompareSession(page,kind);
    if(expectBug){
      await page.locator('#routingAlternativesChips button[data-routing-alt-provider="ors"][data-routing-alt-index="1"]').click();
      const ui=await snapshot(page);
      run.observed=compact(ui);
      run.bugReproduced=ui.activeOverlayKey==='ors:1'&&ui.selectedAlternative===0&&pointsEqual(ui.preview,fixture.features[0].geometry.coordinates)&&!pointsEqual(ui.preview,fixture.features[1].geometry.coordinates);
      assert(run.bugReproduced,'expected_original_bug_not_reproduced');
    }else if(kind.startsWith('live-')){
      await verifyLiveOverlay(page,run,kind);
    }else{
      if(kind==='chosen'){
        await page.locator('#routingCompareChooseOrs').click();
        assert((await readUi(page)).compare.chosen==='ors','choose_ors_action_failed');
      }
      for(const index of [1,2,0])await normalSelection(page,run,index);
      await verifySavedReopen(page,run);
    }
    assert(!run.network.unexpectedRoute&&run.network.mockedOrs===1&&run.network.forwarded===0,'network_contract_failed');
    assert(run.pageErrors.length===0,'page_errors');
    run.passed=true;
  }catch(e){
    run.failure=String(e.message||e).slice(0,1200);
    try{run.failureUi=compact(await snapshot(page));}catch(_){}
    try{await page.screenshot({path:path.join(__dirname,run.name+'-failure.png'),fullPage:false});run.failureScreenshot=run.name+'-failure.png';}catch(_){}
  }finally{
    delete run.savedExpected;await ctx.close();
  }
  return run;
}

async function main(){
  const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
  for(const c of candidates){c.bytes=fs.readFileSync(c.path);assert(hash(c.bytes)===c.sha,'candidate_hash_mismatch_'+c.label);}
  assert(hash(fixtureBytes)===FIXTURE_SHA,'fixture_hash_mismatch');
  const browser=await chromium.launch({headless:true,executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    proxy:{server:'http://127.0.0.1:9'},
    args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps','--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run','--host-resolver-rules=MAP * ~NOTFOUND']});
  try{
    summary.browserVersion=browser.version();
    for(const [candidate,kind,bug] of [[candidates[0],'empty',true],[candidates[1],'empty',false],[candidates[1],'failed',false],
      [candidates[1],'chosen',false],[candidates[0],'live-one',false],[candidates[1],'live-one',false],[candidates[0],'live-two',false],[candidates[1],'live-two',false]]){
      const run=await execute(browser,candidate,kind,bug);summary.runs.push(run);
      console.log(JSON.stringify({scenario:run.name,passed:run.passed,bugReproduced:run.bugReproduced,failure:run.failure}));
      fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(summary,null,2)+'\n');
    }
    summary.overlayParity=['live-one','live-two'].map(kind=>{
      const old=summary.runs.find(r=>r.kind===kind&&r.name.startsWith('old'));
      const fixed=summary.runs.find(r=>r.kind===kind&&r.name.startsWith('fixed'));
      const reduce=r=>(r.overlayChecks||[]).map(c=>({key:c.key,preserved:c.preserved,highlighted:c.highlighted,chosen:c.chosen,
        selectedAlternative:c.ui.selectedAlternative,activeOverlayKey:c.ui.activeOverlayKey,previewSha256:c.ui.previewSha256,
        metrics:c.ui.metrics,overlays:c.ui.overlays,elevationSha256:c.ui.elevationSha256}));
      return {kind,oldPass:old.passed,fixedPass:fixed.passed,sameObservableResults:JSON.stringify(reduce(old))===JSON.stringify(reduce(fixed))};
    });
  }finally{
    await browser.close();summary.finishedAtUtc=new Date().toISOString();
    summary.afterHashes=candidates.map(c=>({label:c.label,sha256:hash(fs.readFileSync(c.path)),expected:c.sha}));
    summary.passed=summary.runs.length===8&&summary.runs.every(r=>r.passed)&&summary.afterHashes.every(h=>h.sha256===h.expected)&&summary.overlayParity?.every(p=>p.sameObservableResults);
    fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(summary,null,2)+'\n');
  }
  console.log(JSON.stringify({passed:summary.passed,cases:summary.runs.length,overlayParity:summary.overlayParity}));
  if(!summary.passed)process.exitCode=1;
}
main().catch(e=>{summary.fatal=String(e.message||e);summary.passed=false;fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(summary,null,2)+'\n');console.error(summary.fatal);process.exitCode=1;});
