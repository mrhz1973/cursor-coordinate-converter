'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{isDeepStrictEqual}=require('node:util');
const fail=code=>{throw new Error(code)};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let stage='CONFIG';
try{
  const cfg=JSON.parse(Buffer.from(process.argv[2],'base64').toString('utf8'));
  if(cfg.origin!=='https://ionos-n8n-new.tailc01234.ts.net'||!/^[a-f0-9]{64}$/.test(cfg.sha256)||!Number.isSafeInteger(cfg.bytes)||cfg.bytes<1||!Number.isSafeInteger(cfg.keys)||cfg.keys<0)fail('BAD_CONFIG');
  if(path.basename(cfg.source)!==cfg.filename||!/^TMAR-GIS-P0-HTTPS-localStorage-\d{8}T\d{9}Z\.json$/.test(cfg.filename))fail('BAD_FILENAME');
  stage='SOURCE_READ';
  const before=fs.statSync(cfg.source);
  if(!before.isFile()||before.size!==cfg.bytes)fail('SOURCE_SIZE');
  if(fs.existsSync(cfg.source+'.crdownload'))fail('DOWNLOAD_IN_PROGRESS');
  const bytes=fs.readFileSync(cfg.source),after=fs.statSync(cfg.source);
  if(before.size!==after.size||before.mtimeMs!==after.mtimeMs||before.ino!==after.ino||bytes.length!==cfg.bytes)fail('SOURCE_CHANGED');
  if(hash(bytes)!==cfg.sha256)fail('SOURCE_HASH');
  stage='SCHEMA';
  const data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  if(data.formato!=='TMAR-GIS-P0-LOCALSTORAGE-V1'||data.origine!==cfg.origin||data.copertura!=='LOCALSTORAGE_ONLY'||data.stabilita!=='DUE_LETTURE_COINCIDENTI')fail('SCHEMA_IDENTITY');
  if(typeof data.acquisitoUTC!=='string'||!Number.isFinite(Date.parse(data.acquisitoUTC))||new Date(data.acquisitoUTC).toISOString()!==data.acquisitoUTC)fail('SCHEMA_DATE');
  if(cfg.filename!=='TMAR-GIS-P0-HTTPS-localStorage-'+data.acquisitoUTC.replace(/[-:.]/g,'')+'.json')fail('DATE_FILENAME');
  if(!Array.isArray(data.entries)||data.entries.length!==cfg.keys||data.numeroChiavi!==cfg.keys)fail('ENTRY_COUNT');
  if(data.entries.some(p=>!Array.isArray(p)||p.length!==2||typeof p[0]!=='string'||typeof p[1]!=='string'))fail('ENTRY_TYPE');
  const keys=data.entries.map(p=>p[0]);
  if(new Set(keys).size!==keys.length||JSON.stringify(keys)!==JSON.stringify([...keys].sort()))fail('ENTRY_KEYS');
  if(data.unitaUTF16ChiaviValori!==data.entries.reduce((n,p)=>n+p[0].length+p[1].length,0))fail('ENTRY_LENGTHS');
  const main=data.entries.find(p=>p[0]==='coordconv_v2');
  const counts={mainUtf16CodeUnits:main?main[1].length:null,mainJson:main?'NOT_PARSED':'ABSENT',savedTracks:null,mapWaypoints:null,gisPolygons:null,settings:'NOT_ACQUIRED',uiKeyPresent:keys.includes('coordconv_ui_v1'),legacyKeyPresent:keys.includes('coordconv_v1')};
  if(main){
  try{
    const d=JSON.parse(main[1]);
    if(!d||typeof d!=='object'||Array.isArray(d)){counts.mainJson='INVALID_ROOT';}
    else{
      counts.mainJson='VALID_OBJECT';
      for(const key of ['savedTracks','mapWaypoints','gisPolygons'])counts[key]=!Object.hasOwn(d,key)?'ABSENT':Array.isArray(d[key])?d[key].length:'UNEXPECTED_TYPE';
      counts.settings=!Object.hasOwn(d,'settings')?'ABSENT':d.settings&&typeof d.settings==='object'&&!Array.isArray(d.settings)?'PRESENT_OBJECT':'UNEXPECTED_TYPE';
    }
  }catch{counts.mainJson='INVALID_JSON';}
  }
  stage='DESTINATION_COPY';
  const directory=path.resolve(cfg.backupDirectory),destination=path.join(directory,cfg.filename);
  if(path.resolve(cfg.source)===path.resolve(destination))fail('SAME_SOURCE_DESTINATION');
  fs.mkdirSync(directory,{recursive:true});
  if(fs.existsSync(destination)){
    const existing=fs.readFileSync(destination);
    if(existing.length!==cfg.bytes||hash(existing)!==cfg.sha256)fail('DESTINATION_CONFLICT');
  }else{
    fs.writeFileSync(destination,bytes,{flag:'wx'});
  }
  const copied=fs.readFileSync(destination);
  if(copied.length!==cfg.bytes||hash(copied)!==cfg.sha256||!copied.equals(bytes))fail('COPY_VERIFY');
  stage='RECEIPT';
  const receiptPath=path.join(directory,'verification.json');
  let receipt={schema:1,status:'VERIFIED',coverage:'LOCALSTORAGE_ONLY',origin:cfg.origin,capturedUTC:data.acquisitoUTC,verifiedUTC:new Date().toISOString(),filename:cfg.filename,sourcePath:cfg.source,backupPath:destination,bytes:cfg.bytes,sha256:cfg.sha256,keys:cfg.keys,counts,checks:{sourceSize:true,sourceStableDuringRead:true,sourceSHA256MatchesBrowser:true,schema:true,uniqueStringPairs:true,copyByteForByte:true,copySHA256MatchesBrowser:true},completeOriginBackup:false,httpsComparison:'NOT_PERFORMED',sourceWrites:false};
  if(fs.existsSync(receiptPath)){
    const old=JSON.parse(fs.readFileSync(receiptPath,'utf8'));
    if(typeof old.verifiedUTC!=='string'||!Number.isFinite(Date.parse(old.verifiedUTC))||new Date(old.verifiedUTC).toISOString()!==old.verifiedUTC)fail('RECEIPT_CONFLICT');
    receipt.verifiedUTC=old.verifiedUTC;
    if(!isDeepStrictEqual(old,receipt))fail('RECEIPT_CONFLICT');
  }else fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
  const receiptBytes=fs.readFileSync(receiptPath),reread=JSON.parse(receiptBytes.toString('utf8'));
  if(!isDeepStrictEqual(reread,receipt))fail('RECEIPT_VERIFY');
  console.log(JSON.stringify({...receipt,receiptPath,receiptSHA256:hash(receiptBytes)}));
}catch(error){
  const allowed=new Set(['BAD_CONFIG','BAD_FILENAME','SOURCE_SIZE','DOWNLOAD_IN_PROGRESS','SOURCE_CHANGED','SOURCE_HASH','SCHEMA_IDENTITY','SCHEMA_DATE','DATE_FILENAME','ENTRY_COUNT','ENTRY_TYPE','ENTRY_KEYS','ENTRY_LENGTHS','SAME_SOURCE_DESTINATION','DESTINATION_CONFLICT','COPY_VERIFY','RECEIPT_CONFLICT','RECEIPT_VERIFY']);
  console.log(JSON.stringify({status:'STOP',stage,code:allowed.has(error.message)?error.message:'LOCAL_OPERATION_FAILED',verifiedBackup:false,sourceWrites:false}));
  process.exitCode=1;
}
