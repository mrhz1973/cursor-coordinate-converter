const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium,webkit,devices}=require(process.env.TMART_PLAYWRIGHT_PATH || 'C:/goi-pw-probe/node_modules/playwright');
const repo=path.resolve(__dirname,'../../../..');
const app=fs.readFileSync(path.join(repo,'coordinate_converter Claude.html'));
const sha=crypto.createHash('sha256').update(app).digest('hex');
const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);if(name==='/app.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(app);return;}const file=path.resolve(repo,`.${name}`);if(!file.startsWith(repo+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,b)=>e?res.writeHead(404).end():res.end(b));});
async function snapshot(page){return page.evaluate(()=>{const ctrls=document.querySelector('#gisMapMount .tile-ctrls'),menu=document.querySelector('#gisMapMount [data-role="basemap-menu"]'),toggle=document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'),r=menu.getBoundingClientRect(),s=getComputedStyle(ctrls);let hit=false;if(r.width>0&&r.height>0){const x=Math.max(0,Math.min(innerWidth-1,r.left+Math.min(30,r.width/2))),y=Math.max(0,Math.min(innerHeight-1,r.top+Math.min(30,r.height/2)));const el=document.elementFromPoint(x,y);hit=!!(el&&menu.contains(el));}return {width:innerWidth,height:innerHeight,build:APP_BUILD_NUM,root:[document.documentElement.clientWidth,document.documentElement.scrollWidth],open:!menu.hidden,expanded:toggle.getAttribute('aria-expanded'),cls:ctrls.classList.contains('is-basemap-menu-open'),overflowX:s.overflowX,overflowY:s.overflowY,momentum:s.webkitOverflowScrolling||null,hit,menuScrollHeight:menu.scrollHeight,menuClientHeight:menu.clientHeight,toolbarScrollHeight:ctrls.scrollHeight,toolbarClientHeight:ctrls.clientHeight};});}
async function tapToggle(page){const box=await page.locator('#gisMapMount [data-role="basemap-menu-toggle"]').boundingBox();if(!box)throw new Error('Layer button missing');await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);await page.waitForTimeout(180);}
async function tapOutside(page){const r=await page.locator('#gisMapMount').boundingBox();await page.touchscreen.tap(Math.max(3,r.x+12),Math.min(r.y+r.height-5,r.y+22));await page.waitForTimeout(120);}
function checkOpen(s,mobile){return s.open&&s.expanded==='true'&&s.cls&&s.hit&&(!mobile||(s.overflowX==='visible'&&s.overflowY==='visible'));}
function checkClosed(s,mobile){return !s.open&&s.expanded==='false'&&!s.cls&&(!mobile||(s.overflowX==='hidden'&&s.overflowY==='auto'));}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`,results=[];
try{for(const engine of ['webkit','edge']){
 const browser=engine==='webkit'?await webkit.launch({headless:true,executablePath:process.env.TMART_WEBKIT_EXECUTABLE || undefined}):await chromium.launch({channel:'msedge',headless:true});
 for(const viewport of [{width:428,height:737},{width:390,height:668},{width:667,height:375},{width:926,height:359}]){
  const ctx=await browser.newContext({...devices['iPhone 13 Pro'],viewport,screen:viewport,deviceScaleFactor:3}),page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort('blockedbyclient'));
  const out={engine,viewport,errors,checks:{},samples:{}};
  try{
   await page.goto(`${origin}/app.html`,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForSelector('#gisMapMount [data-role="basemap-menu-toggle"]',{timeout:60000});await page.waitForTimeout(450);
   const mobile=viewport.width<=768||(viewport.width<=926&&viewport.height<=480&&viewport.width>viewport.height);
   out.samples.initial=await snapshot(page);out.checks.initial=checkClosed(out.samples.initial,mobile)&&out.samples.initial.build===274;
   await tapToggle(page);out.samples.open=await snapshot(page);out.checks.open=checkOpen(out.samples.open,mobile);
   out.checks.menuScroll=await page.evaluate(()=>{const m=document.querySelector('#gisMapMount [data-role="basemap-menu"]');if(m.scrollHeight<=m.clientHeight+2)return true;m.scrollTop=80;const ok=m.scrollTop>0;m.scrollTop=0;return ok;});
   await tapToggle(page);out.samples.toggleClosed=await snapshot(page);out.checks.toggleClosed=checkClosed(out.samples.toggleClosed,mobile);
   await tapToggle(page);await tapOutside(page);out.samples.outsideClosed=await snapshot(page);out.checks.outsideClosed=checkClosed(out.samples.outsideClosed,mobile);
   await tapToggle(page);await page.keyboard.press('Escape');await page.waitForTimeout(250);out.samples.escapeClosed=await snapshot(page);out.checks.escapeClosed=checkClosed(out.samples.escapeClosed,mobile);
   await tapToggle(page);await page.evaluate(()=>{const p=state.lastPoint||state.viewCenter;if(!p||!Number.isFinite(p.lat)||!Number.isFinite(p.lon))throw new Error('map center unavailable');renderTileMap(p.lat,p.lon,state.mapZoom||11);});await page.waitForTimeout(450);out.samples.afterRedraw=await snapshot(page);out.checks.redraw=checkOpen(out.samples.afterRedraw,mobile);
   if(viewport.width===428){
    await page.setViewportSize({width:926,height:359});await page.waitForTimeout(600);out.samples.rotated=await snapshot(page);out.checks.rotationLandscape=checkOpen(out.samples.rotated,true)&&out.samples.rotated.root[0]===out.samples.rotated.root[1];
    await page.setViewportSize(viewport);await page.waitForTimeout(600);out.samples.rotatedBack=await snapshot(page);out.checks.rotationPortrait=checkOpen(out.samples.rotatedBack,true);
   }
   const item=page.locator('#gisMapMount .tlayer-item[data-layer="osmHot"]');await item.scrollIntoViewIfNeeded();const ib=await item.boundingBox();await page.touchscreen.tap(ib.x+ib.width/2,ib.y+ib.height/2);await page.waitForTimeout(450);out.samples.afterSelection=await snapshot(page);
   out.checks.selection=await page.evaluate(()=>state.mapLayer==='osmHot'&&!state.mapBasemapMenuOpen);out.checks.selectionClosed=checkClosed(out.samples.afterSelection,mobile);
   out.toolbarScroll=await page.evaluate(()=>{const c=document.querySelector('#gisMapMount .tile-ctrls'),max=c.scrollHeight-c.clientHeight;if(max<2)return {needed:false,pass:true};c.scrollTop=max;const b=c.querySelector('.tgps-btn'),r=b&&b.getBoundingClientRect(),x=r&&r.left+r.width/2,y=r&&r.top+r.height/2,el=r&&x>=0&&x<innerWidth&&y>=0&&y<innerHeight?document.elementFromPoint(x,y):null,visible=!!(r&&r.top>=0&&r.bottom<=innerHeight),hit=!!(el&&b.contains(el)),scrolled=c.scrollTop>0;c.scrollTop=0;return {needed:true,max,scrolled,visible,hit,pass:scrolled&&visible&&hit};});out.checks.toolbarScroll=out.toolbarScroll.pass;
   out.pass=Object.values(out.checks).every(Boolean)&&errors.length===0;if(!out.pass)process.exitCode=1;
  }catch(e){out.error=String(e.stack||e);out.pass=false;process.exitCode=1;}
  results.push(out);await ctx.close();
 }await browser.close();
}}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
const output={candidateSha256:sha,description:'WebKit and Edge on Windows with touch/viewport emulation; not physical iOS',results};fs.writeFileSync(path.join(__dirname,'layer-visibility-candidate-results.json'),JSON.stringify(output,null,2));console.log(JSON.stringify(results.map(r=>({engine:r.engine,viewport:r.viewport,checks:r.checks,pass:r.pass,error:r.error,errors:r.errors}))));
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1;});
