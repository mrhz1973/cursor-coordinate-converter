const fs=require('fs'),vm=require('vm'),path=require('path');
const cp=require('child_process');
const repo=process.env.GEODESY_REPO || cp.execFileSync('git',['rev-parse','--show-toplevel'],{cwd:__dirname,encoding:'utf8'}).trim();
const raw=fs.readFileSync(path.join(repo,'coordinate_converter Claude.html'));
const sha256=require('crypto').createHash('sha256').update(raw).digest('hex');
if(sha256!=='32f2b7a65310d69e405d1102b753b10a7adcda4b7efad629d3042e25dc397b28')throw new Error('Current runtime hash mismatch');
const source=raw.toString('utf8');
const boundaries=[['class ErrI18n extends Error','\n'],['const WGS84 =','// #endregion JS — CONSTANTS'],['const DEG =','/* ========================= SECTION 13: MAP LINKS'],['function normalizeSearchQueryText','// #endregion JS — VALIDATORS AND PARSERS'],['function routingSearchTryParseCoords','function routingSearchComposeItems'],['function polygonParseVertexCoordInputText','function polygonCollectVertexCoordModalInputText'],['function captureResultMgrsSource','function mgrsSourceFromHistory'],['function mgrsSourceFromInput','function renderResults'],['function parseWaypointEditorCoordText','/** Sync draft map pin'],['function gisSanitizeCoordinate','function gisSameCoord'],['function normalizeLon(lon)','/** Shortest signed']];
const code=boundaries.map(([a,b])=>{const start=source.indexOf(a),end=source.indexOf(b,start+a.length);if(start<0||end<0)throw Error('Missing boundary '+a);return source.slice(start,end)}).join('\n');
const ctx={console};vm.createContext(ctx);vm.runInContext(code,ctx);
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'cases.json'),'utf8'));
const safe=(f,...args)=>{try{return {value:ctx[f](...args)}}catch(e){return {error:e.message}}};
const results=cases.map(p=>({...p,utm:safe('latLonToUTM',p.lat,p.lon),mgrs:safe('latLonToMGRS',p.lat,p.lon,5),inverse:p.utm?safe('utmToLatLon',p.zone,p.hem,...p.utm):null,mgrsInverse:p.mgrs?safe('mgrsToLatLonExt',p.mgrs):null,inputs:Object.fromEntries(Object.entries(p.inputs).map(([fmt,s])=>[fmt,Object.fromEntries(['parseFreeTextLatLon','autoDetect','classifyGeoSearchInput','routingSearchTryParseCoords','parseWaypointEditorCoordText','polygonParseVertexCoordInputText'].map(f=>[f,safe(f,s)]))]))}));
const invalid=['-44.1N 9.8E','+44.1S 9.8E','N-44.1 E9.8','S+44.1 E9.8','44.1N -9.8E','44.1N +9.8W','DMS -0 0 1 N 9 0 0 E','DMS 44 -0 30 N 9 0 0 E','DMS 44 0 -0 N 9 0 0 E','91, 0','0, 181','44.1 N S','DD 44foo 9bar','DMS 44 60 0 N 9 0 0 E','DMS 44 0 60 N 9 0 0 E','44.1N'];
fs.writeFileSync(path.join(__dirname,'actual-current.json'),JSON.stringify({sha256,points:cases.length,boundaries,results,invalid:invalid.map(s=>({s,results:Object.fromEntries(['parseFreeTextLatLon','autoDetect','classifyGeoSearchInput','routingSearchTryParseCoords','parseWaypointEditorCoordText','polygonParseVertexCoordInputText'].map(f=>[f,safe(f,s)]))}))},null,2));

