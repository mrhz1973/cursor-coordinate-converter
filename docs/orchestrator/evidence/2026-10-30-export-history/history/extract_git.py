import subprocess, json, re, pathlib, os
repo = pathlib.Path(r'C:\Users\Utente\Documents\Codex\2026-10-28\gi\work\mart-gis')
outdir = pathlib.Path(r'C:\Users\Utente\Documents\Codex\2026-10-28\gi\work\release-history')
cmd = ['git','log','--format=@@@RELEASE_COMMIT@@@%H%x09%cs%x09%s','--no-ext-diff','--unified=0','-p','HEAD','--','coordinate_converter Claude.html']
p = subprocess.Popen(cmd,cwd=repo,stdout=subprocess.PIPE,stderr=subprocess.PIPE,encoding='utf-8',errors='replace',bufsize=1)
items=[]; row=None
for raw in p.stdout:
    line=raw.rstrip('\r\n')
    if line.startswith('@@@RELEASE_COMMIT@@@'):
        chunks=line[len('@@@RELEASE_COMMIT@@@'):].split('\t',2)
        if len(chunks)==3:
            row={'sha':chunks[0],'date':chunks[1],'subject':chunks[2],'build_added':None,'id_added':None,'detail_added':None,'build_removed':None}
            items.append(row)
            if len(items) % 20 == 0:
                outdir.mkdir(parents=True, exist_ok=True)
                (outdir/'git-commit-builds.partial.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf8')
    elif row and line and line[0] in '+-' and not line.startswith(('+++','---')):
        sign=line[0]; text=line[1:]
        m=re.search(r'\b(?:const|let|var)\s+APP_BUILD_NUM\s*=\s*["\']?(\d+)',text)
        if m: row['build_added' if sign=='+' else 'build_removed']=int(m.group(1))
        m=re.search(r'\b(?:const|let|var)\s+APP_BUILD_ID\s*=\s*["\']([^"\']+)',text)
        if m and sign=='+': row['id_added']=m.group(1)
        m=re.search(r'\b(?:const|let|var)\s+APP_BUILD_DETAIL\s*=\s*["\']([^"\']+)',text)
        if m and sign=='+': row['detail_added']=m.group(1)
code=p.wait(); err=p.stderr.read()
outdir.mkdir(parents=True,exist_ok=True)
(outdir/'git-commit-builds.partial.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf8')
if code: raise SystemExit('git log failed after '+str(len(items))+' commits, partial saved: '+err[:1000])
(outdir/'git-commit-builds.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf8')
hits=[x for x in items if x['build_added'] is not None]
print('commits',len(items),'build_line_changes',len(hits),'min',min(x['build_added'] for x in hits) if hits else None,'max',max(x['build_added'] for x in hits) if hits else None)
print('earliest_hits',json.dumps(hits[-8:],ensure_ascii=False))
