import sys,json,math,statistics,subprocess,hashlib
from pathlib import Path
HERE=Path(__file__).parent
sys.path.insert(0,str(HERE/'deps'))
import pyproj,mgrs
from geographiclib.geodesic import Geodesic
M=mgrs.MGRS()
points=[('Rome',41.8908,12.4922),('Paris',48.8566,2.3522),('London',51.5074,-.1278),('Lisbon',38.7223,-9.1393),('Oslo',59.9139,10.7522),('Svalbard',78.2232,15.6469),('Moscow',55.7558,37.6173),('Reykjavik',64.1466,-21.9426),('Cairo',30.0444,31.2357),('Abidjan',5.259444,-4.043909),('Dakar',14.7167,-17.4677),('Nairobi',-1.2921,36.8219),('CapeTown',-33.9249,18.4241),('Antananarivo',-18.8792,47.5079),('Kinshasa',-4.4419,15.2663),('Tokyo',35.6762,139.6503),('Beijing',39.9042,116.4074),('Delhi',28.6139,77.209),('Mumbai',19.076,72.8777),('Singapore',1.3521,103.8198),('Jakarta',-6.2088,106.8456),('Dubai',25.2048,55.2708),('Ulaanbaatar',47.9184,106.9177),('Sydney',-33.8688,151.2093),('Perth',-31.9523,115.8613),('Wellington',-41.2865,174.7762),('Suva',-18.1248,178.4501),('Samoa',-13.8333,-171.75),('Honolulu',21.3099,-157.8581),('NewYork',40.7128,-74.006),('LosAngeles',34.0522,-118.2437),('MexicoCity',19.4326,-99.1332),('Vancouver',49.2827,-123.1207),('Anchorage',61.2181,-149.9003),('Nuuk',64.1835,-51.7216),('Panama',8.9824,-79.5199),('Bogota',4.711,-74.0721),('Quito',-.1807,-78.4678),('Lima',-12.0464,-77.0428),('Santiago',-33.4489,-70.6693),('BuenosAires',-34.6037,-58.3816),('SaoPaulo',-23.5505,-46.6333),('Ushuaia',-54.8019,-68.303),('McMurdo',-77.8419,166.6863),('AntarcticPeninsula',-64.8,-64.1),('SouthPole',-90,0),('NorthPole',90,0),('NullIsland',0,0),('EquatorEast',0,120),('EquatorWest',0,-90),('GreenwichSouth',-45,0),('GreenwichNorth',45,0),('AntiEast',12,179.999999),('AntiWest',-12,-179.999999),('Anti180',0,180),('AntiMinus180',0,-180),('UTMLeft',44,5.999999),('UTMRight',44,6.000001),('UTMBoundary',44,6),('UTMMin',-80,30),('UTMMax',84,30),('BeyondSouth',-80.0001,30),('BeyondNorth',84.0001,30),('NorwayLeft',60,2.999999),('NorwayRight',60,3.000001),('SvalbardWest',75,8.999999),('SvalbardEast',75,9.000001),('Svalbard21',75,21),('Svalbard33',75,33),('SouthernNearZero',-.000001,9),('NorthernNearZero',.000001,9),('SouthBandS',36,15)]
def zone(lat,lon):
 z=min(60,int((lon+180)//6)+1)
 if 56<=lat<64 and 3<=lon<12:z=32
 if 72<=lat<84:
  for lo,hi,zz in [(0,9,31),(9,21,33),(21,33,35),(33,42,37)]:
   if lo<=lon<hi:z=zz
 return z
def component(x,axis,kind):
 h=('N' if x>=0 else 'S') if axis=='lat' else ('E' if x>=0 else 'W');x=abs(x);d=int(x);m=(x-d)*60
 if kind=='DDM':return f'{d} {m:.10f} {h}'
 total=round(x*3600,8);d=int(total//3600);rem=round(total-d*3600,8);mm=int(rem//60);sec=round(rem-mm*60,8);return f'{d} {mm} {sec:.8f} {h}'
cases=[]
for name,lat,lon in points:
 p=dict(name=name,lat=lat,lon=lon,inputs={'DD':f'{lat:.10f}, {lon:.10f}','DDM':component(lat,'lat','DDM')+' '+component(lon,'lon','DDM'),'DMS':component(lat,'lat','DMS')+' '+component(lon,'lon','DMS')})
 if -80<=lat<=84:
  z=zone(lat,lon);hem='N' if lat>=0 else 'S';crs=32600+z if hem=='N' else 32700+z
  e,n=pyproj.Transformer.from_crs(4326,crs,always_xy=True).transform(lon,lat)
  p.update(zone=z,hem=hem,utm=[e,n],mgrs=M.toMGRS(lat,lon,MGRSPrecision=5))
  p['inputs']['UTM']=f'UTM {z}{hem} {e:.6f} {n:.6f}'
  p['inputs']['MGRS']=p['mgrs']
 cases.append(p)
(HERE/'cases.json').write_text(json.dumps(cases,indent=2))
subprocess.run(['node',str(HERE/'run.cjs')],check=True)
