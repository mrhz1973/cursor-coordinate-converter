import pathlib

d = pathlib.Path(__file__).resolve().parent
source = d / 'baseline.html'
s = source.read_bytes().decode('utf8')
old_zone = '''  let zone = Math.floor((lon + 180) / 6) + 1;
  if (zone > 60) zone = 60;
  // Norway'''
new_zone = '''  let zone = Math.floor((lon + 180) / 6) + 1;
  if (zone > 60) zone = 60;
  // Addition can round a representable longitude below a boundary up to it.
  // Compare the original longitude with the exact integer boundary instead.
  if (zone > 1 && lon < -180 + 6 * (zone - 1)) zone--;
  // Norway'''
old_band = '''  if (lat >= 72) return "X";
  return LAT_BANDS[Math.floor((lat + 80) / 8)];'''
new_band = '''  if (lat >= 72) return "X";
  let index = Math.floor((lat + 80) / 8);
  // Addition may round a latitude immediately below a boundary up to it.
  if (index > 0 && lat < -80 + 8 * index) index--;
  return LAT_BANDS[index];'''
old_forward = '''function latLonToMGRS(lat, lon, precision){
  const utm = latLonToUTM(lat, lon);
  return utmToMGRS(utm, lat, precision);
}'''
new_forward = '''// Use only for MGRS derived from a geographic point, never for source UTM.
function geographicPointMGRSUTM(lat, lon){
  const utm = latLonToUTM(lat, lon);
  if (lat < 0 && utm.hemisphere === "S" && utm.northing === 10000000){
    // Southern false northing rounded up to the equator despite lat < 0.
    // Use the immediately preceding double for MGRS cell selection only.
    return { ...utm, northing: 10000000 - Math.pow(2, -29) };
  }
  return utm;
}

function latLonToMGRS(lat, lon, precision){
  const utm = geographicPointMGRSUTM(lat, lon);
  return utmToMGRS(utm, lat, precision);
}'''
old_all = '''function latLonToAllMGRS(lat, lon){
  const utm = latLonToUTM(lat, lon);'''
new_all = '''function latLonToAllMGRS(lat, lon){
  const utm = geographicPointMGRSUTM(lat, lon);'''
assert all(s.count(x)==1 for x in (old_zone,old_band,old_forward,old_all))
s=s.replace(old_zone,new_zone).replace(old_band,new_band).replace(old_forward,new_forward).replace(old_all,new_all)
(d/'candidate.html').write_bytes(s.encode('utf8'))
