const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');
const repoRoot = path.resolve(__dirname, '../../../../');
const evidenceDir = __dirname;
const html = fs.readFileSync(path.join(repoRoot, 'coordinate_converter Claude.html'));
const profiles = [
  { id: 'iphone-portrait-390x844', width: 390, height: 844, mobile: true },
  { id: 'iphone-landscape-844x390', width: 844, height: 390, mobile: true, landscape: true },
  { id: 'iphone-small-landscape-667x375', width: 667, height: 375, mobile: true, landscape: true },
  { id: 'iphone-small-portrait-320x568', width: 320, height: 568, mobile: true },
  { id: 'chromium-native-fullscreen-390x844', width: 390, height: 844, mobile: false, nativeFullscreen: true },
  { id: 'desktop-1280x800', width: 1280, height: 800, mobile: false },
];
const tileFixture='<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" fill="#dbe7d4"/><path d="M-20 56 C30 28 76 78 124 52 S205 40 280 76 M-20 184 C35 146 83 207 132 175 S210 159 280 192" fill="none" stroke="#8db2c6" stroke-width="10"/><path d="M20 -20 C48 38 28 94 63 139 S76 213 102 276 M195 -20 C163 39 207 90 178 140 S202 210 168 276" fill="none" stroke="#faf7df" stroke-width="12"/><path d="M20 -20 C48 38 28 94 63 139 S76 213 102 276 M195 -20 C163 39 207 90 178 140 S202 210 168 276" fill="none" stroke="#d5be82" stroke-width="2"/><path d="M0 0H256V256H0Z" fill="none" stroke="#839481" stroke-width="1"/><text x="12" y="24" font-family="sans-serif" font-size="11" fill="#58665b">QA MAP TILE</text></svg>';
function startServer(){
  return new Promise((resolve,reject)=>{
    const server=http.createServer((req,res)=>{
      const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
      if(pathname==='/app.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html);return;}
      const target=path.resolve(repoRoot,`.${pathname}`);
      if(target!==repoRoot&&!target.startsWith(repoRoot+path.sep)){res.writeHead(403).end();return;}
      fs.readFile(target,(err,bytes)=>{if(err){res.writeHead(404).end();return;}const ext=path.extname(target).toLowerCase();res.writeHead(200,{'content-type':ext==='.svg'?'image/svg+xml':'application/octet-stream','cache-control':'no-store'});res.end(bytes);});
    });
    server.once('error',reject);server.listen(0,'127.0.0.1',()=>resolve({server,port:server.address().port}));
  });
}
async function box(page, selector){return page.evaluate(s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,display:getComputedStyle(e).display,position:getComputedStyle(e).position};},selector);}
async function mapGeometry(page){return page.evaluate(()=>{const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};const root=document.querySelector('.gis-map-mount'),mini=document.getElementById('miniMap'),surface=mini?.querySelector('.leaflet-container')||mini?.querySelector('.tile-map')||mini;const tiles=Array.from(mini?.querySelectorAll('.tile-wrap img.tile:not(.tile-hillshade):not(.tile-waymarked-hiking):not(.tile-strava-run):not(.tile-sonarchart)')||[]);return{mount:rect(root),miniMap:rect(mini),surface:rect(surface),tiles:{count:tiles.length,loaded:tiles.filter(t=>t.complete&&t.naturalWidth>0).length}};});}
async function seedMapVisualFixture(page){await page.waitForFunction(()=>{const wraps=Array.from(document.querySelectorAll('#miniMap .tile-wrap'));return wraps.length>0&&wraps.every(w=>!w.classList.contains('tile-pending'));},{timeout:8000}).catch(()=>{});return page.evaluate(async svg=>{const dataUrl='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);const wraps=Array.from(document.querySelectorAll('#miniMap .tile-wrap'));const images=[];for(const wrap of wraps){const img=wrap.querySelector('img.tile:not(.tile-hillshade):not(.tile-waymarked-hiking):not(.tile-strava-run):not(.tile-sonarchart)');if(!img)continue;img.src=dataUrl;img.style.display='block';wrap.classList.remove('tile-pending','tile-missing','tile-mission');wrap.classList.add('tile-network');const placeholder=wrap.querySelector('.tile-void');if(placeholder)placeholder.style.display='none';images.push(img);}await Promise.all(images.map(img=>img.decode().catch(()=>null)));return{count:images.length,loaded:images.filter(img=>img.complete&&img.naturalWidth>0).length};},tileFixture);}
async function tap(page, selector, mobile){const r=await box(page,selector);if(!r||r.width<1||r.height<1)throw new Error(`No visible hit target ${selector}: ${JSON.stringify(r)}`);if(mobile)await page.touchscreen.tap(r.x+r.width/2,r.y+r.height/2);else await page.mouse.click(r.x+r.width/2,r.y+r.height/2);}
async function readMenu(page){return page.evaluate(()=>{const root=document.getElementById('miniMap');const menu=root?.querySelector('[data-role="basemap-menu"]');const btn=root?.querySelector('[data-role="basemap-menu-toggle"]');return{open:!!menu&&!menu.hidden&&getComputedStyle(menu).display!=='none',expanded:btn?.getAttribute('aria-expanded')||null,nodePreserved:root?.querySelector('.tile-map')===window.__mobileRegression?.beforeTileMap,renderCalls:window.__mobileRegression?.renderCalls||0,menuRect:menu?(()=>{const r=menu.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,withinViewport:r.left>=0&&r.top>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1};})():null};});}
async function run(browser, origin, profile){
  process.stdout.write(`START ${profile.id}\n`);
  const device=profile.mobile?devices['iPhone 13 Pro']:{};
  const context=await browser.newContext({...device,viewport:{width:profile.width,height:profile.height},...(profile.mobile?{screen:{width:profile.width,height:profile.height},deviceScaleFactor:1}:{}),hasTouch:profile.mobile,isMobile:profile.mobile});
  const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort('blockedbyclient'));
  if(profile.mobile)await context.addInitScript(()=>{try{Object.defineProperty(Document.prototype,'fullscreenEnabled',{configurable:true,get(){return false;}});}catch(_){}});
  const result={profile:profile.id,checks:{},pageErrors};
  try{
    await page.goto(`${origin}/app.html`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>document.body.classList.contains('gis-mode')&&document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'),{timeout:60000});
    await page.waitForTimeout(250);
    result.build=await page.evaluate(()=>({id:APP_BUILD_ID,num:APP_BUILD_NUM}));
    await page.evaluate(()=>{const root=document.getElementById('miniMap');const original=window.renderTileMap;window.__mobileRegression={beforeTileMap:root?.querySelector('.tile-map'),renderCalls:0};window.renderTileMap=function(...args){window.__mobileRegression.renderCalls++;return original.apply(this,args);};});
    result.layoutBefore={header:await box(page,'body.gis-mode > header'),topbar:await box(page,'#appTopbar'),footer:await box(page,'body.gis-mode > footer'),map:await box(page,'.gis-map-mount')};
    if(profile.landscape){result.topbarButtons=await page.evaluate(()=>Array.from(document.querySelectorAll('#appTopbar .app-topbar-actions > button,#appTopbar .app-topbar-tabs > button,#appTopbar #gisExportSummary')).map(e=>({id:e.id||'',tab:e.dataset.tab||'',text:e.innerText,ariaLabel:e.getAttribute('aria-label'),rect:(()=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};})(),children:Array.from(e.children).map(c=>({text:c.textContent,display:getComputedStyle(c).display,fontSize:getComputedStyle(c).fontSize,visibility:getComputedStyle(c).visibility,clip:getComputedStyle(c).clip}))})));const convert=result.topbarButtons.find(e=>e.id==='topbarConvertBtn');result.checks.convertIconVisible=!!convert&&convert.children.some(c=>c.text==='🧮'&&c.display!=='none'&&parseFloat(c.fontSize)>0);result.checks.convertAccessibleName=!!convert&&convert.ariaLabel==='Converti';}
    if(profile.landscape){result.compactHeader=await page.evaluate(()=>{const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right};};const brand=document.querySelector('.brand'),fullscreen=document.getElementById('gisMobileFullscreenBtn'),tools=document.getElementById('btnTopbarTools'),exportMenu=document.getElementById('gisExportMenu'),exportSummary=document.getElementById('gisExportSummary'),online=document.getElementById('netStatus'),settings=document.getElementById('btnHeaderSettings');return{brandParent:brand?.parentElement?.className||'',brand:rect(brand),lastNavControl:rect(fullscreen),toolsParent:tools?.parentElement?.className||'',tools:rect(tools),exportParent:exportMenu?.parentElement?.className||'',export:rect(exportSummary),online:rect(online),settings:rect(settings),toolsAria:tools?.getAttribute('aria-label')||'',exportAria:exportSummary?.getAttribute('aria-label')||''};});result.checks.brandMovesIntoCompactToolbar=result.compactHeader.brandParent==='header-inner'&&result.compactHeader.brand.y>=0&&result.compactHeader.brand.x>=result.compactHeader.lastNavControl.right+2;result.checks.brandCenteredOnSharedRow=Math.abs((result.compactHeader.brand.x+result.compactHeader.brand.width/2)-(profile.width/2))<=2&&Math.abs((result.compactHeader.brand.y+result.compactHeader.brand.height/2)-(result.compactHeader.lastNavControl.y+result.compactHeader.lastNavControl.height/2))<=2&&Math.abs((result.compactHeader.brand.y+result.compactHeader.brand.height/2)-(result.compactHeader.tools.y+result.compactHeader.tools.height/2))<=2&&result.compactHeader.brand.right<=result.compactHeader.tools.x-2;result.checks.toolsAndExportMoveToRightHeader=result.compactHeader.toolsParent==='header-ctrls'&&result.compactHeader.exportParent==='header-ctrls'&&result.compactHeader.tools.x<result.compactHeader.export.x&&result.compactHeader.export.x<result.compactHeader.online.x&&result.compactHeader.online.x<result.compactHeader.settings.x;result.checks.toolsExportHaveAccessibleNames=!!result.compactHeader.tools&&result.compactHeader.tools.width===32&&result.compactHeader.toolsAria==='Strumenti'&&result.compactHeader.exportAria==='Esporta';}
    await tap(page,'#gisMapMount [data-role="basemap-menu-toggle"]',profile.mobile);
    await page.waitForTimeout(180);
    result.layerOpen=await readMenu(page);
    result.checks.layerOpensWithoutMapRedraw=result.layerOpen.open&&result.layerOpen.nodePreserved&&result.layerOpen.renderCalls===0;
    result.checks.layerMenuInsideViewport=!!(result.layerOpen.menuRect&&result.layerOpen.menuRect.withinViewport);
    result.screenshots={};
    const landscapeShotPrefix='build272-landscape-'+profile.width;
    if(profile.landscape){result.tileVisualFixtureInitial=await seedMapVisualFixture(page);result.checks.visualMapFixtureLoaded=result.tileVisualFixtureInitial.count>0&&result.tileVisualFixtureInitial.loaded===result.tileVisualFixtureInitial.count;await page.screenshot({path:path.join(evidenceDir,landscapeShotPrefix+'-expanded.png')});result.screenshots={landscapeExpanded:landscapeShotPrefix+'-expanded.png'};}
    await page.evaluate(()=>document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch',clientX:8,clientY:8})));
    await page.waitForTimeout(100);
    result.layerOutsideClosed=await readMenu(page);
    result.checks.outsideClosesWithoutMapRedraw=!result.layerOutsideClosed.open&&result.layerOutsideClosed.nodePreserved&&result.layerOutsideClosed.renderCalls===0;
    await tap(page,'#gisMapMount [data-role="basemap-menu-toggle"]',profile.mobile);
    await page.waitForTimeout(120);
    const option=await page.evaluate(()=>{const e=document.querySelector('#gisMapMount [data-role="basemap-menu"] .tlayer-item[data-layer]:not(.is-active)');if(!e)return null;const r=e.getBoundingClientRect();return{layer:e.dataset.layer,x:r.x+r.width/2,y:r.y+r.height/2,width:r.width,height:r.height};});
    if(option&&option.width>0&&option.height>0){if(profile.mobile)await page.touchscreen.tap(option.x,option.y);else await page.mouse.click(option.x,option.y);await page.waitForTimeout(300);result.layerSelection=await page.evaluate(target=>({target,active:document.querySelector('#gisMapMount [data-role="basemap-menu"] .tlayer-item[data-layer].is-active')?.dataset.layer||'',open:(()=>{const m=document.querySelector('#gisMapMount [data-role="basemap-menu"]');return !!m&&!m.hidden;})(),renderCalls:window.__mobileRegression.renderCalls}),option.layer);}
    result.checks.layerSelectsAndRendersOnlyForMapChange=!!result.layerSelection&&result.layerSelection.active===result.layerSelection.target&&!result.layerSelection.open&&result.layerSelection.renderCalls===1;
    if(profile.landscape){
      result.tileVisualFixtureAfterSelection=await seedMapVisualFixture(page);
      result.checks.visualMapFixtureAfterLayerChangeLoaded=result.tileVisualFixtureAfterSelection.count>0&&result.tileVisualFixtureAfterSelection.loaded===result.tileVisualFixtureAfterSelection.count;
      result.mapGeometryBefore=await mapGeometry(page);
      result.layoutCompact={header:await box(page,'body.gis-mode > header'),footer:await box(page,'body.gis-mode > footer'),map:await box(page,'.gis-map-mount'),fullButton:await box(page,'#gisMobileFullscreenBtn'),toolbarHandle:await box(page,'#gisMobileToolbarToggle'),fullIconFont:await page.locator('#gisMobileFullscreenBtn .gis-mobile-fullscreen-icon').evaluate(e=>getComputedStyle(e).fontSize)};
      result.checks.landscapeFooterRemoved=result.layoutCompact.footer?.display==='none';
      result.checks.landscapeMapFillsAvailableHeight=!!result.layoutCompact.map&&Math.abs(result.layoutCompact.map.y+result.layoutCompact.map.height-profile.height)<=2;
      result.checks.compactFullscreenControlVisible=!!result.layoutCompact.fullButton&&result.layoutCompact.fullButton.display!=='none'&&result.layoutCompact.fullButton.width>=36;
      await tap(page,'#gisMobileToolbarToggle',true);await page.waitForTimeout(260);
      result.collapsed={bodyClass:await page.evaluate(()=>document.body.classList.contains('gis-mobile-toolbar-collapsed')),header:await box(page,'body.gis-mode > header'),map:await box(page,'.gis-map-mount')};
      result.mapGeometryCollapsed=await mapGeometry(page);
      result.checks.toolbarCollapsesAndReclaimsMap=result.collapsed.bodyClass&&Math.round(result.collapsed.header.height)===22&&Math.abs(result.collapsed.map.y+result.collapsed.map.height-profile.height)<=2&&Math.abs(result.mapGeometryCollapsed.surface.height-result.mapGeometryCollapsed.mount.height)<=2;
      if(result.collapsed.bodyClass){await page.screenshot({path:path.join(evidenceDir,landscapeShotPrefix+'-toolbar-collapsed.png')});result.screenshots.toolbarCollapsed=landscapeShotPrefix+'-toolbar-collapsed.png';}
      await tap(page,'#gisMobileToolbarToggle',true);await page.waitForTimeout(260);
      result.expanded=await page.evaluate(()=>!document.body.classList.contains('gis-mobile-toolbar-collapsed'));
      result.checks.toolbarRestores=result.expanded;
      await tap(page,'#gisMobileFullscreenBtn',true);await page.waitForTimeout(180);
      result.fullscreen=await page.evaluate(()=>({active:document.body.classList.contains('gis-fullscreen-active'),fallback:document.body.classList.contains('gis-fullscreen-fallback'),header:getComputedStyle(document.querySelector('body.gis-mode > header')).display,map:(()=>{const r=document.querySelector('.gis-map-mount').getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,position:getComputedStyle(document.querySelector('.gis-map-mount')).position};})(),exit:getComputedStyle(document.getElementById('gisMobileFullscreenExit')).display}));
      result.mapGeometryFullscreen=await mapGeometry(page);
      result.checks.fullscreenFallbackExpandsMap=result.fullscreen.active&&result.fullscreen.fallback&&result.fullscreen.header==='none'&&result.fullscreen.map.position==='fixed'&&result.fullscreen.exit!=='none';
      result.checks.fullscreenMapSurfaceFillsViewport=Math.abs(result.mapGeometryFullscreen.surface.width-profile.width)<=2&&Math.abs(result.mapGeometryFullscreen.surface.height-profile.height)<=2;
      await page.screenshot({path:path.join(evidenceDir,landscapeShotPrefix+'-map-expanded.png')});result.screenshots.fullscreenMap=landscapeShotPrefix+'-map-expanded.png';
      await tap(page,'#gisMobileFullscreenExit',true);await page.waitForTimeout(150);
      result.checks.fullscreenFallbackExits=!(await page.evaluate(()=>document.body.classList.contains('gis-fullscreen-active')));
      await page.setViewportSize({width:390,height:844});await page.waitForTimeout(200);
      result.portraitRestore=await page.evaluate(()=>({brandParent:document.querySelector('.brand')?.parentElement?.className||'',toolsParent:document.getElementById('btnTopbarTools')?.parentElement?.className||'',exportParent:document.getElementById('gisExportMenu')?.parentElement?.className||''}));
      result.checks.orientationRestoreReturnsControls=result.portraitRestore.toolsParent==='app-topbar-actions'&&result.portraitRestore.exportParent==='app-topbar-actions';
      await page.setViewportSize({width:profile.width,height:profile.height});await page.waitForTimeout(180);
    }
    if(profile.mobile&&!profile.landscape){
      result.checks.landscapeOnlyToolbarHandleHidden=(await box(page,'#gisMobileToolbarToggle'))===null || (await box(page,'#gisMobileToolbarToggle')).display==='none';
      result.portraitFullscreenButton=await page.evaluate(()=>{const strip=document.querySelector('#appTopbar .app-topbar-actions');if(strip)strip.scrollLeft=strip.scrollWidth;const e=document.getElementById('gisMobileFullscreenBtn');if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,withinViewport:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight};});
      result.checks.portraitFullscreenButtonTouchSize=!!result.portraitFullscreenButton&&result.portraitFullscreenButton.width>=38&&result.portraitFullscreenButton.height>=38;
      await page.waitForTimeout(100);
      result.checks.portraitFullscreenButtonReachable=!!result.portraitFullscreenButton?.withinViewport;
      if(result.checks.portraitFullscreenButtonReachable){await tap(page,'#gisMobileFullscreenBtn',true);await page.waitForTimeout(160);}
      result.portraitFullscreen=await page.evaluate(()=>({active:document.body.classList.contains('gis-fullscreen-active'),fallback:document.body.classList.contains('gis-fullscreen-fallback')}));
      result.checks.portraitFullscreenFallbackWorks=result.portraitFullscreen.active&&result.portraitFullscreen.fallback;
      await tap(page,'#gisMobileFullscreenExit',true);await page.waitForTimeout(140);
      result.checks.portraitFullscreenExitWorks=!(await page.evaluate(()=>document.body.classList.contains('gis-fullscreen-active')));
    }
    if(profile.nativeFullscreen){
      result.nativeFullscreenButton=await page.evaluate(()=>{const strip=document.querySelector('#appTopbar .app-topbar-actions');if(strip)strip.scrollLeft=strip.scrollWidth;const e=document.getElementById('gisMobileFullscreenBtn');const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,withinViewport:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight};});
      result.nativeFullscreenApi=await page.evaluate(()=>({enabled:document.fullscreenEnabled,method:typeof document.documentElement.requestFullscreen}));
      result.checks.nativeFullscreenApiAvailable=result.nativeFullscreenApi.enabled&&result.nativeFullscreenApi.method==='function';
      result.checks.nativeFullscreenButtonReachable=!!result.nativeFullscreenButton.withinViewport;
      await page.evaluate(()=>document.addEventListener('fullscreenerror',()=>{window.__fullscreenError='fullscreenerror';},{once:true}));
      if(result.checks.nativeFullscreenButtonReachable)await tap(page,'#gisMobileFullscreenBtn',false);await page.waitForTimeout(350);
      result.nativeFullscreenEntered=await page.evaluate(()=>({entered:!!document.fullscreenElement&&document.body.classList.contains('gis-fullscreen-active'),fallback:document.body.classList.contains('gis-fullscreen-fallback'),error:window.__fullscreenError||null}));
      result.checks.nativeFullscreenWorks=result.nativeFullscreenEntered.entered&&!result.nativeFullscreenEntered.fallback;
      if(result.nativeFullscreenEntered.entered){await tap(page,'#gisMobileFullscreenExit',false);await page.waitForTimeout(180);}
      result.checks.nativeFullscreenExits=!(await page.evaluate(()=>!!document.fullscreenElement));
    }
    result.checks.build272=result.build.num===272&&result.build.id==='GIS-MOBILE-LANDSCAPE-UX-A';
    result.checks.noPageErrors=pageErrors.length===0;
    result.pass=Object.values(result.checks).every(Boolean);
    return result;
  }catch(e){result.error=e.stack||String(e);result.pass=false;return result;}finally{await context.close();}
}
(async()=>{
  const {server,port}=await startServer();
  let browser;
  const results=[];
  let version='unknown';
  const output=()=>({schema:'tmart-mobile-layer-and-landscape-272',engine:`Microsoft Edge / Chromium ${version}; iPhone touch viewports plus narrow Chromium native-fullscreen profile`,limitation:'Inline SVG tile fixture verifies local layout/rendering, not real cartography or provider connectivity. Native fullscreen is proved in Chromium, not iOS; real Safari/Chrome iOS, browser chrome, safe-area and dynamic viewport still require on-device retest.',results,pass:results.length===profiles.length&&results.every(r=>r.pass)});
  const writeOutput=()=>{const value=output();fs.writeFileSync(path.join(evidenceDir,'build272-results.json'),JSON.stringify(value,null,2));return value;};
  try{
    browser=await chromium.launch({headless:true,channel:'msedge'});
    version=browser.version();
    const origin=`http://127.0.0.1:${port}`;
    for(const profile of profiles){
      results.push(await run(browser,origin,profile));
      process.stdout.write(`${profile.id} ${results.at(-1).pass?'PASS':'FAIL'}\n`);
      writeOutput();
    }
  }finally{
    if(browser){process.stdout.write('CLOSE_BROWSER\n');await browser.close();process.stdout.write('BROWSER_CLOSED\n');}
    server.closeAllConnections?.();
    await new Promise(resolve=>server.close(resolve));
  }
  const out=writeOutput();
  console.log(JSON.stringify({pass:out.pass,engine:out.engine,results:results.map(r=>({profile:r.profile,pass:r.pass,checks:r.checks,compactHeader:r.compactHeader,portraitRestore:r.portraitRestore,layoutBefore:r.layoutBefore,layoutCompact:r.layoutCompact,collapsed:r.collapsed,fullscreen:r.fullscreen,nativeFullscreen:r.nativeFullscreenEntered,mapGeometryBefore:r.mapGeometryBefore,mapGeometryCollapsed:r.mapGeometryCollapsed,mapGeometryFullscreen:r.mapGeometryFullscreen,tileVisualFixtureInitial:r.tileVisualFixtureInitial,tileVisualFixtureAfterSelection:r.tileVisualFixtureAfterSelection,error:r.error}))},null,2));
  if(!out.pass)process.exitCode=1;
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});