const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');
const repo = path.resolve(__dirname,'../../../..');
const diagnostic = fs.readFileSync(path.join(repo,'diagnostica-viewport-273.html'));
const app = fs.readFileSync(path.join(repo,'coordinate_converter Claude.html'));
const server = http.createServer((req,res) => {
  const name = decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  if (name === '/diagnostica-viewport-273.html') {res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(diagnostic);return;}
  if (name === '/coordinate_converter Claude.html') {res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(app);return;}
  const target = path.resolve(repo, `.${name}`);
  if (!target.startsWith(repo+path.sep)) {res.writeHead(403).end();return;}
  fs.readFile(target,(err,data)=>{if(err){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':path.extname(target)==='.svg'?'image/svg+xml':'application/octet-stream'});res.end(data);});
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const context=await browser.newContext({...devices['iPhone 13 Pro'],viewport:{width:390,height:844},screen:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
    const page=await context.newPage(),errors=[],posts=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',route=>{if(route.request().method()==='POST')posts.push(route.request().url());return new URL(route.request().url()).origin===origin?route.continue():route.abort('blockedbyclient');});
    await page.goto(`${origin}/diagnostica-viewport-273.html`,{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>localStorage.setItem('tmart-probe-sentinel','unchanged'));
    const hashes=await page.evaluate(async()=>({vector:sha256Sync(new TextEncoder().encode('abc').buffer),source:sha256Sync(await (await fetch('./coordinate_converter%20Claude.html?v=273')).arrayBuffer())}));
    await page.locator('#start').click();
    await page.waitForFunction(()=>window.__tmartViewportProbe && document.body.classList.contains('gis-mode') && document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'),{timeout:60000});
    await page.setViewportSize({width:844,height:390});
    await page.waitForTimeout(500);
    const toggle=page.locator('#gisMapMount [data-role="basemap-menu-toggle"]');const b=await toggle.boundingBox();await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);
    const layerOpen=await page.locator('#gisMapMount [data-role="basemap-menu"]').evaluate(el=>!el.hidden&&getComputedStyle(el).display!=='none');
    if (process.argv.includes('--auto')) await page.waitForSelector('#vpReport',{timeout:38000});
    else await page.evaluate(()=>window.__tmartViewportProbe.stop());
    const state=await page.evaluate(()=>({path:location.pathname,build:APP_BUILD_NUM,sentinel:localStorage.getItem('tmart-probe-sentinel'),result:window.__tmartViewportProbe.result,textarea:document.getElementById('vpReport')?.value}));
    const forbidden=Object.keys(state.result).filter(k=>/lat|lon|coordinate|mapdata|storage/i.test(k));
    const expectedSha='4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a';
    const pass=decodeURIComponent(state.path)==='/coordinate_converter Claude.html'&&state.build===273&&state.result.sourceSha256===expectedSha&&hashes.source===expectedSha&&hashes.vector==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'&&state.sentinel==='unchanged'&&layerOpen&&state.result.samplesTaken>0&&state.result.changes.some(x=>x.visual&&x.root&&x.header&&x.map)&&state.textarea===JSON.stringify(state.result)&&forbidden.length===0&&posts.length===0&&errors.length===0;
    const output={pass,layerOpen,path:state.path,build:state.build,sourceSha256:state.result.sourceSha256,hashes,sentinel:state.sentinel,samplesTaken:state.result.samplesTaken,counts:state.result.counts,changeCount:state.result.changes.length,reportLength:state.textarea.length,forbidden,posts,errors};
    const outputName=process.argv.includes('--auto')?'diagnostic-smoke-auto-results.json':'diagnostic-smoke-results.json';
    fs.writeFileSync(path.join(__dirname,outputName),JSON.stringify(output,null,2));console.log(JSON.stringify(output,null,2));
    server.closeAllConnections();await context.close();if(!pass)process.exitCode=1;
  } finally {server.closeAllConnections();await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1;});
