const fs=require('fs'),vm=require('vm'),path=require('path');
const candidate=process.env.GIS_QA_CANDIDATE;
const expectedSha=process.env.GIS_QA_SHA256;
if(!candidate||!path.isAbsolute(candidate)||!expectedSha||!/^[a-f0-9]{64}$/i.test(expectedSha))throw Error('Set GIS_QA_CANDIDATE to an absolute file and GIS_QA_SHA256 to its exact SHA-256');
const raw=fs.readFileSync(candidate);
const sha256=require('crypto').createHash('sha256').update(raw).digest('hex');
if(sha256!==expectedSha.toLowerCase())throw Error('Candidate SHA-256 mismatch');
const source=raw.toString('utf8');
const lines=source.split(/\r?\n/);
const ranges=[[22870,22870],[22890,22928],[27472,28754],[51151,51554],[86985,86997],[83714,83733],[99749,99760],[66182,66193],[52424,52428]];
const boundaries=[['class ErrI18n extends Error','\n'],['const WGS84 =','// #endregion JS — CONSTANTS'],['const DEG =','/* ========================= SECTION 13: MAP LINKS'],['function normalizeSearchQueryText','// #endregion JS — VALIDATORS AND PARSERS'],['function routingSearchTryParseCoords','function routingSearchComposeItems'],['function polygonParseVertexCoordInputText','function polygonCollectVertexCoordModalInputText'],['function parseWaypointEditorCoordText','/** Sync draft map pin'],['function gisSanitizeCoordinate','function gisSameCoord'],['function normalizeLon(lon)','/** Shortest signed']];
const code=boundaries.map(([a,b])=>{const start=source.indexOf(a),end=source.indexOf(b,start+a.length);if(start<0||end<0)throw Error('Missing boundary '+a);return source.slice(start,end)}).join('\n');
const ctx={console};vm.createContext(ctx);vm.runInContext(code,ctx);
const cases=JSON.parse(fs.readFileSync(path.join(__dirname,'cases.json'),'utf8'));
const safe=(f,...args)=>{try{return {value:ctx[f](...args)}}catch(e){return {error:e.message}}};
const results=cases.map(p=>({...p,utm:safe('latLonToUTM',p.lat,p.lon),mgrs:safe('latLonToMGRS',p.lat,p.lon,5),inverse:p.utm?safe('utmToLatLon',p.zone,p.hem,...p.utm):null,mgrsInverse:p.mgrs?safe('mgrsToLatLonExt',p.mgrs):null,inputs:Object.fromEntries(Object.entries(p.inputs).map(([fmt,s])=>[fmt,Object.fromEntries(['parseFreeTextLatLon','autoDetect','classifyGeoSearchInput','routingSearchTryParseCoords','parseWaypointEditorCoordText','polygonParseVertexCoordInputText'].map(f=>[f,safe(f,s)]))]))}));
const invalid=['-44.1N 9.8E','+44.1S 9.8E','N-44.1 E9.8','S+44.1 E9.8','44.1N -9.8E','44.1N +9.8W','DMS -0 0 1 N 9 0 0 E','DMS 44 -0 30 N 9 0 0 E','DMS 44 0 -0 N 9 0 0 E','91, 0','0, 181','44.1 N S','DD 44foo 9bar','DMS 44 60 0 N 9 0 0 E','DMS 44 0 60 N 9 0 0 E','44.1N'];
fs.writeFileSync(path.join(__dirname,'actual.json'),JSON.stringify({sha256,candidate,boundaries,ranges,results,invalid:invalid.map(s=>({s,results:Object.fromEntries(['parseFreeTextLatLon','autoDetect','classifyGeoSearchInput','routingSearchTryParseCoords','parseWaypointEditorCoordText','polygonParseVertexCoordInputText'].map(f=>[f,safe(f,s)]))}))},null,2));

