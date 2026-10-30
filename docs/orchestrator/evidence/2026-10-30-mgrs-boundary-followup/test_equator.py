import json, math, pathlib
from boundaries import Oracle, SOURCE
import mgrs

d=pathlib.Path(__file__).resolve().parent
base=Oracle(SOURCE); cand=Oracle(d/'candidate.html')
cols=['ABCDEFGH','JKLMNPQR','STUVWXYZ']
cases=[]
geo_decoder=mgrs.MGRS()
for z in (1,2,20,31,32,59,60):
    lon=-183+6*z
    for lat in (-1e-12,-1e-14,-5e-15,-1e-15,-5e-324,-0.0,0.0,5e-324,1e-15,1e-14):
        before=base.ask(dict(op='forward',lat=lat,lon=lon))
        after=cand.ask(dict(op='forward',lat=lat,lon=lon))
        # Geographic UTM remains byte-for-byte numerically identical.
        assert before['u']['easting']==after['u']['easting'] and before['u']['northing']==after['u']['northing']
        assert before['u']['hemisphere']==after['u']['hemisphere']
        is_south=lat<0
        column=cols[(z-1)%3][4]
        row=('V' if z%2 else 'E') if is_south else ('A' if z%2 else 'F')
        band='M' if is_south else 'N'
        for prec in range(6):
            expected=f'{z}{band} {column}{row}'
            if prec: expected += ' ' + '0'*prec + ' ' + ('9' if is_south else '0')*prec
            assert after['m'][prec]==expected, (z,repr(lat),prec,after,expected)
            # This checks acceptance only, not exact centre semantics.
            geo_decoder.toLatLon(after['m'][prec].replace(' ',''))
        all_=cand.ask(dict(op='all',lat=lat,lon=lon))['all']
        for prec,label in ((5,'1m'),(4,'10m'),(3,'100m'),(2,'1km'),(1,'10km')):
            assert all_[label]==after['m'][prec],(z,lat,label,all_)
        cases.append({'zone':z,'lat':repr(lat),'northing':after['u']['northing'],'mgrs':after['m']})

sources=[]
for z,hem,e,n in [(31,'S',500000,10000000),(31,'S',500000,math.nextafter(10000000,-math.inf)),(32,'S',500000,10000000),(46,'S',389603,6540383),(31,'N',500000,0)]:
    u=dict(zone=z,hemisphere=hem,easting=e,northing=n)
    before=base.ask(dict(op='source',utm=u));after=cand.ask(dict(op='source',utm=u))
    assert after.get('captured')==u,(u,after)
    assert all(x['source']==x['direct'] for x in after['m']),(u,after)
    # Explicit UTM coordinates are still passed through unchanged; no geographic
    # northing substitution occurs, including at S/10,000,000.
    assert cand.ask(dict(op='encodeUTM',utm=u,lat=after['d']['lat'],precision=5))['m']==after['m'][5]['direct']
    sources.append({'utm':u,'before':before,'after':after})

# Equal numeric coordinates alone do not attach provenance to an independent
# object. Stale source is also rejected and follows the geographic path.
u=dict(zone=46,hemisphere='S',easting=389603,northing=6540383)
derived=cand.ask(dict(op='source',utm=u)); ll=derived['d']
owned=cand.ask(dict(op='point',lat=ll['lat'],lon=ll['lon'],utm=u,precision=5))
independent=cand.ask(dict(op='point',lat=ll['lat'],lon=ll['lon'],utm=None,precision=5))
stale=dict(u);stale['easting']+=1
stale_result=cand.ask(dict(op='point',lat=ll['lat'],lon=ll['lon'],utm=stale,precision=5))
assert owned['captured']==u and independent['captured'] is None and stale_result['captured'] is None
assert owned['m']==derived['m'][5]['direct'] and independent['m']==stale_result['m']==derived['m'][5]['noSource']
assert owned['m']!=independent['m'],(owned,independent)

base.close();cand.close()
result={'geographic_points':len(cases),'geographic_precision_checks':len(cases)*6,'all_precision_checks':len(cases)*5,'source_points':len(sources),'source_precision_checks':len(sources)*6,'origin_identity_checks':3,'geographic':cases,'sources':sources,'identity':{'owned':owned,'independent':independent,'stale':stale_result}}
(d/'equator-results.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
print(json.dumps({k:v for k,v in result.items() if isinstance(v,int)},indent=2))
