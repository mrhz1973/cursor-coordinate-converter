const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{execFileSync}=require('node:child_process');
const {chromium,webkit,devices}=require(process.env.TMART_PLAYWRIGHT_PATH || 'C:/goi-pw-probe/node_modules/playwright');
const repo=path.resolve(__dirname,'../../../..');
const old=execFileSync('git',['show','1659f4d60fe415e4b83493dc16ebc14a4fe59596:coordinate_converter Claude.html'],{cwd:repo,maxBuffer:32*1024*1024}),candidate=fs.readFileSync(path.join(repo,'coordinate_converter Claude.html'));
const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);if(name==='/baseline.html'||name==='/candidate.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(name==='/baseline.html'?old:candidate);return;}const file=path.resolve(repo,`.${name}`);if(!file.startsWith(repo+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,b)=>e?res.writeHead(404).end():res.end(b));});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`,results=[];
try{for(const engine of ['webkit','edge']){
 const browser=engine==='webkit'?await webkit.launch({headless:true,executablePath:process.env.TMART_WEBKIT_EXECUTABLE || undefined}):await chromium.launch({channel:'msedge',headless:true});
 for(const build of (process.env.TMART_QUICK==='1'||process.env.TMART_ONLY_CANDIDATE==='1'?['candidate']:['baseline','candidate']))for(const viewport of (process.env.TMART_QUICK==='1'?[{width:926,height:359},{width:428,height:926}]:[{width:832,height:359},{width:926,height:359},{width:428,height:926},{width:667,height:375}])){
  const ctx=await browser.newContext({...devices['iPhone 13 Pro'],viewport,screen:viewport,deviceScaleFactor:3}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort('blockedbyclient'));
  try{
   await page.goto(`${origin}/${build}.html`,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForSelector('#gisMapMount [data-role="basemap-menu-toggle"]',{timeout:60000});await page.waitForTimeout(400);
   const geometry=await page.evaluate(()=>{const root=document.documentElement,header=document.querySelector('body.gis-mode>header'),inner=header.querySelector('.header-inner'),icon=header.querySelector('.hdr-iconbar'),r=icon.getBoundingClientRect();return {clientWidth:root.clientWidth,scrollWidth:root.scrollWidth,headerHeight:header.getBoundingClientRect().height,innerDisplay:getComputedStyle(inner).display,iconRight:r.right,scrollX};});
   const settings=page.locator('#btnHeaderSettings'),s=await settings.boundingBox();await page.touchscreen.tap(s.x+s.width/2,s.y+s.height/2);const settingsOpen=await page.locator('#headerSettingsMenu').evaluate(el=>!el.hidden);await page.touchscreen.tap(s.x+s.width/2,s.y+s.height/2);
   const toggle=page.locator('#gisMapMount [data-role="basemap-menu-toggle"]'),b=await toggle.boundingBox();await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);await page.waitForTimeout(150);
   const layer=await page.evaluate(()=>{const m=document.querySelector('#gisMapMount [data-role="basemap-menu"]'),r=m.getBoundingClientRect(),x=Math.max(0,Math.min(innerWidth-1,r.left+Math.min(30,r.width/2))),y=Math.max(0,Math.min(innerHeight-1,r.top+Math.min(30,r.height/2))),el=document.elementFromPoint(x,y);return {open:!m.hidden,hit:!!(el&&m.contains(el))};});
   await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);const layerClosed=await page.locator('#gisMapMount [data-role="basemap-menu"]').evaluate(el=>el.hidden);
   let layerSelection=null;
   if(process.env.TMART_QUICK==='1'){
    const reopened=await toggle.boundingBox();await page.touchscreen.tap(reopened.x+reopened.width/2,reopened.y+reopened.height/2);
    const item=page.locator('#gisMapMount .tlayer-item[data-layer="osmHot"]'),ib=await item.boundingBox();await page.touchscreen.tap(ib.x+ib.width/2,ib.y+ib.height/2);
    await page.waitForTimeout(250);layerSelection=await page.evaluate(()=>({selected:state.mapLayer==='osmHot',closed:!state.mapBasemapMenuOpen}));
   }
   const relevant=viewport.width>=769&&viewport.height<=600;const pass=errors.length===0&&settingsOpen&&layer.open&&layer.hit&&layerClosed&&(!layerSelection||(layerSelection.selected&&layerSelection.closed))&&(build!=='candidate'||!relevant||(geometry.scrollWidth===geometry.clientWidth&&geometry.iconRight<=geometry.clientWidth&&geometry.innerDisplay==='block'));
   results.push({engine,build,viewport,geometry,settingsOpen,layer,layerClosed,layerSelection,errors,pass});if(!pass)process.exitCode=1;
  }catch(e){results.push({engine,build,viewport,error:String(e.stack||e),errors,pass:false});process.exitCode=1;}finally{await ctx.close();}
 }
 await browser.close();
}}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
fs.writeFileSync(path.join(__dirname,process.env.TMART_QUICK==='1'?'header-layer-selection-results.json':process.env.TMART_ONLY_CANDIDATE==='1'?'header-final-results.json':'header-candidate-results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({engine:r.engine,build:r.build,width:r.viewport.width,root:r.geometry&&[r.geometry.clientWidth,r.geometry.scrollWidth],iconRight:r.geometry?.iconRight,layout:r.geometry?.innerDisplay,settingsOpen:r.settingsOpen,layer:r.layer,layerSelection:r.layerSelection,pass:r.pass,error:r.error}))));
})().catch(e=>{console.error(e.stack||e);server.close();process.exitCode=1;});
