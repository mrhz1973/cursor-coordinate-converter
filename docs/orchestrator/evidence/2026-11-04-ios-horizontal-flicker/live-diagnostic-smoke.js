const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');
const origin='http://100.99.54.93:8000';
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const context=await browser.newContext({...devices['iPhone 13 Pro'],viewport:{width:390,height:844},screen:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
    const page=await context.newPage(), errors=[], posts=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>{if(route.request().method()==='POST')posts.push(route.request().url());return new URL(route.request().url()).origin===origin?route.continue():route.abort('blockedbyclient');});
    await page.goto(`${origin}/diagnostica-viewport-273.html`,{waitUntil:'domcontentloaded',timeout:60000});
    const secure=await page.evaluate(()=>isSecureContext);
    await page.locator('#start').click();
    await page.waitForFunction(()=>window.__tmartViewportProbe&&document.body.classList.contains('gis-mode')&&document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'),{timeout:60000});
    await page.setViewportSize({width:844,height:390});await page.waitForTimeout(300);
    const result=await page.evaluate(()=>{window.__tmartViewportProbe.stop();return {build:APP_BUILD_NUM,probe:window.__tmartViewportProbe.result,path:location.pathname,textarea:!!document.getElementById('vpReport')};});
    const pass=!secure&&result.build===273&&result.probe.sourceSha256==='4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a'&&result.probe.samplesTaken>0&&result.textarea&&posts.length===0&&errors.length===0;
    console.log(JSON.stringify({pass,insecureHttpFallback:!secure,build:result.build,sourceSha256:result.probe.sourceSha256,samples:result.probe.samplesTaken,textarea:result.textarea,posts,errors},null,2));
    await context.close();if(!pass)process.exitCode=1;
  } finally {await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
