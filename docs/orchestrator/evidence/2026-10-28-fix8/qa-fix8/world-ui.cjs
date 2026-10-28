const fs=require('fs'),http=require('http');
const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
const names=['Rome','Nairobi','CapeTown','Tokyo','Jakarta','Sydney','Wellington','NewYork','BuenosAires','McMurdo','AntiWest','UTMMax'];
const cases=JSON.parse(fs.readFileSync('work/geodesy/cases.json')).filter(x=>names.includes(x.name));
(async()=>{
const bytes=fs.readFileSync('work/qa-fix8/candidate.html');
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');r.end(bytes)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',headless:true});
const out={hash:require('crypto').createHash('sha256').update(bytes).digest('hex'),rows:[],pageErrors:[],network:[]};
try {for(const mobile of [false,true]){
const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});
await ctx.route('**/*',r=>{if(r.request().url().startsWith('http://127.0.0.1:'))return r.continue();out.network.push(r.request().url());return r.abort()});
const page=await ctx.newPage();page.on('pageerror',e=>out.pageErrors.push(e.message));
await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>typeof state!=='undefined'&&typeof classifyGeoSearchInput==='function');
await page.evaluate(()=>{state.primary='DD';state.geocodeEnabled=true;state.opsecStrict=false;state.forceOffline=false;document.getElementById('geocodeCard')._refreshGeoCard()});
await page.locator('#appTopbar [data-tab="geocoding"]').click();
for(const c of cases){
await page.locator('#geoInput').fill(c.inputs.DD);await page.locator('#geoInput').press('Enter');await page.waitForTimeout(600);
const r=await page.evaluate(()=>{
const m=document.querySelector('#miniMap .tile-marker:not(.tile-marker-draft)'),p=document.querySelector('#miniMap [data-role="point-coord"]'),map=document.querySelector('#miniMap');
const rect=el=>{if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
return {point:state.lastPoint,center:state.viewCenter,domText:p?.textContent,markerTip:m?.getAttribute('data-tip'),markerStyle:m?.getAttribute('style'),marker:rect(m),map:rect(map),readout:rect(p),visible:!!m&&getComputedStyle(m).display!=='none'&&!!p&&getComputedStyle(p).display!=='none'};
});
const lonErr=(a,b)=>Math.abs(((a-b+540)%360)-180);
const correct=r.point&&Math.abs(r.point.lat-c.lat)<1e-8&&lonErr(r.point.lon,c.lon)<1e-8&&r.center&&Math.abs(r.center.lat-c.lat)<1e-8&&lonErr(r.center.lon,c.lon)<1e-8;
const textNums=(r.domText||'').match(/\d+(?:\.\d+)?/g)||[];
const textOk=textNums.length===2&&Math.abs(Number(textNums[0])-Math.abs(c.lat))<0.00001&&Math.abs(Number(textNums[1])-Math.abs(c.lon))<0.00001&&(r.domText.includes(c.lat<0?'S':'N'))&&(r.domText.includes(c.lon<0?'W':'E'));
const sx=Number((r.markerStyle||'').match(/left:([^p]+)px/)?.[1]),sy=Number((r.markerStyle||'').match(/top:([^p]+)px/)?.[1]);
const centered=r.map&&Math.abs(sx-r.map.width/2)<2&&Math.abs(sy-r.map.height/2)<2;
out.rows.push({mobile,name:c.name,input:c.inputs.DD,expected:{lat:c.lat,lon:c.lon},correct,textOk,centered,pass:correct&&textOk&&centered&&r.visible,...r});
if(['Rome','McMurdo','AntiWest'].includes(c.name))await page.screenshot({path:'work/qa-fix8/'+(mobile?'mobile-':'desktop-')+c.name+'.png'});
}
await ctx.close();
}
}finally{await browser.close();server.close();fs.writeFileSync('work/qa-fix8/world-ui.json',JSON.stringify(out,null,2));console.log(JSON.stringify({n:out.rows.length,pass:out.rows.filter(r=>r.pass).length,fail:out.rows.filter(r=>!r.pass).map(r=>({name:r.name,mobile:r.mobile,textOk:r.textOk,centered:r.centered,visible:r.visible,domText:r.domText,map:r.map,markerStyle:r.markerStyle})),errors:out.pageErrors}));}
})().catch(e=>{console.error(e);process.exitCode=1});
