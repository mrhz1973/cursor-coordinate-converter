const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
const http=require('http'),fs=require('fs'),assert=require('assert');
const dir='C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mobile-workbench-fix/';
const files={candidate:fs.readFileSync(dir+'candidate.html'),baseline:fs.readFileSync('C:/Users/Utente/Documents/Codex/2026-10-28/gi/work/mart-gis/coordinate_converter Claude.html')};
(async()=>{
 let server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(files[req.url.slice(1)]||files.candidate)}).listen(0,'127.0.0.1'); await new Promise(r=>server.once('listening',r));
 let browser=await chromium.launch({headless:true,executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'}),results=[];
 for(const [version,w,h,touch,theme] of [['candidate',320,640,true,'dark'],['candidate',568,320,true,'light'],['candidate',390,844,true,'light'],['candidate',820,1180,true,'dark'],['baseline',1365,768,false,'dark'],['candidate',1365,768,false,'dark'],['candidate',320,480,true,'light'],['candidate',568,320,true,'dark']]){
  console.log('START',version,w,h); let context=await browser.newContext({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch,serviceWorkers:'block'}), blocked=0;
  await context.route('**/*',route=>{if(new URL(route.request().url()).hostname==='127.0.0.1')return route.continue();blocked++;return route.abort()}); let p=await context.newPage(); p.setDefaultTimeout(3500); let result={version,w,h,touch,theme};
  try{
   await p.goto(`http://127.0.0.1:${server.address().port}/${version}`,{waitUntil:'domcontentloaded',timeout:60000});await p.waitForTimeout(600);
   await p.evaluate(theme=>{document.documentElement.dataset.theme=theme;state.mapWaypoints=Array.from({length:12},(_,i)=>({id:'test-wp-'+i,name:'Synthetic '+String(i).padStart(2,'0'),lat:41+i*.01,lon:12+i*.01}));state.savedTracks=[{id:'test-track',name:'Synthetic track',points:[{lat:41,lon:12},{lat:41.01,lon:12.01}]}]; state.gisPolygons=[]; openGisWorkbenchPanel();},theme);
   let panel=p.locator('#gisWorkbenchPanel'); await p.waitForTimeout(150);
   result.initial=await panel.evaluate(e=>{let b=e.getBoundingClientRect(),body=e.querySelector('#gisWorkbenchPanelBody').getBoundingClientRect(); return {rect:b.toJSON(),body:body.toJSON(),scrollHeight:e.scrollHeight,clientHeight:e.clientHeight,overflow:getComputedStyle(e).overflowY,rows:e.querySelectorAll('.wb-row').length,styles:{flex:getComputedStyle(e.querySelector('#gisWorkbenchPanelBody')).flex,maxHeight:getComputedStyle(e.querySelector('#gisWorkbenchPanelBody')).maxHeight}}});
   assert.equal(result.initial.rows,13);
   let tap=async (loc,opts)=>touch?loc.tap(opts):loc.click(opts); let chip=p.locator('[data-wb-filter="savedTrack"]');await tap(chip);assert.equal(await p.locator('.wb-row').count(),1); assert.equal(await chip.getAttribute('aria-pressed'),'true');
   await tap(p.locator('[data-wb-filter="polygon"]')); assert.equal(await p.locator('.wb-row').count(),0); assert.equal(await p.locator('.wb-empty').count(),1);
   await tap(p.locator('[data-wb-filter="waypoint"]')); assert.equal(await p.locator('.wb-row').count(),12);
   await p.locator('#gisWorkbenchSearch').fill('Synthetic 11');assert.equal(await p.locator('.wb-row').count(),1);await p.locator('#gisWorkbenchSearch').fill('');await tap(p.locator('[data-wb-filter="all"]'));
   result.filters=true;
   if(touch && w<=768){
    await panel.evaluate(e=>e.scrollTop=0); let box=await panel.boundingBox(), cdp=await context.newCDPSession(p); let x=Math.round(box.x+box.width*.5), y=Math.round(box.y+box.height-30), end=Math.round(Math.max(box.y+60,y-70));
    let before=await panel.evaluate(e=>e.scrollTop); await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+(end-y)*i/8}]});await p.waitForTimeout(20)} await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(300);let after=await panel.evaluate(e=>e.scrollTop);result.touchScroll={before,after};assert(after>before,'touch swipe did not scroll panel');
   }
   let last=p.locator('.wb-row').last(); await last.scrollIntoViewIfNeeded(); let actions=last.locator('button');result.lastActions=[];
   for(let i=0;i<2;i++){let b=await actions.nth(i).boundingBox(),pb=await panel.boundingBox();let visible=await actions.nth(i).evaluate(e=>{let b=e.getBoundingClientRect();return document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)?.closest('button')===e}); result.lastActions.push({box:b,insidePanel:b.x>=pb.x-1&&b.x+b.width<=pb.x+pb.width+1&&b.y>=pb.y-1&&b.y+b.height<=pb.y+pb.height+1,hit:visible}); if(version==='candidate' && w<=768) assert(result.lastActions[i].insidePanel&&visible,'action clipped or occluded');}
   await tap(last,{position:{x:Math.min(65,(await last.boundingBox()).width-5),y:10}}); assert.equal(await last.getAttribute('aria-selected'),'true'); result.select=true;
   let first=p.locator('.wb-row[data-wb-kind="waypoint"]').first();await tap(first.locator('[data-wb-fly]')); result.flySelected=await first.getAttribute('aria-selected');
   await tap(first.locator('[data-wb-open]')); result.openWaypoint=await p.locator('#waypointModal').evaluate(e=>e.open); assert(result.openWaypoint,'open action failed');
   await p.screenshot({path:dir+`${version}-${w}x${h}-${theme}.png`});
  }catch(e){result.error=e.stack; console.log('ERROR', result.error);}result.blocked=blocked;results.push(result);await context.close();
 }
 fs.writeFileSync(dir+'results.json',JSON.stringify(results,null,2)); console.log(JSON.stringify(results,null,2));await browser.close();server.close();if(results.some(r=>r.error))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});


