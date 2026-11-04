const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium, devices } = require('C:/goi-pw-probe/node_modules/playwright');

const repo = path.resolve(__dirname, '../../../..');
const html273 = fs.readFileSync(path.join(repo, 'coordinate_converter Claude.html'));
const html271 = execFileSync('git', ['show', '173611f:coordinate_converter Claude.html'], { cwd: repo, maxBuffer: 32 * 1024 * 1024 });
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
  if (pathname === '/271.html' || pathname === '/273.html') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); res.end(pathname === '/271.html' ? html271 : html273); return; }
  const target = path.resolve(repo, `.${pathname}`);
  if (target !== repo && !target.startsWith(repo + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(target, (err, bytes) => { if (err) { res.writeHead(404).end(); return; } res.writeHead(200, { 'content-type': path.extname(target) === '.svg' ? 'image/svg+xml' : 'application/octet-stream' }); res.end(bytes); });
});

async function geometry(page) {
  return page.evaluate(() => {
    const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height, right:r.right, bottom:r.bottom }; };
    const vv = visualViewport, root = document.documentElement, body = document.body;
    const relevant = [...document.querySelectorAll('body *')].map(el => {
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      if (!r.width || !r.height || s.display === 'none' || s.visibility === 'hidden' || (r.right <= root.clientWidth + 1 && r.left >= -1)) return null;
      let clipped = false;
      for (let p = el.parentElement; p && p !== body; p = p.parentElement) {
        const ps = getComputedStyle(p), pr = p.getBoundingClientRect();
        if (/(hidden|clip|auto|scroll)/.test(ps.overflowX) && pr.left >= -1 && pr.right <= root.clientWidth + 1) { clipped = true; break; }
      }
      if (clipped) return null;
      return { tag:el.tagName, id:el.id, cls:typeof el.className === 'string' ? el.className : '', rect:rect(el), position:s.position, overflowX:s.overflowX };
    }).filter(Boolean).sort((a,b) => b.rect.right - a.rect.right).slice(0, 12);
    return { innerWidth, innerHeight, scrollX, scrollY, root:{clientWidth:root.clientWidth,scrollWidth:root.scrollWidth,scrollHeight:root.scrollHeight,rect:rect(root),overflowX:getComputedStyle(root).overflowX}, body:{clientWidth:body.clientWidth,scrollWidth:body.scrollWidth,rect:rect(body),overflowX:getComputedStyle(body).overflowX}, visualViewport:vv && {width:vv.width,height:vv.height,offsetLeft:vv.offsetLeft,pageLeft:vv.pageLeft,scale:vv.scale}, header:rect(document.querySelector('body.gis-mode > header')), map:rect(document.getElementById('gisMapMount')), miniMap:rect(document.getElementById('miniMap')), tileMap:rect(document.querySelector('#miniMap .tile-map')), events:window.__geomEvents.slice(), offenders:relevant };
  });
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel:'msedge', headless:true });
  const results = [];
  try {
    for (const build of [271,273]) for (const landscape of [{width:844,height:390},{width:667,height:375}]) {
      const ctx = await browser.newContext({ ...devices['iPhone 13 Pro'], viewport:{width:390,height:844}, screen:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:1 });
      const page = await ctx.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => {
        window.__geomEvents = [];
        const mark = type => { if (window.__geomEvents.length < 200) window.__geomEvents.push({type,t:Math.round(performance.now()),w:innerWidth,h:innerHeight,x:scrollX,vw:visualViewport?.width,vo:visualViewport?.offsetLeft}); };
        addEventListener('resize', () => mark('window.resize')); addEventListener('scroll', () => mark('window.scroll'));
        visualViewport?.addEventListener('resize', () => mark('visualViewport.resize')); visualViewport?.addEventListener('scroll', () => mark('visualViewport.scroll'));
        const Native = window.ResizeObserver;
        if (Native) window.ResizeObserver = class extends Native { constructor(cb) { super((entries, observer) => { mark('ResizeObserver'); cb(entries, observer); }); } };
      });
      await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort('blockedbyclient'));
      const result = { build, viewport:landscape, errors };
      try {
        await page.goto(`${origin}/${build}.html`, {waitUntil:'domcontentloaded',timeout:60000});
        await page.waitForFunction(() => document.body.classList.contains('gis-mode') && document.querySelector('#gisMapMount [data-role="basemap-menu-toggle"]'), {timeout:60000});
        await page.waitForTimeout(800);
        result.portrait = await geometry(page);
        await page.evaluate(() => { window.__geomEvents = []; });
        await page.setViewportSize(landscape);
        result.rotationSamples=[];
        for (let i=0; i<10; i++) { await page.waitForTimeout(150); const m=await geometry(page); result.rotationSamples.push({innerWidth:m.innerWidth,scrollX:m.scrollX,scrollWidth:m.root.scrollWidth,clientWidth:m.root.clientWidth,visualViewport:m.visualViewport,header:m.header,map:m.map,eventCount:m.events.length}); }
        result.landscape = await geometry(page);
        await page.evaluate(() => window.scrollTo(10000, 0)); await page.waitForTimeout(200);
        result.afterHorizontalScrollAttempt = await geometry(page);
        await page.evaluate(() => window.scrollTo(0, 0));
        const btn=page.locator('#gisMapMount [data-role="basemap-menu-toggle"]'); const b=await btn.boundingBox();
        await page.touchscreen.tap(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(200);
        result.layerOpen=await geometry(page);
        result.layerVisible=await page.locator('#gisMapMount [data-role="basemap-menu"]').evaluate(el=>!el.hidden&&getComputedStyle(el).display!=='none');
      } catch(e) { result.error=String(e.stack||e); }
      await ctx.close(); results.push(result);
    }
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
  fs.writeFileSync(path.join(__dirname,'geometry-results.json'), JSON.stringify({description:'Edge mobile emulation; not actual Safari/iPhone',results},null,2));
  console.log(JSON.stringify(results.map(r=>({build:r.build,viewport:r.viewport,error:r.error,root:r.landscape?.root,body:r.landscape?.body,visualViewport:r.landscape?.visualViewport,scrollAfter:r.afterHorizontalScrollAttempt?.scrollX,offenders:r.landscape?.offenders,layerScrollWidth:r.layerOpen?.root?.scrollWidth,layerVisible:r.layerVisible,rotationSamples:r.rotationSamples})),null,2));
})().catch(error=>{console.error(error.stack||error);server.close();process.exitCode=1;});
