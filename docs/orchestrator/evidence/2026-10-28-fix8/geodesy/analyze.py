exec(open(__file__.replace('analyze.py','reference.py'),encoding='utf-8').read().split('cases=[]')[0])
suffix='-fix8' if '--fix8' in sys.argv else ''
actual=json.loads((HERE/('actual'+suffix+'.json')).read_text())
rows=[];failures=[];mgrs_strings=[]
def distance(lat,lon,lat2,lon2):return Geodesic.WGS84.Inverse(lat,lon,lat2,lon2)['s12']
def record(group,name,error,tol,details=None):
 row=dict(group=group,name=name,error_m=error,tolerance_m=tol,pass_=error is not None and error<=tol,details=details);rows.append(row)
 if not row['pass_']:failures.append(row)
def coord(v):
 if not v or v.get('error'):return None
 v=v['value']
 if not v:return None
 if 'kind' in v:v=v.get('det')
 if not v or not isinstance(v.get('lat'),(float,int)):return None
 return v['lat'],v['lon']
for p in actual['results']:
 if p.get('utm') and 'value' in p['utm']:
  u=p['utm']['value'];ref=next(c for c in json.loads((HERE/'cases.json').read_text()) if c['name']==p['name'])
  if 'utm' in ref:
   crs_forward=(32600 if u['hemisphere']=='N' else 32700)+u['zone'];ef,nf=pyproj.Transformer.from_crs(4326,crs_forward,always_xy=True).transform(p['lon'],p['lat'])
   record('UTM_forward',p['name'],math.hypot(u['easting']-ef,u['northing']-nf),.01)
   co=coord(p['inverse']);record('UTM_inverse_PROJ_input',p['name'],distance(p['lat'],p['lon'],*co) if co else None,.01)
   co=coord(p['mgrsInverse']);reference=M.toLatLon(ref['mgrs']);z=int(ref['mgrs'][:2]);crs=32600+z if ref['mgrs'][2]>='N' else 32700+z
   tx=pyproj.Transformer.from_crs(4326,crs,always_xy=True);itx=pyproj.Transformer.from_crs(crs,4326,always_xy=True)
   ee,nn=tx.transform(reference[1],reference[0]);ll=itx.transform(ee-.5,nn-.5);reference=(ll[1],ll[0])
   record('MGRS_inverse_GEOTRANS_SW_input',p['name'],distance(*reference,*co) if co else None,.02)
   try:
    mgcenter=M.toLatLon(p['mgrs']['value'].replace(' ',''));record('MGRS_forward_GEOTRANS_decode',p['name'],distance(p['lat'],p['lon'],*mgcenter),.72)
   except Exception as exc:record('MGRS_forward_GEOTRANS_decode',p['name'],None,.72,str(exc))
   g=p['mgrs'].get('value','').replace(' ','');mgrs_strings.append(dict(name=p['name'],actual=g,reference=ref['mgrs'],equal=g==ref['mgrs']))
 for fmt,outputs in p['inputs'].items():
  for helper,v in outputs.items():
   if fmt in ['UTM','MGRS'] and helper in ['parseFreeTextLatLon','routingSearchTryParseCoords']:continue
   co=coord(v);tol=1.43 if fmt=='MGRS' else (.02 if helper=='polygonParseVertexCoordInputText' else .01)
   record(fmt+'_'+helper,p['name'],distance(p['lat'],p['lon'],*co) if co else None,tol, v if not co else None)
invalid_fail=[]
for case in actual['invalid']:
 for helper,value in case['results'].items():
  if coord(value):invalid_fail.append(dict(input=case['s'],helper=helper,result=value))
groups={}
for group in sorted(set(r['group'] for r in rows)):
 r=[r for r in rows if r['group']==group];v=sorted(x['error_m'] for x in r if x['error_m'] is not None)
 groups[group]=dict(count=len(r),passed=sum(x['pass_'] for x in r),max=max(v) if v else None,mean=statistics.mean(v) if v else None,median=statistics.median(v) if v else None,p95=v[math.ceil(.95*len(v))-1] if v else None)
summary=dict(points=len(actual['results']),versions=dict(pyproj=pyproj.__version__,proj=pyproj.proj_version_str,mgrs=mgrs.__version__),groups=groups,failures=failures,invalid_failures=invalid_fail,mgrs_string_differences=[x for x in mgrs_strings if not x['equal']])
(HERE/('summary'+suffix+'.json')).write_text(json.dumps(summary,indent=2));(HERE/('measurements'+suffix+'.json')).write_text(json.dumps(rows,indent=2))
print(json.dumps(summary,indent=2))
