const fs=require('fs'),http=require('http');
const {chromium}=require('C:/goi-pw-probe/node_modules/playwright');
const names=['Rome','Nairobi','CapeTown','Tokyo','Jakarta','Sydney','Wellington','NewYork','BuenosAires','McMurdo','AntiWest','UTMMax'];
const cases=JSON.parse(fs.readFileSync('work/geodesy/cases.json')).filter(x=>names.includes(x.name));
(async()=>{
const bytes=fs.readFileSync('work/qa-fix8-final/candidate.html');
const targetURL=process.argv[2]; if(!targetURL)throw new Error('Pass HTTP runtime URL explicitly');
const expectedHash='0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145';
if(require('crypto').createHash('sha256').update(bytes).digest('hex')!==expectedHash)throw new Error('Local immutable candidate hash mismatch');
const browser=await chromium.launch({executablePath:'C:/Users/Utente/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe',headless:true});
const out={served:[],gates:[],hash:require('crypto').createHash('sha256').update(bytes).digest('hex'),rows:[],pageErrors:[],network:[]};
try {for(const mobile of [false,true]){
const ctx=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});
await ctx.route('**/*',r=>{if(r.request().url()===targetURL && r.request().isNavigationRequest() && r.request().resourceType()==='document')return r.continue();out.network.push(r.request().url());return r.abort()});
const page=await ctx.newPage();page.on('pageerror',e=>out.pageErrors.push(e.message));
const cdp=await ctx.newCDPSession(page); await cdp.send('Network.enable',{maxTotalBufferSize:67108864,maxResourceBufferSize:33554432});
const fetched=await ctx.request.get(targetURL); const servedBytes=await fetched.body();
const response=await page.goto(targetURL,{waitUntil:'domcontentloaded'});
const servedHash=require('crypto').createHash('sha256').update(servedBytes).digest('hex');
out.served.push({mobile,url:response.url(),status:response.status(),sha256:servedHash,hashSource:"separate real HTTP GET same URL",bytes:servedBytes.length,browserContentLength:response.headers()["content-length"],fetchedLastModified:fetched.headers()["last-modified"],browserLastModified:response.headers()["last-modified"]});
if(fetched.status()!==200||response.status()!==200||servedHash!==expectedHash||Number(response.headers()['content-length'])!==servedBytes.length||fetched.headers()['last-modified']!==response.headers()['last-modified'])throw new Error('Served runtime identity mismatch');
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
if(['Rome','McMurdo','AntiWest'].includes(c.name))await page.screenshot({path:'work/qa-fix8-final/postdeploy-'+(mobile?'mobile-':'desktop-')+c.name+'.png'});
}
for(const [name,strict,enabled,offline] of [['strict',true,true,false],['geocoding-off',false,false,false],['offline',false,true,true]]){
await page.evaluate(([s,e,o])=>{state.opsecStrict=s;state.geocodeEnabled=e;state.forceOffline=o;document.getElementById('geocodeCard')._refreshGeoCard()},[strict,enabled,offline]);
const before=await page.evaluate(()=>state.lastPoint), n0=out.network.length;
await page.locator('#geoInput').fill('Roma');await page.locator('#geoInput').press('Enter');await page.waitForTimeout(750);
const after=await page.evaluate(()=>state.lastPoint), attempted=out.network.slice(n0), geocoding=attempted.filter(u=>u.includes('nominatim'));
out.gates.push({mobile,name,before,after,attempted,pass:JSON.stringify(before)===JSON.stringify(after)&&geocoding.length===0});
}
await ctx.close();
}
}finally{await browser.close();fs.writeFileSync('work/qa-fix8-final/postdeploy-results.json',JSON.stringify(out,null,2));console.log(JSON.stringify({n:out.rows.length,pass:out.rows.filter(r=>r.pass).length,fail:out.rows.filter(r=>!r.pass).map(r=>({name:r.name,mobile:r.mobile,textOk:r.textOk,centered:r.centered,visible:r.visible,domText:r.domText,map:r.map,markerStyle:r.markerStyle})),errors:out.pageErrors,gates:out.gates,served:out.served}));}
if(out.rows.length!==24||out.rows.some(r=>!r.pass)||out.gates.length!==6||out.gates.some(r=>!r.pass)||out.pageErrors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
