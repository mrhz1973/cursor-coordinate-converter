import json, math, pathlib, random
from boundaries import Oracle, SOURCE
import pyproj

d=pathlib.Path(__file__).resolve().parent
a=Oracle(SOURCE); b=Oracle(d/'candidate.html')
bands='CDEFGHJKLMNPQRSTUVWX'
def band(lat): return next(bands[i] for i in range(19,-1,-1) if lat >= -80+8*i)
def zone(lat,lon):
    z=next(i for i in range(60,0,-1) if lon >= -180+6*(i-1))
    if lat >= 56 and lat < 64 and lon >= 3 and lon < 12: z=32
    if lat >= 72 and lat <= 84:
        for lo,hi,j in [(0,9,31),(9,21,33),(21,33,35),(33,42,37)]:
            if lo <= lon < hi: z=j
    return z
def check(lat,lon):
    x=b.ask(dict(op='forward',lat=lat,lon=lon))
    assert 'error' not in x, (lat,lon,x)
    assert x['u']['band']==band(lat), (lat,lon,x,band(lat))
    assert x['u']['zone']==zone(lat,lon), (lat,lon,x,zone(lat,lon))
    return x
def around(x): return [math.nextafter(float(x),-math.inf),float(x),math.nextafter(float(x),math.inf)]
count={'bands':0,'zones':0,'exceptions':0,'domain':0,'interior_unchanged':0,'metric_boundary_cases':0}
for edge in range(-72,73,8):
    for lat in around(edge): check(lat,3); count['bands']+=1
for edge in range(-174,180,6):
    for lon in around(edge): check(0,lon); count['zones']+=1
for la in (56,64,72):
    for lo in (0,3,9,12,21,33,42):
        for lat in around(la):
            for lon in around(lo): check(lat,lon);count['exceptions']+=1
for lat in (-80,math.nextafter(-80,math.inf),math.nextafter(84,-math.inf),84):
    for lon in (-180,math.nextafter(-180,math.inf),math.nextafter(180,-math.inf),180):
        check(lat,lon);count['domain']+=1
r=random.Random(10720)
for _ in range(3000):
    lat=r.uniform(-79.9,83.9); lon=r.uniform(-180,180)
    x=a.ask(dict(op='forward',lat=lat,lon=lon));y=check(lat,lon)
    assert x==y,(lat,lon,x,y)
    count['interior_unchanged']+=1
def clean(s): return ''.join(s.split()).upper().lstrip('0')
for z,hem,E,N in [(32,'N',500000,4900000),(20,'S',500000,6500000),(60,'N',500000,4500000),(1,'N',500000,200000)]:
    epsg=(32600 if hem=='N' else 32700)+z
    inv=pyproj.Transformer.from_crs(epsg,4326,always_xy=True)
    fwd=pyproj.Transformer.from_crs(4326,epsg,always_xy=True)
    for prec in range(6):
        step=10**(5-prec)
        for axis in (0,1):
            for offset in (-.001,-.000001,.000001,.001):
                ee=E+(offset if axis==0 else .25*step)
                nn=N+(.25*step if axis==0 else offset)
                lon,lat=inv.transform(ee,nn)
                x=a.ask(dict(op='forward',lat=lat,lon=lon)); y=check(lat,lon)
                assert x==y,(lat,lon,x,y)
                ep,np=fwd.transform(lon,lat)
                expected=a.ask(dict(op='encodeUTM',utm=dict(zone=z,hemisphere=hem,easting=ep,northing=np),lat=lat,precision=prec))['m']
                assert clean(y['m'][prec])==clean(expected),(z,prec,axis,offset,y,expected)
                count['metric_boundary_cases']+=1
a.close();b.close()
(d/'candidate-test-results.json').write_text(json.dumps(count,indent=2)+'\n',encoding='utf8')
print(json.dumps(count,indent=2))
