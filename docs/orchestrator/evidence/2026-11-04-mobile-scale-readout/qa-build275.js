'use strict';
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { chromium, webkit, devices } = require('C:/goi-pw-probe/node_modules/playwright');

const repoRoot = path.resolve(__dirname, '../../../../');
const candidatePath = path.join(repoRoot, 'coordinate_converter Claude.html');
const webkitExe = 'C:/Users/Utente/Downloads/Documents/ChatGPT/TMART GIS Tool/work/ios273-investigation/webkit-engine/Playwright.exe';
const resultPath = path.join(__dirname, 'qa-build275-results.json');
const candidates = [
  { id: 'build275-candidate', bytes: fs.readFileSync(candidatePath) },
  { id: 'build274-head', bytes: execFileSync('git', ['show', 'HEAD:coordinate_converter Claude.html'], { cwd: repoRoot, maxBuffer: 64 * 1024 * 1024 }) }
];
const sha = b => crypto.createHash('sha256').update(b).digest('hex').toUpperCase();
const profiles = [
  { id: '320x568-portrait', width: 320, height: 568, mobile: true },
  { id: '428x737-portrait', width: 428, height: 737, mobile: true },
  { id: '667x375-landscape', width: 667, height: 375, mobile: true },
  { id: '926x359-landscape', width: 926, height: 359, mobile: true },
  { id: '1280x800-desktop', width: 1280, height: 800, mobile: false }
];
const result = {
  schema: 'tmart-gis-build275-mobile-scale-readout-qa-v1',
  generatedAt: new Date().toISOString(),
  source: {
    candidate: { file: 'coordinate_converter Claude.html', build: 275, sha256: sha(candidates[0].bytes) },
    baseline: { ref: 'HEAD:coordinate_converter Claude.html', build: 274, sha256: sha(candidates[1].bytes) },
    webkitExecutable: webkitExe
  },
  networkPolicy: 'All requests to non-local origins are aborted; provider tile and elevation calls are not made.',
  limitations: ['Desktop Playwright WebKit executable is not physical iOS Safari or Edge iOS.', 'Tile providers are blocked; basemap imagery is not visually validated.', 'Measure/cache retention uses synthetic row sentinels because external providers are blocked; cache population itself is not tested.'],
  engines: []
};
function save(){ fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n'); }
function addCheck(rec, id, ok, detail){ rec.checks.push({ id, status: ok ? 'PASS' : 'FAIL', detail }); }
function rectHit(a,b){ return !!a && !!b && Math.min(a.right,b.right)-Math.max(a.left,b.left)>1 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1; }
function startServer(){
  return new Promise((resolve,reject)=>{
    const server=http.createServer((req,res)=>{
      const u=new URL(req.url,'http://127.0.0.1');
      if(u.pathname==='/build275.html' || u.pathname==='/build274.html'){
        const entry=u.pathname==='/build275.html'?candidates[0]:candidates[1];
        res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}); res.end(entry.bytes); return;
      }
      let target=path.resolve(repoRoot,'.'+decodeURIComponent(u.pathname));
      if(target!==repoRoot && !target.startsWith(repoRoot+path.sep)){res.writeHead(403).end();return;}
      fs.readFile(target,(e,bytes)=>{
        if(e){res.writeHead(404).end();return;}
        const ext=path.extname(target).toLowerCase();
        const types={'.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.json':'application/json','.css':'text/css','.js':'text/javascript','.html':'text/html'};
        res.writeHead(200,{'content-type':types[ext]||'application/octet-stream','cache-control':'no-store'});res.end(bytes);
      });
    });
    server.once('error',reject);server.listen(0,'127.0.0.1',()=>resolve({server,port:server.address().port}));
  });
}
async function createPage(browser,origin,profile,routeId){
  const dev=profile.mobile?devices['iPhone 13 Pro']:{};
  const context=await browser.newContext({
    ...dev, viewport:{width:profile.width,height:profile.height}, screen:{width:profile.width,height:profile.height},
    deviceScaleFactor:1, isMobile:profile.mobile, hasTouch:profile.mobile
  });
  const blocked=[]; const pageErrors=[];
  await context.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(u.origin===origin) return route.continue();
    blocked.push({origin:u.origin,resourceType:route.request().resourceType()});
    return route.abort('blockedbyclient');
  });
  pageErrors.push(...[]);
  const page=await context.newPage();
  page.on('pageerror',e=>pageErrors.push(String(e&&e.stack||e)));
  await page.goto(`${origin}/${routeId==='build275-candidate'?'build275':'build274'}.html`,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.body.classList.contains('gis-mode')&&document.querySelector('#gisMapMount .tile-map'),{timeout:60000});
  await page.waitForTimeout(250);
  return {context,page,blocked,pageErrors};
}
async function snapshot(page){
  return page.evaluate(()=>{
    const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
    const visible=e=>!!e&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden'&&e.getClientRects().length>0;
    const root=document.getElementById('miniMap'),map=root?.querySelector('.tile-map'),scale=map?.querySelector('.tile-scale'),readout=map?.querySelector('.tile-readout'),content=map?.querySelector('.tile-readout-content');
    const tscale=root?.querySelector('[data-role="mobile-scale-toggle"]'),tread=root?.querySelector('[data-role="mobile-readout-toggle"]'),ctrl=map?.querySelector('.tile-ctrls'),menu=map?.querySelector('[data-role="basemap-menu"]'),footer=document.querySelector('body>footer'),attrib=map?.querySelector('.tile-attrib'),cursor=map?.querySelector('.trp-cursor'),coord=cursor?.querySelector('[data-role="cursor-coord"]'),meas=map?.querySelector('.trp-measure'),cache=map?.querySelector('[data-role="tile-cache-counter"]');
    const s=e=>e?{visible:visible(e),rect:rect(e),display:getComputedStyle(e).display,fontSize:getComputedStyle(e).fontSize,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,text:(e.textContent||'').trim().replace(/\\s+/g,' ').slice(0,180)}:null;
    const storage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);storage[k]=localStorage.getItem(k);}
    const st=typeof state!=='undefined'?state:null;
    const css=(el,pseudo)=>el?getComputedStyle(el,pseudo||null):null;
    const buttons=ctrl?[...ctrl.querySelectorAll('button')].filter(visible).map(e=>({role:e.getAttribute('data-role')||'',text:(e.textContent||'').trim().slice(0,40),rect:rect(e)})):[];
    const overlayRects=[['scale',scale],['scaleToggle',tscale],['readout',readout],['readoutToggle',tread],['attrib',attrib]].map(([id,e])=>({id,rect:rect(e),visible:visible(e)}));
    const intersects=(a,b)=>!!a&&!!b&&Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;const overlaps=[];for(const a of overlayRects.filter(x=>x.visible&&x.rect)){for(const b of buttons){if(intersects(a.rect,b.rect))overlaps.push({overlay:a.id,toolbarRole:b.role,toolbarText:b.text,overlayRect:a.rect,toolbarRect:b.rect});}}
    return {
      buildNum:typeof APP_BUILD_NUM!=='undefined'?APP_BUILD_NUM:null,buildId:typeof APP_BUILD_ID!=='undefined'?APP_BUILD_ID:null,
      viewport:{width:innerWidth,height:innerHeight,visualWidth:visualViewport?.width??null,visualHeight:visualViewport?.height??null},
      rootClass:root?.className||'',mapRect:rect(map),mapZoom:st?.mapZoom??null,mapLayer:st?.mapLayer??null,viewCenter:st?.viewCenter??null,layerMenuOpen:st?.mapBasemapMenuOpen??null,
      scale:s(scale),scaleMetric:s(scale?.querySelector('.tile-scale-label-metric')),scaleMetricBar:s(scale?.querySelector('.tile-scale-bar:not(.tile-scale-bar-naut)')),scaleNm:s(scale?.querySelector('.tile-scale-label-naut')),scaleNmBar:s(scale?.querySelector('.tile-scale-bar-naut')),
      scaleToggle:s(tscale),scaleAria:tscale?{expanded:tscale.getAttribute('aria-expanded'),label:tscale.getAttribute('aria-label'),controls:tscale.getAttribute('aria-controls'),controlsExists:!!document.getElementById(tscale.getAttribute('aria-controls'))}:null,
      readout:s(readout),readoutContent:s(content),cursor:s(cursor),cursorCoord:s(coord),cursorKey:cursor?{fontSize:css(cursor.querySelector('.trp-key'))?.fontSize,pseudoContent:css(cursor.querySelector('.trp-key'),'::after')?.content}:null,
      readoutToggle:s(tread),readoutAria:tread?{expanded:tread.getAttribute('aria-expanded'),label:tread.getAttribute('aria-label'),controls:tread.getAttribute('aria-controls'),controlsExists:!!document.getElementById(tread.getAttribute('aria-controls'))}:null,
      measure:s(meas),measureOut:s(meas?.querySelector('[data-role="measure-out"]')),cache:s(cache),attrib:s(attrib),
      toolbar:rect(ctrl),toolbarButtons:buttons,basemapMenu:s(menu),footer:{visible:visible(footer),display:footer?css(footer).display:null,rect:rect(footer)},
      horizontalOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,overlaps,
      storage
    };
  });
}
async function tap(page,locator,mobile){
  const b=await locator.boundingBox();if(!b)throw new Error('target has no bounding box');
  const x=b.x+b.width/2,y=b.y+b.height/2;
  if(mobile)await page.touchscreen.tap(x,y);else await page.mouse.click(x,y);
  await page.waitForTimeout(80);
}
async function mobileChecks(browser,origin,profile,engineRec){
  const rec={profile:profile.id,checks:[],externalRequestsBlocked:0,pageErrors:[],snapshots:{},scaleCases:[]};
  let p;
  try{
    p=await createPage(browser,origin,profile,'build275-candidate');
    await p.page.waitForFunction(()=>document.querySelector('#miniMap [data-role="mobile-scale-toggle"]')&&document.querySelector('#miniMap [data-role="mobile-readout-toggle"]'),{timeout:30000});
    let initial=await snapshot(p.page);rec.snapshots.initial=initial;rec.pageErrors=p.pageErrors;
    addCheck(rec,'build-is-275',initial.buildNum===275,{buildNum:initial.buildNum,buildId:initial.buildId});
    const mobileToggleVisible=initial.scaleToggle?.visible&&initial.readoutToggle?.visible&&initial.scaleToggle.rect?.width>0&&initial.readoutToggle.rect?.width>0;
    addCheck(rec,'mobile-hud-toggles-visible',mobileToggleVisible,{scale:initial.scaleToggle,readout:initial.readoutToggle});
    addCheck(rec,'toggle-accessible-state',initial.scaleAria?.expanded==='true'&&initial.readoutAria?.expanded==='true'&&!!initial.scaleAria?.label&&!!initial.readoutAria?.label&&initial.scaleAria?.controlsExists&&initial.readoutAria?.controlsExists,{scale:initial.scaleAria,readout:initial.readoutAria});
    addCheck(rec,'cursor-row-readable',initial.cursor?.visible&&!!initial.cursorCoord?.text&&initial.cursorCoord.text!=='—'&&initial.cursorCoord.clientWidth>=initial.cursorCoord.scrollWidth-2,{cursor:initial.cursor,cursorCoord:initial.cursorCoord,cursorKey:initial.cursorKey});
    addCheck(rec,'footer-does-not-cover-mobile',initial.footer.display==='none'&&!initial.footer.visible,{footer:initial.footer,map:initial.mapRect});
    addCheck(rec,'scale-and-attribution-visible',initial.scale?.visible&&initial.attrib?.visible&&initial.attrib.rect?.bottom<=initial.viewport.height+1,{scale:initial.scale,attrib:initial.attrib});
    addCheck(rec,'default-scale-not-truncated',!initial.scaleMetricBar?.rect||initial.scaleMetricBar.rect.right<=initial.scale.rect.right+1,{scale:initial.scale,metricBar:initial.scaleMetricBar,nmBar:initial.scaleNmBar});
    if(profile.width<=400){addCheck(rec,'compact-cursor-key',initial.cursorKey?.fontSize==='0px'&&initial.cursorKey?.pseudoContent==='"⌖"',initial.cursorKey);}

    const preToggle={mapZoom:initial.mapZoom,mapLayer:initial.mapLayer,viewCenter:initial.viewCenter,layerMenuOpen:initial.layerMenuOpen,storage:initial.storage};
    await p.page.evaluate(()=>{const map=document.querySelector('#miniMap .tile-map'),out=map?.querySelector('[data-role=measure-out]'),meas=map?.querySelector('.trp-measure'),cache=map?.querySelector('[data-role=tile-cache-counter]');if(out)out.textContent='QA misura 1.23 km';if(meas)map.classList.add('measure-on');if(cache){cache.hidden=false;cache.textContent='QA cache +3';}});
    const retentionSeed=await snapshot(p.page);
    const measureText=retentionSeed.measureOut?.text,cacheText=retentionSeed.cache?.text,cacheVisible=retentionSeed.cache?.visible;
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-scale-toggle"]'),true);
    let a=await snapshot(p.page);rec.snapshots.afterScaleCollapse=a;
    addCheck(rec,'scale-collapse-independent',a.scaleAria?.expanded==='false'&&!a.scale?.visible&&a.readoutAria?.expanded==='true'&&a.readoutContent?.visible,{scale:a.scaleAria,scaleVisible:a.scale?.visible,readout:a.readoutAria,readoutContent:a.readoutContent});
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-readout-toggle"]'),true);
    let b=await snapshot(p.page);rec.snapshots.afterReadoutCollapse=b;
    addCheck(rec,'readout-collapse-independent',b.scaleAria?.expanded==='false'&&b.readoutAria?.expanded==='false'&&!b.readoutContent?.visible,{scale:b.scaleAria,readout:b.readoutAria,readoutContent:b.readoutContent});
    addCheck(rec,'measure-cache-preserved-by-collapse',!!b.measureOut&&b.measureOut.text===measureText&&!!b.cache&&b.cache.text===cacheText&&b.cache.visible===cacheVisible,{before:{measureText,cacheText,cacheVisible},after:{measureText:b.measureOut?.text,cacheText:b.cache?.text,cacheVisible:b.cache?.visible}});
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-readout-toggle"]'),true);
    let c=await snapshot(p.page);rec.snapshots.readoutRestored=c;
    addCheck(rec,'readout-restores-with-scale-still-collapsed',c.readoutAria?.expanded==='true'&&c.readoutContent?.visible&&c.scaleAria?.expanded==='false'&&!c.scale?.visible,{scale:c.scaleAria,readout:c.readoutAria,content:c.readoutContent});
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-scale-toggle"]'),true);
    let d=await snapshot(p.page);rec.snapshots.expandedAgain=d;
    addCheck(rec,'both-huds-restored',d.scaleAria?.expanded==='true'&&d.readoutAria?.expanded==='true'&&d.scale?.visible&&d.readoutContent?.visible,{scale:d.scaleAria,readout:d.readoutAria});
    const toggleStateUnchanged=d.mapZoom===preToggle.mapZoom&&d.mapLayer===preToggle.mapLayer&&JSON.stringify(d.viewCenter)===JSON.stringify(preToggle.viewCenter)&&d.layerMenuOpen===preToggle.layerMenuOpen&&JSON.stringify(d.storage)===JSON.stringify(preToggle.storage);
    addCheck(rec,'toggle-does-not-pan-zoom-layer-or-write-storage',toggleStateUnchanged,{before:preToggle,after:{mapZoom:d.mapZoom,mapLayer:d.mapLayer,viewCenter:d.viewCenter,layerMenuOpen:d.layerMenuOpen,storage:d.storage}});
    const formatCoverage=[];
    for(let i=0;i<5;i++){await tap(p.page,p.page.locator('#miniMap .trp-cursor [data-role=coord-cycle]'),true);const f=await p.page.evaluate(()=>{const e=document.querySelector('#miniMap .trp-cursor [data-role=cursor-coord]'),r=e?.getBoundingClientRect();return {format:state.primary,text:e?.textContent?.trim()||'',clientWidth:e?.clientWidth||0,scrollWidth:e?.scrollWidth||0,rect:r?{left:r.left,right:r.right,top:r.top,bottom:r.bottom}:null};});formatCoverage.push(f);}
    rec.snapshots.cursorFormats=formatCoverage;
    const formatsSeen=[...new Set(formatCoverage.map(f=>f.format))];
    addCheck(rec,'long-coordinate-formats-fit',formatsSeen.length>=4&&formatCoverage.every(f=>!!f.text&&f.clientWidth>=f.scrollWidth-2&&f.rect&&f.rect.left>=-1&&f.rect.right<=profile.width+1),formatCoverage);

    // Collapse both; test the two classes and ARIA state survive an app-owned map render.
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-scale-toggle"]'),true);
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-readout-toggle"]'),true);
    await p.page.evaluate(()=>{const vc=state.viewCenter||{lat:44.1,lon:9.8};renderTileMap(state.lastPoint?.lat??vc.lat,state.lastPoint?.lon??vc.lon,state.mapZoom||11);});
    await p.page.waitForTimeout(120);
    let e=await snapshot(p.page);rec.snapshots.afterRender=e;
    addCheck(rec,'collapsed-state-survives-redraw',e.scaleAria?.expanded==='false'&&e.readoutAria?.expanded==='false'&&!e.scale?.visible&&!e.readoutContent?.visible,{rootClass:e.rootClass,scale:e.scaleAria,readout:e.readoutAria});
    const rotated=profile.width<profile.height?{width:926,height:359}:{width:390,height:844};
    await p.page.setViewportSize(rotated);await p.page.waitForTimeout(120);
    let f=await snapshot(p.page);rec.snapshots.afterRotate=f;
    addCheck(rec,'collapsed-state-survives-rotation',f.scaleAria?.expanded==='false'&&f.readoutAria?.expanded==='false'&&f.rootClass.includes('gis-mobile-scale-collapsed')&&f.rootClass.includes('gis-mobile-readout-collapsed'),{viewport:f.viewport,rootClass:f.rootClass,scale:f.scaleAria,readout:f.readoutAria});
    await p.page.setViewportSize({width:profile.width,height:profile.height});await p.page.waitForTimeout(120);
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-readout-toggle"]'),true);
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-scale-toggle"]'),true);
    let g=await snapshot(p.page);rec.snapshots.restoredAfterRotate=g;

    // Layer must still open from the visible control and its menu must stay inside the viewport.
    const layer=p.page.locator('#gisMapMount [data-role="basemap-menu-toggle"]');
    await tap(p.page,layer,true);
    await p.page.waitForFunction(()=>{const m=document.querySelector('#gisMapMount [data-role="basemap-menu"]');return !!m&&!m.hidden&&getComputedStyle(m).display!=='none';},{timeout:5000}).catch(()=>{});
    let h=await snapshot(p.page);rec.snapshots.layerOpen=h;
    addCheck(rec,'layer-opens-with-huds',h.layerMenuOpen===true&&h.basemapMenu?.visible,{menu:h.basemapMenu,layerMenuOpen:h.layerMenuOpen});
    const menuRect=h.basemapMenu?.rect, vp=h.viewport;
    const menuWithin=!!menuRect&&menuRect.left>=-1&&menuRect.top>=-1&&menuRect.right<=vp.width+1&&menuRect.bottom<=vp.height+1;
    addCheck(rec,'layer-menu-within-viewport',menuWithin,{menu:menuRect,viewport:vp});
    const menuOverlap=[];
    for(const ov of [h.scale,h.readout,h.attrib])if(ov?.visible&&rectHit(menuRect,ov.rect))menuOverlap.push({overlay:ov,menu:menuRect});
    addCheck(rec,'layer-menu-does-not-cover-hud-or-credits',menuOverlap.length===0,{overlaps:menuOverlap});
    const overlapCount=h.overlaps.length;
    addCheck(rec,'toolbar-controls-do-not-cover-hud-or-credits',overlapCount===0,{overlaps:h.overlaps,toolbar:h.toolbar,viewport:h.viewport});
    addCheck(rec,'credits-visible-and-in-viewport',h.attrib?.visible&&h.attrib.rect.left>=-1&&h.attrib.rect.right<=h.viewport.width+1&&h.attrib.rect.bottom<=h.viewport.height+1,{attrib:h.attrib});
    await tap(p.page,layer,true);await p.page.waitForTimeout(100);
    const afterLayer=await snapshot(p.page);addCheck(rec,'layer-closes',afterLayer.layerMenuOpen===false,{layerMenuOpen:afterLayer.layerMenuOpen});

    // Zoom redraw path: collapsed HUD state must survive, then restore original level.
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-scale-toggle"]'),true);
    await tap(p.page,p.page.locator('#miniMap [data-role="mobile-readout-toggle"]'),true);
    const zoom0=await p.page.evaluate(()=>state.mapZoom);
    const zoomIn=p.page.locator('#miniMap .tz-btn[data-zdelta="1"]');
    if(await zoomIn.count())await tap(p.page,zoomIn,true);
    await p.page.waitForTimeout(150);
    let z=await snapshot(p.page);rec.snapshots.afterZoomRender=z;
    addCheck(rec,'zoom-redraw-preserves-collapsed-huds',z.scaleAria?.expanded==='false'&&z.readoutAria?.expanded==='false'&&z.mapZoom>=zoom0,{beforeZoom:zoom0,afterZoom:z.mapZoom,scale:z.scaleAria,readout:z.readoutAria});
    const zoomOut=p.page.locator('#miniMap .tz-btn[data-zdelta="-1"]');if(await zoomOut.count())await tap(p.page,zoomOut,true);

    // Scale physical consistency at two extreme CSS widths, several latitude/zoom pairs.
    const combos=profile.width===320?[[0,4],[45,9],[70,12]]:profile.width===926?[[0,4],[45,9],[70,12],[80,16]]:[];
    for(const [lat,zlev] of combos){
      const sample=await p.page.evaluate(({lat,zlev})=>{
        state.viewCenter={lat,lon:12.4};renderTileMap(lat,12.4,zlev);
        const map=document.querySelector('#miniMap .tile-map'),sc=map?.querySelector('.tile-scale');
        const r=e=>{if(!e)return null;const b=e.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height};};
        return {zoom:state.mapZoom,lat,scaleRect:r(sc),metricLabel:sc?.querySelector('.tile-scale-label-metric')?.textContent?.trim()||'',metricBar:r(sc?.querySelector('.tile-scale-bar:not(.tile-scale-bar-naut)')),nmLabel:sc?.querySelector('.tile-scale-label-naut')?.textContent?.trim()||'',nmBar:r(sc?.querySelector('.tile-scale-bar-naut')),nmVisible:!!sc?.querySelector('.tile-scale-table-naut')&&getComputedStyle(sc.querySelector('.tile-scale-table-naut')).display!=='none',mapRect:r(map)};
      },{lat,zlev});
      const metricMatch=sample.metricLabel.match(/([0-9]+(?:[.,][0-9]+)?)\s*(km|m)\b/i);
      const metricValue=metricMatch?(Number(metricMatch[1].replace(',','.'))*(metricMatch[2].toLowerCase()==='km'?1000:1)):NaN;
      const mpp=156543.03392*Math.cos(lat*Math.PI/180)/Math.pow(2,zlev);
      const metricExpected=metricValue/mpp;
      const metricError=Math.abs((sample.metricBar?.width??0)-metricExpected);
      const metricOk=Number.isFinite(metricExpected)&&metricError<=1.25&&!!sample.metricLabel&&sample.metricBar?.width>0&&sample.metricBar.right<=sample.scaleRect.right+1;
      const scaleRec={lat,zoom:zlev,mpp,metricLabel:sample.metricLabel,metricBarCssPx:sample.metricBar?.width??null,metricExpectedPx:metricExpected,metricErrorPx:metricError,nmLabel:sample.nmLabel,nmBarCssPx:sample.nmBar?.width??null,nmVisible:sample.nmVisible,scaleRect:sample.scaleRect,mapRect:sample.mapRect};
      addCheck(rec,`scale-metric-formula-lat${lat}-z${zlev}`,metricOk,scaleRec);
      if(sample.nmVisible){
        const nmMatch=sample.nmLabel.match(/([0-9]+(?:[.,][0-9]+)?)\s*NM\b/i);
        const nmValue=nmMatch?Number(nmMatch[1].replace(',','.')):NaN;
        const nmExpected=nmValue*1852/mpp;const nmError=Math.abs((sample.nmBar?.width??0)-nmExpected);
        const nmOk=Number.isFinite(nmExpected)&&nmError<=1.25&&sample.nmBar?.width>0&&sample.nmBar.right<=sample.scaleRect.right+1&&sample.nmBar.right<=sample.mapRect.right+1;
        scaleRec.nmExpectedPx=nmExpected;scaleRec.nmErrorPx=nmError;
        addCheck(rec,`scale-nautical-formula-lat${lat}-z${zlev}`,nmOk,scaleRec);
      }
      const noClip=sample.scaleRect&&sample.scaleRect.left>=sample.mapRect.x-1&&sample.scaleRect.right<=sample.mapRect.right+1&&sample.scaleRect.bottom<=sample.mapRect.bottom+1&&sample.metricBar?.right<=sample.scaleRect.right+1&&(!sample.nmVisible||sample.nmBar?.right<=sample.scaleRect.right+1);
      addCheck(rec,`scale-not-clipped-lat${lat}-z${zlev}`,!!noClip,{scale:sample.scaleRect,metricBar:sample.metricBar,nmBar:sample.nmBar,nmVisible:sample.nmVisible,map:sample.mapRect});
      rec.scaleCases.push(scaleRec);
    }
    rec.externalRequestsBlocked=p.blocked.length;
    rec.pageErrors=p.pageErrors;
    addCheck(rec,'no-page-errors',p.pageErrors.length===0,p.pageErrors);
  }catch(e){
    rec.error=String(e&&e.stack||e);addCheck(rec,'profile-run-completed',false,rec.error);
  }finally{if(p){rec.externalRequestsBlocked=p.blocked.length;rec.pageErrors=p.pageErrors;await p.context.close();}}
  rec.pass=rec.checks.every(c=>c.status==='PASS');engineRec.profiles.push(rec);save();return rec;
}
async function desktopCompare(browser,origin,engineRec){
  const rec={profile:'1280x800-desktop',checks:[],layouts:{}};
  for(const variant of ['build274-head','build275-candidate']){
    let p;
    try{
      p=await createPage(browser,origin,profiles[4],variant);
      rec.layouts[variant]=await p.page.evaluate(()=>{
        const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
        const visible=e=>!!e&&getComputedStyle(e).display!=='none'&&e.getClientRects().length>0;
        const sels=['.tile-bottom-left','.tile-scale','.tile-readout','.trp-point','.trp-cursor','.tile-ctrls','.tile-attrib','.gis-map-mount','#appTopbar'];
        const layout={buildNum:APP_BUILD_NUM,viewport:{width:innerWidth,height:innerHeight},items:{}};
        for(const s of sels){const e=document.querySelector('#gisMapMount '+s)||document.querySelector(s);layout.items[s]={rect:rect(e),visible:visible(e),fontSize:e?getComputedStyle(e).fontSize:null,display:e?getComputedStyle(e).display:null};}
        layout.toggles=[...document.querySelectorAll('#miniMap .gis-mobile-hud-toggle')].map(e=>({visible:visible(e),display:getComputedStyle(e).display}));
        layout.footer={visible:visible(document.querySelector('body>footer')),display:document.querySelector('body>footer')?getComputedStyle(document.querySelector('body>footer')).display:null};
        return layout;
      });
    }catch(e){rec.layouts[variant]={error:String(e&&e.stack||e)};}finally{if(p)await p.context.close();}
  }
  const a=rec.layouts['build274-head'],b=rec.layouts['build275-candidate'];
  addCheck(rec,'candidate-is-build275',b?.buildNum===275,{buildNum:b?.buildNum});
  addCheck(rec,'mobile-toggles-hidden-on-desktop',Array.isArray(b?.toggles)&&b.toggles.length===2&&b.toggles.every(t=>!t.visible),b?.toggles);
  const ids=['.tile-bottom-left','.tile-scale','.tile-readout','.trp-point','.trp-cursor','.tile-ctrls','.tile-attrib','.gis-map-mount','#appTopbar'];
  const deltas={};let same=true;
  for(const id of ids){const x=a?.items?.[id]?.rect,y=b?.items?.[id]?.rect;if(!x||!y){same=false;deltas[id]='missing';continue;}const d={x:y.x-x.x,y:y.y-x.y,width:y.width-x.width,height:y.height-x.height};deltas[id]=d;if(Object.values(d).some(v=>Math.abs(v)>1.1))same=false;}
  addCheck(rec,'desktop-layout-matches-build274-within-1px',same,deltas);
  addCheck(rec,'desktop-footer-unchanged',a?.footer?.display===b?.footer?.display&&a?.footer?.visible===b?.footer?.visible,{baseline:a?.footer,candidate:b?.footer});
  rec.pass=rec.checks.every(c=>c.status==='PASS');engineRec.desktop=rec;save();return rec;
}
async function runEngine(name,engine,launchOptions,origin){
  const rec={name,launchOptions,profiles:[]};result.engines.push(rec);save();let browser;
  try{browser=await engine.launch(launchOptions);}catch(e){rec.launchError=String(e&&e.stack||e);rec.pass=false;save();return;}
  try{
    for(const profile of profiles.filter(p=>p.mobile))await mobileChecks(browser,origin,profile,rec);
    await desktopCompare(browser,origin,rec);
  }finally{await browser.close();}
  rec.pass=rec.profiles.every(p=>p.pass)&&!!rec.desktop?.pass;save();
}
(async()=>{
  save();
  const {server,port}=await startServer();const origin=`http://127.0.0.1:${port}`;
  try{
    await runEngine('Edge (msedge)',chromium,{channel:'msedge',headless:true},origin);
    await runEngine('Playwright WebKit',webkit,{executablePath:webkitExe,headless:true},origin);
  }finally{await new Promise(resolve=>server.close(resolve));}
  result.pass=result.engines.length===2&&result.engines.every(e=>e.pass===true);
  result.completedAt=new Date().toISOString();save();
  const summary={pass:result.pass,source:result.source,engines:result.engines.map(e=>({name:e.name,pass:e.pass,launchError:e.launchError,profiles:e.profiles.map(p=>({profile:p.profile,pass:p.pass,failures:p.checks.filter(c=>c.status==='FAIL').map(c=>({id:c.id,detail:c.detail})),error:p.error})),desktop:e.desktop?{pass:e.desktop.pass,failures:e.desktop.checks.filter(c=>c.status==='FAIL').map(c=>({id:c.id,detail:c.detail}))}:null}))};
  console.log(JSON.stringify(summary,null,2));if(!result.pass)process.exitCode=1;
})().catch(e=>{result.fatalError=String(e&&e.stack||e);result.pass=false;result.completedAt=new Date().toISOString();save();console.error(e.stack||e);process.exitCode=1;});
