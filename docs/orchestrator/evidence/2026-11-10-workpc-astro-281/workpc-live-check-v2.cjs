'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const pptr=require('C:/Users/Utente/AppData/Local/npm-cache/_npx/4b4c857f6efdfb61/node_modules/puppeteer/lib/puppeteer/puppeteer.js');
const BASE=__dirname,SHA='e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62';
const URL='https://ionos-n8n-new.tailc01234.ts.net/gis?v='+SHA;
const result={startedAtUtc:new Date().toISOString(),scope:'work_pc_native_https_astro_desktop_readiness',sourceMode:'native_http_document',physicalPhoneQA:false,checks:[],pageErrors:[],requests:{documents:0,blocked:0,postAttempts:0}};
let browser;
function save(){fs.writeFileSync(path.join(BASE,'workpc-live-result-v2.json'),JSON.stringify(result,null,2)+'\n');}
function check(name,ok){result.checks.push({name,ok:!!ok});if(!ok)throw Error(name);}
const watchdog=setTimeout(()=>{result.status='INCOMPLETE';result.error='harness_deadline_80s';result.finishedAtUtc=new Date().toISOString();save();const p=browser&&browser.process();if(p&&!p.killed)p.kill();console.log(JSON.stringify(result));process.exit(2);},80000);
(async()=>{try{
 browser=await pptr.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',timeout:20000,args:['--disable-background-networking','--disable-component-update','--disable-sync','--disable-default-apps','--disable-features=MediaRouter,OptimizationHints,AutofillServerCommunication','--no-first-run']});
 result.browserVersion=await browser.version();result.nodeVersion=process.version;
 const context=await browser.createBrowserContext(),page=await context.newPage();
 await page.setViewport({width:1440,height:1000});await page.setRequestInterception(true);
 const cdp=await page.createCDPSession();let documentRequestId;let documentFinished;
 const documentLoaded=new Promise(resolve=>{documentFinished=resolve;});
 cdp.on('Network.requestWillBeSent',e=>{if(e.type==='Document'&&e.request.url===URL)documentRequestId=e.requestId;});
 cdp.on('Network.loadingFinished',e=>{if(e.requestId===documentRequestId)documentFinished();});
 await cdp.send('Network.enable',{maxTotalBufferSize:48*1024*1024,maxResourceBufferSize:24*1024*1024});
 page.on('pageerror',e=>result.pageErrors.push(String(e.message).slice(0,500)));
 page.on('request',r=>{if(r.method()==='POST')result.requests.postAttempts++;if(r.method()==='GET'&&r.isNavigationRequest()&&r.frame()===page.mainFrame()&&r.url()===URL){result.requests.documents++;r.continue();}else{result.requests.blocked++;r.abort('blockedbyclient');}});
 const response=await page.goto(URL,{waitUntil:'domcontentloaded',timeout:30000});
 check('native_http_200',response&&response.status()===200);
 let bodyTimer;try{await Promise.race([documentLoaded,new Promise((_,reject)=>{bodyTimer=setTimeout(()=>reject(Error('native_document_capture_timeout')),5000);})]);}finally{clearTimeout(bodyTimer);}
 const capturedBody=await cdp.send('Network.getResponseBody',{requestId:documentRequestId});
 const bytes=Buffer.from(capturedBody.body,capturedBody.base64Encoded?'base64':'utf8');result.responseBodyCapture='buffered_cdp_native_document';result.runtimeBytes=bytes.length;result.runtimeSha256=crypto.createHash('sha256').update(bytes).digest('hex');
 check('served_runtime_identity',bytes.length===11108861&&result.runtimeSha256===SHA);
 const opener=await page.waitForFunction(()=>['#btnTopbarTools','#btnTools'].find(s=>{const e=document.querySelector(s);return e&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden';}),{timeout:12000});
 await page.click(await opener.jsonValue());await page.waitForSelector('#toolsMenuGrid [data-tool="astro"]',{visible:true,timeout:5000});
 await page.click('#toolsMenuGrid [data-tool="astro"]');await page.waitForFunction(()=>document.getElementById('astroPanel')?.open,{timeout:5000});
 check('astro_opened_from_tools',true);
 result.controls=await page.evaluate(()=>['#astroPanelHead','#astroPanelClose','[data-role="astropanel-minimize"]'].map(s=>{const e=document.querySelector(s),r=e?.getBoundingClientRect();if(!r)return{selector:s,reachable:false,fullyInsideViewport:false};const x=r.x+r.width/2,y=r.y+r.height/2,h=document.elementFromPoint(x,y);return{selector:s,reachable:x>=0&&y>=0&&x<innerWidth&&y<innerHeight&&!!h&&(h===e||e.contains(h)),fullyInsideViewport:r.width>0&&r.height>0&&r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight};}));
 check('desktop_controls_reachable',result.controls.every(x=>x.reachable));
 check('desktop_controls_inside_viewport',result.controls.every(x=>x.fullyInsideViewport));
 result.title=await page.$eval('#astroPanelHead',e=>e.innerText.trim());
 check('astro_header_has_text',result.title.length>0);
 await page.click('[data-role="astropanel-minimize"]');await page.waitForFunction(()=>document.getElementById('astroPanel')?.classList.contains('gis-panel-minimized'),{timeout:5000});
 check('desktop_minimized',true);
 await page.waitForSelector('#gisMinimizedDock [data-gis-min-panel="astroPanel"]',{visible:true,timeout:5000});
 await page.click('#gisMinimizedDock [data-gis-min-panel="astroPanel"]');
 await page.waitForFunction(()=>document.getElementById('astroPanel')?.open&&!document.getElementById('astroPanel').classList.contains('gis-panel-minimized'),{timeout:5000});
 check('desktop_restored',true);await page.click('#astroPanelClose');await page.waitForFunction(()=>!document.getElementById('astroPanel')?.open,{timeout:5000});
 check('desktop_closed',true);check('no_post_attempts',result.requests.postAttempts===0);check('no_captured_page_errors',result.pageErrors.length===0);result.status='PASS';
}catch(e){result.status='FAIL_UNCLASSIFIED';result.error=String(e.message).slice(0,1000);}
finally{
 result.finishedAtUtc=new Date().toISOString();save();
 if(browser){let closeTimer;try{await Promise.race([browser.close(),new Promise((_,reject)=>{closeTimer=setTimeout(()=>reject(Error('browser_cleanup_timeout')),5000);})]);result.cleanup='closed';}catch(e){result.cleanup=String(e.message).slice(0,200);const p=browser.process();if(p&&!p.killed)p.kill();}finally{clearTimeout(closeTimer);}}
 clearTimeout(watchdog);save();console.log(JSON.stringify(result));process.exitCode=result.status==='PASS'?0:1;
}})();
