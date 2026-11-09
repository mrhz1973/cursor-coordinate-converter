"use strict";
const fs=require('fs'),path=require('path');
const source=fs.readFileSync(path.join(__dirname,'real-routing-280.cjs'),'utf8');
const prefix=source.slice(0,source.indexOf('async function main(){'));
const appendix=String.raw`
const proof={candidateSha256:EXPECTED_SHA,mode:'offline_policy_ui_preparation',realNetworkRequests:0,
  startedAtUtc:new Date().toISOString(),inputChecks:[],requests:[],policyProviderAttempts:[],favicon:[]};
async function policyOfflineMain(){
  const bytes=fs.readFileSync(APP);assert(hash(bytes)===EXPECTED_SHA,'candidate_hash_mismatch');
  const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
  const browser=await chromium.launch({headless:true,
    executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',
    args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps',
      '--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']});
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block',permissions:[],acceptDownloads:false});
  await ctx.routeWebSocket('**/*',ws=>ws.close());
  await ctx.route('**/*',route=>{
    const req=route.request(),u=new URL(req.url());
    if(req.url()===CANDIDATE_URL&&req.method()==='GET')return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:bytes});
    if(/^\/(?:_routing\/gh\/|ors\/|v2\/directions\/)|^\/(?:info|nearest|route)$/.test(u.pathname))
      proof.policyProviderAttempts.push({method:req.method(),origin:u.origin,pathname:u.pathname});
    return route.abort('blockedbyclient');
  });
  const page=await ctx.newPage();page.setDefaultTimeout(7000);page.on('dialog',d=>d.dismiss());
  const cdp=await ctx.newCDPSession(page),ids=new Set();
  cdp.on('Network.requestWillBeSent',e=>{if(e.request.url===ORIGIN+'/favicon.ico')ids.add(e.requestId);});
  cdp.on('Network.responseReceived',e=>{if(e.response.url===ORIGIN+'/favicon.ico')proof.favicon.push({status:e.response.status});});
  cdp.on('Network.loadingFailed',e=>{if(ids.has(e.requestId))proof.favicon.push({error:e.errorText,blockedReason:e.blockedReason});});
  await cdp.send('Network.enable');await cdp.send('Network.setBlockedURLs',{urls:[ORIGIN+'/favicon.ico']});
  try{
    await policyChecksUi(page,proof,{name:'offline-policy-ui',service:'graphhopper',profile:'mtb_trail',compare:true});
    assert(proof.policyProviderAttempts.length===0,'offline_policy_provider_request');
    assert(proof.favicon.every(x=>!x.status),'favicon_not_blocked');
    proof.passed=true;
  }catch(e){proof.error=e.message;proof.ui=await readUi(page);delete proof.ui.preview;
    await page.screenshot({path:path.join(__dirname,'policy-preparation-failure.png')});
  }finally{await ctx.close();await browser.close();proof.finishedAtUtc=new Date().toISOString();
    fs.writeFileSync(path.join(__dirname,'post-policy-offline-proof.json'),JSON.stringify(proof,null,2)+'\n');}
  console.log(JSON.stringify({passed:!!proof.passed,error:proof.error,checks:proof.policyChecks,
    providerAttempts:proof.policyProviderAttempts.length,favicon:proof.favicon}));
  if(!proof.passed)process.exitCode=1;
}
policyOfflineMain().catch(e=>{console.error(e.message);process.exitCode=1;});
`;
eval(prefix+'\n'+appendix);
