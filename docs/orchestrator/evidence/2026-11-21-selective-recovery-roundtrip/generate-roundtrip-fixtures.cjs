'use strict';
// Public deterministic fixtures only; every GIS value below is synthetic.
// No real backup, browser profile, driver or runtime is read or executed.
// node generate-p0-roundtrip-fixtures.cjs NEW_OUTPUT_DIR ASSEMBLER_C1625_PATH COMPARATOR_2B52_PATH
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const ASSEMBLER_SHA='c1625f8da7fe2d4c25dd645a56964ee907559e8ca7d56e69ca1b85047f6574bc';
const COMPARATOR_SHA='2b52af8981bcc76927a2129faea8daceeb539f38222930633afde94222a56f3a';
const EXPECTED_BASELINE={bytes:2018,sha256:'df94065a347cfe0c036e8ddf962c5c0f3c56c96d3718dc7ca95e269c6affd279'};
const EXPECTED_CANDIDATE={bytes:18978,sha256:'1e61d8677565a2282a0134d3dd45b23bb60d8d9831bfd8b7ed3057b565557f3e'};
const EXPECTED_SYNTHETIC_HTTP_SHA='e832aa5995fa3f459d5356923d5253047e3e191f59a1a407fe3b6962e2328a68';
// These hashes preserve the provenance of the original synthetic harness.
// They are fixture identifiers, not new verification claims about real data.
const HISTORICAL_SYNTHETIC_RECEIPT_SHAS={
  httpLocalStorage:'cb1c80691285bafe5dbf1711c59626ee67a8d030cd3d60477cc6a974cd16bde9',
  httpsLocalStorage:'d61a62c409f05fd62bcc7bdcd028818b48408a2867fa111db94438f3a1169813'
};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
class FixtureFailure extends Error {constructor(code){super(code);this.code=code;}}
function need(condition,code){if(!condition)throw new FixtureFailure(code);}
function loadPinned(filename,sha) {
  need(typeof filename==='string'&&path.isAbsolute(filename),'CODE_PATH_INVALID');
  const stat=fs.statSync(filename);
  need(stat.isFile()&&stat.size>0&&stat.size<=256*1024,'CODE_SIZE_INVALID');
  const bytes=fs.readFileSync(filename);need(hash(bytes)===sha,'CODE_HASH_MISMATCH');
  const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));
  loaded._compile(bytes.toString('utf8'),filename);loaded.loaded=true;return loaded.exports;
}
function syntheticArtifacts() {
  const point=id=>({id,name:'PRIVATE_POINT',lat:45.125,lon:9.25});
  const sourceTrack={id:'http-track',name:'PRIVATE_HTTP_TRACK',savedAt:1,closed:false,visible:true,
    points:Array.from({length:11},(_,i)=>({...point('http-p-'+i),...(i===0?{meta:null}:{})})),
    originalNumericToken:1,opaqueAddon:{kept:null,ordered:[3,2,1]}};
  const baseTracks=Array.from({length:5},(_,i)=>({id:'https-track-'+i,name:'PRIVATE_HTTPS_TRACK',savedAt:1,
    closed:false,visible:true,points:[point('base-'+i),point(i===0?'base-0':'base-second-'+i)]}));
  const httpObject={settings:{originPolicy:'PRIVATE_HTTP_SETTINGS'},savedTracks:[sourceTrack],
    mapWaypoints:Array.from({length:200},(_,i)=>({id:'wp-'+i,name:'PRIVATE_WAYPOINT',lat:45.125,lon:9.25,
      ...(i===0?{createdAt:null,updatedAt:null}:{})})),unselectedHttpSection:{mustNotCopy:'PRIVATE_HTTP_ONLY'}};
  const httpsObject={settings:{ratio:1,escaped:'A',opaque:{1:1,2:2}},savedTracks:baseTracks,mapWaypoints:[],
    unrelated:{missingDateIsNotNull:true,explicitNull:null,emptyArray:[],PRIVATE_FIELD:'PRIVATE_HTTPS_PAYLOAD'}};
  const httpMain=JSON.stringify(httpObject).replace('"originalNumericToken":1','"originalNumericToken":1.0');
  const httpsMain='  '+JSON.stringify(httpsObject).replace('"ratio":1','"ratio":1e0')
    .replace('"escaped":"A"','"escaped":"\\u0041"').replace('"opaque":{"1":1,"2":2}','"opaque":{"2":2,"1":1}')+'  ';
  const entries={
    httpLocalStorage:[['coordconv_v2',httpMain],['coordconv_ui_v1','PRIVATE_HTTP_UI'],['PRIVATE_HTTP_ONLY_KEY','PRIVATE_HTTP_ONLY_VALUE']],
    httpsLocalStorage:[['PRIVATE_HTTPS_OTHER_KEY','PRIVATE_HTTPS_OTHER_VALUE'],['coordconv_v2',httpsMain],['coordconv_ui_v1','PRIVATE_HTTPS_UI']]
  };
  const output={};
  for(const [slot,origin,acquisitoUTC] of [
    ['httpLocalStorage','http://100.99.54.93:8000','2026-11-21T14:00:00.000Z'],
    ['httpsLocalStorage','https://ionos-n8n-new.tailc01234.ts.net','2026-11-21T14:01:00.000Z']]) {
    const pairs=entries[slot];
    const artifact={formato:'TMAR-GIS-P0-LOCALSTORAGE-V1',origine:origin,acquisitoUTC,copertura:'LOCALSTORAGE_ONLY',
      stabilita:'DUE_LETTURE_COINCIDENTI',numeroChiavi:pairs.length,
      unitaUTF16ChiaviValori:pairs.reduce((n,p)=>n+p[0].length+p[1].length,0),entries:pairs};
    output[slot]={entries:pairs,main:pairs.find(pair=>pair[0]==='coordconv_v2')[1],bytes:Buffer.from(JSON.stringify(artifact)+'\n')};
  }
  return output;
}
function writeNew(filename,bytes) {
  const fd=fs.openSync(filename,'wx',0o600);
  try {let offset=0;while(offset<bytes.length){const count=fs.writeSync(fd,bytes,offset,bytes.length-offset);need(count>0,'WRITE_INCOMPLETE');offset+=count;}fs.fsyncSync(fd);}
  finally {fs.closeSync(fd);}
  const after=fs.readFileSync(filename);need(after.equals(bytes),'WRITTEN_FIXTURE_DIFFERS');
}
function generate(directory,assemblerPath,comparatorPath) {
  need(typeof directory==='string'&&path.isAbsolute(directory),'OUTPUT_PATH_INVALID');
  const assembler=loadPinned(assemblerPath,ASSEMBLER_SHA),qualified=loadPinned(comparatorPath,COMPARATOR_SHA);
  need(typeof assembler.assemble==='function'&&typeof assembler.parseMain==='function'&&typeof qualified.parseLossless==='function','CODE_EXPORTS_INVALID');
  const artifacts=syntheticArtifacts(),copies={};
  for(const slot of ['httpLocalStorage','httpsLocalStorage']) {
    const value=artifacts[slot];copies[slot]={entries:new Map(value.entries),main:assembler.parseMain(value.main,qualified),
      source:{artifactSHA256:hash(value.bytes),receiptSHA256:HISTORICAL_SYNTHETIC_RECEIPT_SHAS[slot]}};
  }
  need(hash(artifacts.httpLocalStorage.bytes)===EXPECTED_SYNTHETIC_HTTP_SHA,'SYNTHETIC_SOURCE_CHANGED');
  const baseline=artifacts.httpsLocalStorage.bytes;
  const candidate=assembler.assemble(copies.httpLocalStorage,copies.httpsLocalStorage,qualified,'2026-11-21T14:05:19.646Z').bytes;
  need(baseline.length===EXPECTED_BASELINE.bytes&&hash(baseline)===EXPECTED_BASELINE.sha256,'BASELINE_FIXTURE_CHANGED');
  need(candidate.length===EXPECTED_CANDIDATE.bytes&&hash(candidate)===EXPECTED_CANDIDATE.sha256,'CANDIDATE_FIXTURE_CHANGED');
  fs.mkdirSync(directory,{mode:0o700});
  writeNew(path.join(directory,'baseline.json'),baseline);
  writeNew(path.join(directory,'candidate.json'),candidate);
  return {schema:1,status:'SYNTHETIC_FIXTURES_GENERATED',purpose:'SYNTHETIC_DRIVER',realDataInputs:false,
    baseline:{file:'baseline.json',...EXPECTED_BASELINE,tracks:5,waypoints:0},
    candidate:{file:'candidate.json',...EXPECTED_CANDIDATE,tracks:6,waypoints:200,appendedTrackPoints:11},
    assemblerSHA256:ASSEMBLER_SHA,comparatorSHA256:COMPARATOR_SHA,
    fixtureReceiptIdentities:'HISTORICAL_SYNTHETIC_IDENTIFIERS_NOT_REAL_DATA_VERIFICATION',
    runtimeExecuted:false,driverExecuted:false,browserAccess:false};
}
function main(argv) {
  try {need(argv.length===3,'ARGUMENT_INVALID');process.stdout.write(JSON.stringify(generate(...argv))+'\n');return 0;}
  catch(error) {process.stdout.write(JSON.stringify({schema:1,status:'SYNTHETIC_FIXTURE_GENERATION_STOP',
    code:error instanceof FixtureFailure?error.code:'LOCAL_OPERATION_FAILED',realDataInputs:false,
    runtimeExecuted:false,driverExecuted:false,existingFilesNeverOverwritten:true})+'\n');return 1;}
}
module.exports={generate,syntheticArtifacts,main};
if(require.main===module)process.exitCode=main(process.argv.slice(2));
