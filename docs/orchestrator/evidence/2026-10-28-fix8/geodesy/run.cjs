const fs=require('fs'),vm=require('vm'),path=require('path');
const cp=require('child_process');
const repo=process.env.GEODESY_REPO || (fs.existsSync(path.join(__dirname,'../mart-gis/.git'))?path.join(__dirname,'../mart-gis'):cp.execFileSync('git',['rev-parse','--show-toplevel'],{cwd:__dirname,encoding:'utf8'}).trim());
const raw=cp.execFileSync('git',['show','080e71c161be76e3ff494b1cdee1aed6889f9290:coordinate_converter Claude.html'],{cwd:repo,maxBuffer:20000000});
const sha256=require('crypto').createHash('sha256').update(raw).digest('hex');
if(sha256!=='d5496fb01873d3748fd1c173f7d4091351f41aec54b7fa37a23947ecd4bcca69')throw new Error('Candidate hash mismatch');
const source=process.env.GEODESY_FIX8?fs.readFileSync(path.join(repo,'coordinate_converter Claude.html'),'utf8'):raw.toString('utf8');
const lines=source.split(/\r?\n/);
const ranges=[[22870,22870],[22890,22928],[27472,28754],[51151,51554],[86985,86997],[83714,83733],[99749,99760],[66182,66193],[52424,52428]];
const boundaries=[['class ErrI18n extends Error','\n'],['const WGS84 =','// #endregion JS — CONSTANTS'],['const DEG =','/* ========================= SECTION 13: MAP LINKS'],['function normalizeSearchQueryText','// #endregion JS — VALIDATORS AND PARSERS'],['function routingSearchTryParseCoords','function routingSearchComposeItems'],['function polygonParseVertexCoordInputText','function polygonCollectVertexCoordModalInputText'],['function parseWaypointEditorCoordText','/** Sync draft map pin'],['function gisSanitizeCoordinate','function gisSameCoord'],['function normalizeLon(lon)','/** Shortest signed']];
const code=boundaries.map(([a,b])=>{const start=source.indexOf(a),end=source.indexOf(b,start+a.length);if(start<0||end<0)throw Error('Missing boundary '+a);return source.slice(start,end)}).join('\n');
const ctx={console};vm.createContext(ctx);vm.runInContext(code,ctx);
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'cases.json'),'utf8'));
const safe=(f,...args)=>{try{return {value:ctx[f](...args)}}catch(e){return {error:e.message}}};
const results=cases.map(p=>({...p,utm:safe('latLonToUTM',p.lat,p.lon),mgrs:safe('latLonToMGRS',p.lat,p.lon,5),inverse:p.utm?safe('utmToLatLon',p.zone,p.hem,...p.utm):null,mgrsInverse:p.mgrs?safe('mgrsToLatLonExt',p.mgrs):null,inputs:Object.fromEntries(Object.entries(p.inputs).map(([fmt,s])=>[fmt,Object.fromEntries(['parseFreeTextLatLon','autoDetect','classifyGeoSearchInput','routingSearchTryParseCoords','parseWaypointEditorCoordText','polygonParseVertexCoordInputText'].map(f=>[f,safe(f,s)]))]))}));
const invalid=['-44.1N 9.8E','+44.1S 9.8E','N-44.1 E9.8','S+44.1 E9.8','44.1N -9.8E','44.1N +9.8W','DMS -0 0 1 N 9 0 0 E','DMS 44 -0 30 N 9 0 0 E','DMS 44 0 -0 N 9 0 0 E','91, 0','0, 181','44.1 N S','DD 44foo 9bar','DMS 44 60 0 N 9 0 0 E','DMS 44 0 60 N 9 0 0 E','44.1N'];
fs.writeFileSync(path.join(__dirname,process.env.GEODESY_FIX8?'actual-fix8.json':'actual.json'),JSON.stringify({sha256:require('crypto').createHash('sha256').update(source).digest('hex'),boundaries,ranges,results,invalid:invalid.map(s=>({s,results:Object.fromEntries(['parseFreeTextLatLon','autoDetect','classifyGeoSearchInput','routingSearchTryParseCoords','parseWaypointEditorCoordText','polygonParseVertexCoordInputText'].map(f=>[f,safe(f,s)]))}))},null,2));

