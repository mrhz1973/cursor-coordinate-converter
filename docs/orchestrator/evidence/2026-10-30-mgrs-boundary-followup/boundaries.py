import decimal, json, math, pathlib, subprocess, sys

BASE = pathlib.Path(__file__).resolve().parent
WORK = BASE.parent
sys.path.insert(0, str(WORK / 'mgrs-boundary-fix' / 'deps'))
import pyproj, mgrs

SOURCE = BASE / 'baseline.html'
EXPERIMENT = WORK / 'mgrs-boundary-fix' / 'experiment_inward_0p1um.html'
decimal.getcontext().prec = 70
D = decimal.Decimal
PI = D('3.141592653589793238462643383279502884197169399375105820974944592307816')

def sincos(x):
    s = st = x
    c = ct = D(1)
    for n in range(1, 100):
        st *= -x*x / D((2*n)*(2*n+1))
        ct *= -x*x / D((2*n-1)*(2*n))
        s += st; c += ct
        if abs(st) < D('1e-68') and abs(ct) < D('1e-68'): break
    return s, c

def meridian_72():
    # WGS84 exact decimal defining parameters; integrate meridional radius by
    # binomial series, using recurrence for integral sin^(2n)(phi) dphi.
    a = D(6378137); f = D(1)/D('298.257223563'); e2 = f*(2-f)
    phi = PI*D(72)/D(180); sn, cs = sincos(phi)
    integ = phi; total = phi; coef = D(1); powe = D(1)
    for n in range(1, 55):
        integ = D(2*n-1)/D(2*n)*integ - sn**(2*n-1)*cs/D(2*n)
        coef *= D(2*n+1)/D(2*n); powe *= e2
        total += coef*powe*integ
    return D('0.9996')*a*(1-e2)*total

class Oracle:
    def __init__(self, path):
        self.p = subprocess.Popen(['node', str(BASE/'oracle.js'), str(path)],stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True,encoding='utf8')
    def ask(self, x):
        self.p.stdin.write(json.dumps(x)+'\n'); self.p.stdin.flush(); return json.loads(self.p.stdout.readline())
    def close(self): self.p.stdin.close(); self.p.wait()

def safe(f):
    try: return f()
    except Exception as e: return f'{type(e).__name__}: {e}'

def main():
    m = mgrs.MGRS(); o = Oracle(SOURCE); cand = Oracle(EXPERIMENT)
    t = pyproj.Transformer.from_crs(32631,4326,always_xy=True)
    tf = pyproj.Transformer.from_crs(4326,32631,always_xy=True)
    threshold = meridian_72(); proj72 = tf.transform(3,72)[1]
    nearest = float(threshold)
    values = sorted(set([math.nextafter(nearest,-math.inf), nearest, math.nextafter(nearest,math.inf), proj72] + [float(threshold)+d for d in [-.001,-.000001,.000001,.001]]))
    results=[]
    for north in values:
        delta = D.from_float(north)-threshold
        a = o.ask(dict(op='inverse',zone=31,hem='N',easting=500000,northing=north))
        lon,lat = t.transform(500000,north)
        results.append(dict(northing=repr(north),hex=north.hex(),delta_m=str(delta),expected_side='X' if delta >= 0 else 'W', app_lat=repr(a['d']['lat']),app_band=a['forward']['band'],proj_lat=repr(lat),geotrans=safe(lambda: m.UTMToMGRS(31,'N',500000,north,MGRSPrecision=5))))
    refs=['32MNF0000000000','60TYK5609932069','01TBE4390032069','01NAA6602100000','31UGP2377520655','32UKU7622420655','32PNP0000084297']
    rr=[]
    for ref in refs:
        a=cand.ask(dict(op='roundtrip',mgrs=ref)); c=o.ask(dict(op='canonical',mgrs=ref)); d=a['d']; p=a['p']
        rr.append(dict(original=ref,canonical=c,representative={'lat':d['lat'],'lon':d['lon']},reencoded=a['m'],projected=a['u'],geotrans_inverse=safe(lambda: m.toLatLon(ref)),geotrans_reencoded=safe(lambda: m.toMGRS(d['lat'],d['lon'],MGRSPrecision=p['precision']))))
    bands='CDEFGHJKLMNPQRSTUVWX'; geo=[]
    for boundary in range(-72,73,8):
        for lat in (math.nextafter(float(boundary),-math.inf),float(boundary),math.nextafter(float(boundary),math.inf)):
            expected = next(bands[i] for i in range(19,-1,-1) if lat >= -80 + 8*i)
            answer=o.ask(dict(op='forward',lat=lat,lon=3))
            gt=safe(lambda: m.toMGRS(lat,3,MGRSPrecision=5))
            geo.append(dict(boundary=boundary,lat=repr(lat),hex=lat.hex(),expected=expected,app=answer['u']['band'],geotrans=gt))
    zones=[]
    for boundary in range(-174,180,6):
        for lon in (math.nextafter(float(boundary),-math.inf),float(boundary),math.nextafter(float(boundary),math.inf)):
            expected = next(i for i in range(60,0,-1) if lon >= -180 + 6*(i-1))
            answer=o.ask(dict(op='forward',lat=0,lon=lon))
            zones.append(dict(boundary=boundary,lon=repr(lon),hex=lon.hex(),expected=expected,app=answer['u']['zone'],geotrans=safe(lambda: m.toMGRS(0,lon,MGRSPrecision=5))))
    output={'versions':{'pyproj':pyproj.__version__,'proj':pyproj.proj_version_str,'mgrs':mgrs.__version__},'true_72_northing_decimal':str(threshold),'proj_72_northing':repr(proj72),'app_vs_proj':results,'geographic_band_all_cases':geo,'geographic_band_mismatches':[x for x in geo if x['expected'] != x['app']],'geographic_zone_all_cases':zones,'geographic_zone_mismatches':[x for x in zones if x['expected'] != x['app']],'seven':rr}
    (BASE/'results.json').write_text(json.dumps(output,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
    o.close(); cand.close(); print(json.dumps(output,indent=2,ensure_ascii=False))

if __name__=='__main__': main()
