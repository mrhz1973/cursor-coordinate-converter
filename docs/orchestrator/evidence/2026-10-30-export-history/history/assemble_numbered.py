import json, pathlib, re
p = pathlib.Path(__file__).parent
raw=json.loads((p/'git-commit-builds.partial.json').read_text(encoding='utf8'))
live={176,183,192,195,196,197,203,204,205,206,207,208,210,212,213,214,215,219,220,221,222,223,224,226,227,228,230,231,232,233,234,235,237,238,240,241,242,243,244,245,246,247,248,249,250,251,252,255,256,265,266,267}
failed={222,227,266}
candidate=set(range(257,265)) | {225,229,236,239}
by={}; current=None
for r in reversed(raw):
    n=r.get('build_added')
    if n is not None:
        current=int(n)
        by.setdefault(current,{'build':current,'sha':r['sha'],'date':r['date'],'id':r.get('id_added'),'detail':r.get('detail_added'),'commits':[],'status':('distribuita-con-fail-successivamente-corretta' if current in failed else 'deploy-documentato' if current in live else 'candidate-non-promossa' if current in candidate else 'deploy-da-verificare')})
    if current is not None:
        by[current]['commits'].append({'sha':r['sha'],'date':r['date'],'subject':r['subject']})
extra=[
 (236,'d223b38f8f1dd6ab0e5aac312fb46b2a34bdcc03','2026-08-20','D-FLIGHT-DETAILS-CONTENT-CLEANUP-A','Dettagli zona: testo display sicuro (strip HTML/entity, no raw HTML).','fix(dflight): safe plain-text display for zone details content, build 236'),
 (239,'be49ed2494dbaa9bdf25d55151b3ac15c390fd07','2026-08-21','GIS-POLYGON-VERTEX-COORD-UX-A','Polygon edit: vertex coord list, live drag readout, copy, autoDetect paste.','GIS-POLYGON-VERTEX-COORD-UX-A: vertex coord list, live drag, autoDetect paste (build 239).')]
for n,sha,date,ident,detail,subject in extra:
    if n not in by:
        by[n]={'build':n,'sha':sha,'date':date,'id':ident,'detail':detail,'commits':[{'sha':sha,'date':date,'subject':subject}],'status':'candidate-non-promossa','provenance':'commit separato, verificato valore APP_BUILD_NUM nel blob; non incluso nella linea principale'}
data=sorted(by.values(),key=lambda x:x['build'],reverse=True)
metadata={'schema_version':1,'method':'Commit monolite raggruppati temporalmente dalla comparsa di APP_BUILD_NUM fino alla build seguente; non prova deploy. Un commit può contenere modifiche non sintetizzate nel subject. Fonte: git log -p, SHA pin.','source_commit':raw[0]['sha'],'complete_scan':False,'live_scope':'Solo le 52 build con prova documentale esplicita nel report; le altre da verificare. 222/227/266 distribuite con FAIL successivo. 257–264,225,229,236,239 non promosse o non attestate.','builds':data}
(p/'numbered-builds.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf8')
print('builds',len(data),'min',min(by),'max',max(by),'commits',sum(len(x['commits']) for x in data),'live_documented',sum(x['status']=='deploy-documentato' for x in data),'failed',sum(x['status']=='distribuita-con-fail-successivamente-corretta' for x in data))
