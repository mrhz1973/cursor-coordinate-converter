'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{isDeepStrictEqual}=require('node:util');
const ORIGIN='http://100.99.54.93:8000';
const MAX_FILE=200*1024*1024,MAX_BINARY=64*1024*1024,MAX_RECORDS=150000,MAX_TEXT_BYTES=4*1024*1024;
class VerificationFailure extends Error{constructor(code){super(code);this.code=code;}}
const fail=code=>{throw new VerificationFailure(code);};
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const isHash=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const intBetween=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const exact=(o,keys)=>o!==null&&typeof o==='object'&&!Array.isArray(o)&&isDeepStrictEqual(Object.keys(o).sort(),[...keys].sort());
const iso=s=>typeof s==='string'&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString()===s;
const sameStat=(a,b)=>a.size===b.size&&a.mtimeMs===b.mtimeMs&&a.ino===b.ino&&a.dev===b.dev;
function readStable(file,length,code){
  if(!intBetween(length,MAX_FILE))fail(code);
  let fd;
  try{
    fd=fs.openSync(file,'r');
    const before=fs.fstatSync(fd);
    if(!before.isFile()||before.size!==length)fail(code);
    const data=Buffer.alloc(length);
    let offset=0;
    while(offset<data.length){const n=fs.readSync(fd,data,offset,data.length-offset,null);if(n===0)fail(code);offset+=n;}
    const extra=Buffer.alloc(1);
    if(fs.readSync(fd,extra,0,1,null)!==0||!sameStat(before,fs.fstatSync(fd))||!sameStat(before,fs.statSync(file)))fail(code);
    return data;
  }finally{if(fd!==undefined)fs.closeSync(fd);}
}
function writeNew(file,bytes){
  let fd;
  try{fd=fs.openSync(file,'wx');fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);}
  finally{if(fd!==undefined)fs.closeSync(fd);}
}
let stage='CONFIG';
try{
  const cfg=JSON.parse(Buffer.from(process.argv[2],'base64').toString('utf8'));
  if(!exact(cfg,['source','filename','sha256','bytes','records','byteBinari','origin','backupDirectory'])||
     cfg.origin!==ORIGIN||!isHash(cfg.sha256)||!intBetween(cfg.bytes,MAX_FILE)||cfg.bytes===0||
     !intBetween(cfg.records,MAX_RECORDS)||!intBetween(cfg.byteBinari,MAX_BINARY)||
     typeof cfg.source!=='string'||!path.isAbsolute(cfg.source)||typeof cfg.backupDirectory!=='string'||!path.isAbsolute(cfg.backupDirectory))fail('BAD_CONFIG');
  if(typeof cfg.filename!=='string'||path.basename(cfg.source)!==cfg.filename||!/^TMAR-GIS-P0-HTTP-IndexedDB-\d{8}T\d{9}Z\.json$/.test(cfg.filename))fail('BAD_FILENAME');

  stage='SOURCE_READ';
  if(fs.existsSync(cfg.source+'.crdownload'))fail('DOWNLOAD_IN_PROGRESS');
  const bytes=readStable(cfg.source,cfg.bytes,'SOURCE_CHANGED_OR_SIZE');
  if(hash(bytes)!==cfg.sha256)fail('SOURCE_HASH');

  stage='SCHEMA';
  const data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  if(!exact(data,['formato','origine','acquisitoUTC','copertura','database','store','transactionMode','numeroRecords','byteBinari','records'])||
     data.formato!=='TMAR-GIS-P0-IDB-TILES-V1'||data.origine!==ORIGIN||data.copertura!=='INDEXEDDB_TILES_ONLY'||data.transactionMode!=='readonly')fail('SCHEMA_IDENTITY');
  if(!iso(data.acquisitoUTC))fail('SCHEMA_DATE');
  if(cfg.filename!=='TMAR-GIS-P0-HTTP-IndexedDB-'+data.acquisitoUTC.replace(/[-:.]/g,'')+'.json')fail('DATE_FILENAME');
  if(!exact(data.database,['name','version'])||data.database.name!=='CoordConvMapTiles'||data.database.version!==1)fail('DATABASE_SCHEMA');
  if(!exact(data.store,['name','keyPath','autoIncrement','indexes'])||data.store.name!=='tiles'||data.store.keyPath!==null||data.store.autoIncrement!==false||!Array.isArray(data.store.indexes)||data.store.indexes.length!==0)fail('STORE_SCHEMA');
  if(!Array.isArray(data.records)||data.records.length!==cfg.records||data.numeroRecords!==cfg.records||data.byteBinari!==cfg.byteBinari)fail('RECORD_COUNT_OR_TOTAL');

  stage='RECORDS';
  const keys=new Set();
  let binaryBytes=0,textUnits=0;
  for(const record of data.records){
    if(!exact(record,['key','ct','bBase64','byteLength','sha256'])||typeof record.key!=='string'||typeof record.ct!=='string'||typeof record.bBase64!=='string'||!intBetween(record.byteLength,MAX_BINARY)||!isHash(record.sha256))fail('RECORD_SCHEMA');
    if(keys.has(record.key))fail('DUPLICATE_KEY');
    keys.add(record.key);
    binaryBytes+=record.byteLength;textUnits+=record.key.length+record.ct.length;
    if(!intBetween(binaryBytes,MAX_BINARY)||!intBetween(2*textUnits,MAX_TEXT_BYTES))fail('ACQUISITION_LIMIT');
    if(record.bBase64.length!==4*Math.ceil(record.byteLength/3))fail('BASE64_LENGTH');
    const binary=Buffer.from(record.bBase64,'base64');
    if(binary.length!==record.byteLength||binary.toString('base64')!==record.bBase64)fail('BASE64_NON_CANONICAL');
    if(hash(binary)!==record.sha256)fail('RECORD_HASH');
  }
  if(binaryBytes!==cfg.byteBinari||keys.size!==cfg.records)fail('RECORD_COUNT_OR_TOTAL');

  stage='DESTINATION_COPY';
  const directory=path.resolve(cfg.backupDirectory),destination=path.join(directory,cfg.filename);
  if(path.resolve(cfg.source)===path.resolve(destination))fail('SAME_SOURCE_DESTINATION');
  fs.mkdirSync(directory,{recursive:true});
  if(fs.existsSync(destination)){
    if(fs.realpathSync(cfg.source)===fs.realpathSync(destination))fail('SAME_SOURCE_DESTINATION');
    const sourceStat=fs.statSync(cfg.source),destStat=fs.statSync(destination);
    if(sourceStat.ino!==0&&sourceStat.ino===destStat.ino&&sourceStat.dev===destStat.dev)fail('SAME_SOURCE_DESTINATION');
    const existing=readStable(destination,cfg.bytes,'DESTINATION_CONFLICT');
    if(hash(existing)!==cfg.sha256)fail('DESTINATION_CONFLICT');
  }else writeNew(destination,bytes);
  const copied=readStable(destination,cfg.bytes,'COPY_VERIFY');
  if(hash(copied)!==cfg.sha256||!copied.equals(bytes))fail('COPY_VERIFY');

  stage='RECEIPT';
  const receiptPath=path.join(directory,'verification.json');
  const receipt={schema:1,status:'VERIFIED',coverage:'INDEXEDDB_TILES_ONLY',origin:ORIGIN,capturedUTC:data.acquisitoUTC,verifiedUTC:new Date().toISOString(),filename:cfg.filename,sourcePath:cfg.source,backupPath:destination,bytes:cfg.bytes,sha256:cfg.sha256,database:'CoordConvMapTiles',databaseVersion:1,store:'tiles',records:cfg.records,binaryBytes,textUtf16CodeUnits:textUnits,textUtf16Bytes:2*textUnits,checks:{sourceSize:true,sourceStableDuringRead:true,sourceSHA256MatchesBrowser:true,exactSchema:true,uniqueKeys:true,canonicalBase64:true,allBinarySHA256:true,binaryTotal:true,copyByteForByte:true,copySHA256MatchesBrowser:true},completeOriginBackup:false,httpsComparison:'NOT_PERFORMED',sourceWrites:false};
  if(fs.existsSync(receiptPath)){
    const size=fs.statSync(receiptPath).size;
    if(!intBetween(size,1024*1024))fail('RECEIPT_CONFLICT');
    const old=JSON.parse(readStable(receiptPath,size,'RECEIPT_CONFLICT').toString('utf8'));
    if(!iso(old.verifiedUTC))fail('RECEIPT_CONFLICT');
    receipt.verifiedUTC=old.verifiedUTC;
    if(!isDeepStrictEqual(old,receipt))fail('RECEIPT_CONFLICT');
  }else writeNew(receiptPath,Buffer.from(JSON.stringify(receipt,null,2)+'\n','utf8'));
  const receiptSize=fs.statSync(receiptPath).size;
  if(!intBetween(receiptSize,1024*1024))fail('RECEIPT_VERIFY');
  const receiptBytes=readStable(receiptPath,receiptSize,'RECEIPT_VERIFY');
  if(!isDeepStrictEqual(JSON.parse(receiptBytes.toString('utf8')),receipt))fail('RECEIPT_VERIFY');
  console.log(JSON.stringify({...receipt,receiptPath,receiptSHA256:hash(receiptBytes)}));
}catch(error){
  console.log(JSON.stringify({status:'STOP',stage,code:error instanceof VerificationFailure?error.code:'LOCAL_OPERATION_FAILED',coverage:'INDEXEDDB_TILES_ONLY',verifiedBackup:false,completeOriginBackup:false,sourceWrites:false}));
  process.exitCode=1;
}
