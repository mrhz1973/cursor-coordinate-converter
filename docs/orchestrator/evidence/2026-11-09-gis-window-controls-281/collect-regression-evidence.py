from pathlib import Path
import json,hashlib,base64,zipfile,datetime

root=Path(__file__).resolve().parent
sha=lambda b:hashlib.sha256(b).hexdigest()
j=json.loads((root/'candidate-281/audit-results.json').read_text(encoding='utf-8'))
manifest=json.loads((root/'candidate-281/execution-manifest.json').read_text(encoding='utf-8'))
assert manifest['stage']=='completed' and manifest['nodeExitCode']==0
summary={k:j[k] for k in ['scope','sourceMode','build','candidateSha256','candidateBytes','candidateAfterSha256','environment','browserVersion','url','startedAtUtc','finishedAtUtc','targetedPass']}
summary['runnerSha256']=sha((root/'regression-panels-edge-281.cjs').read_bytes())
summary['cases']=[]
for r in j['runs']:
 row={k:r.get(k) for k in ['name','completed','targetedPass','harnessOrUiError','view','pageErrors','eventObservations']}
 row['checkCount']=len(r['checks']);row['failedChecks']=[c for c in r['checks'] if not c['pass']]
 row['network']=r['network'];row['console']=r['console']
 row['snapshots']=[{'label':s['label'],'panelRect':s['panel']['rect'],'headerRect':s['header']['rect'],'topbarRect':s['topbar']['rect'],'closeReachable':s['close']['centerReachable'],'minimizeReachable':s['minimize']['centerReachable'],'accessibility':s['accessibility'],'ariaLabelledby':s['panel']['ariaLabelledby']} for s in r['snapshots']]
 row['escapeSteps']=r['escapeSteps'];summary['cases'].append(row)
summary['totals']={'cases':len(j['runs']),'passedCases':sum(r['targetedPass'] for r in j['runs']),'checks':sum(len(r['checks']) for r in j['runs']),'failedChecks':sum(sum(not c['pass'] for c in r['checks']) for r in j['runs']),'providerAttempts':sum(r['network']['blockedProvider'] for r in j['runs']),'postAttempts':sum(r['network']['blockedPost'] for r in j['runs']),'pageErrors':sum(len(r['pageErrors']) for r in j['runs'])}
(root/'regression-summary.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8')
text_files=['regression-panels-edge-281.cjs','launch-regression.py','regression-summary.json']
for sub in ['instrumentation-attempt1/baseline-280','baseline-280','candidate-281']:
 text_files.extend(sub+'/'+name for name in ['audit-results.json','execution-manifest.json','execution-console.txt'])
text_files.extend('instrumentation-attempt1/'+name for name in ['regression-panels-edge-281.cjs','launch-regression.py'])
screens=['candidate-281/'+name for name in [
 'desktop-convert-lifecycle-opened.png','mobile-convert-lifecycle-opened.png',
 'desktop-escape-convert-help-after-first-escape.png',
 'mobile-astro-390-opened.png','mobile-astro-390-after-drag-resize.png',
 'short-astro-390-reopened.png','desktop-native-child-cancel-native-child-before-escape.png']]
files=text_files+screens
evidence={'build':281,'candidateSha256':j['candidateSha256'],'sourceMode':'candidate_injected','createdAtUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':[]}
for n in files:
 data=(root/n).read_bytes();evidence['files'].append({'path':n,'bytes':len(data),'sha256':sha(data)})
(root/'evidence-manifest.json').write_text(json.dumps(evidence,indent=2)+'\n',encoding='utf-8')
transfer=root/'transfer-regression281';transfer.mkdir(exist_ok=True)
descriptors=[]
for category,names in [('text',text_files+['evidence-manifest.json']),('screens',screens)]:
 z=transfer/(category+'.zip')
 with zipfile.ZipFile(z,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as f:
  for n in names:f.write(root/n,n)
 data=z.read_bytes();encoded=base64.b64encode(data).decode('ascii');parts=[]
 for i in range(0,len(encoded),100000):
  name=category+'-'+str(i//100000).zfill(3)+'.txt';part=encoded[i:i+100000]
  (transfer/name).write_text(part,encoding='ascii');parts.append({'name':name,'characters':len(part)})
 descriptors.append({'category':category,'bytes':len(data),'sha256':sha(data),'parts':parts})
(transfer/'transport-manifest.json').write_text(json.dumps(descriptors,indent=2),encoding='utf-8')
print(json.dumps({'totals':summary['totals'],'startedAtUtc':j['startedAtUtc'],'finishedAtUtc':j['finishedAtUtc'],'candidateAfterSha256':j['candidateAfterSha256'],'runnerSha256':summary['runnerSha256'],'transport':descriptors}))
