const fs=require('fs'),vm=require('vm'),cp=require('child_process'),crypto=require('crypto');
const repo=process.argv[2];
const refs={live:'f215011d9b725664506a1a155e27b64d5011fb99',fix6:'b60584cc9d32f2f5c035dee0c045673843e85b34',fix7:'080e71c161be76e3ff494b1cdee1aed6889f9290'};
const names=['parseFreeTextLatLon','combineComponents','normalizeEuroDecimalLatLonSearch','looksLikePlusCode','validateLatLon','normalizeSearchQueryText','searchCoordExplicitPrefix','splitHemisphereGlued','searchCoordInvalid','latLonSymbolSpacing','latLonCensus','tryDeclaredLatLon','trySearchLatLon','classifyGeoSearchInput','routingSearchTryParseCoords'];
const cases=[['DD 44 6 9 49',false],['DDM 44.1 9.8',false],['DMS 44.1 9.8',false],['DD 45,5; 9,2',true],['DD 44.1 9.8',true],['DDM 44 6 N 9 49 E',true],['DMS -0 0 1 S 9 0 0 E',true],['DMS -0 0 1 N 9 0 0 E',false],['DD -44.1N 9.8E',false],['DD +44.1S 9.8E',false]];
const result={};for(const [label,ref] of Object.entries(refs)){
const bytes=cp.execFileSync('git',['show',ref+':coordinate_converter Claude.html'],{cwd:repo,maxBuffer:20e6}); const text=bytes.toString();const ctx=vm.createContext({console});
vm.runInContext('class ErrI18n extends Error{};'+text.split('\n').filter(x=>x.startsWith('const OLC_')).join('\n'),ctx);
for(const name of names){const i=text.indexOf('\nfunction '+name+'(')+1;if(!i)continue;const next=text.indexOf('\nfunction ',i+1); vm.runInContext(text.slice(i,next),ctx);}
const rows=cases.map(([input,expectedValid])=>{const o={input,expectedValid};for(const f of ['parseFreeTextLatLon','classifyGeoSearchInput','routingSearchTryParseCoords']){if(!ctx[f]){o[f]={unavailable:true};continue;}try{o[f]=vm.runInContext(f+'('+JSON.stringify(input)+')',ctx);}catch(e){if(e instanceof ReferenceError||/is not defined/.test(e.message))throw e;o[f]={error:e.message};}}return o;});
result[label]={ref,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),rows};}
fs.writeFileSync(__dirname+'/parser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
