from pathlib import Path
p = Path("coordinate_converter Claude.html")
t = p.read_text(encoding="utf-8")
print("size", p.stat().st_size)
print("igm", t.find("cartoIgmEmbeddedData"))
print("iim", t.find("cartoIimEmbeddedData"))
print("8204 attr", 'data-feature-count="8204"' in t)
a = t.find('<script type="application/json" id="cartoIgmEmbeddedData"')
b = t.find("</script>", a) if a >= 0 else -1
print("igm script span", None if a < 0 or b < 0 else b - a)
print("build id", "CARTO-IIM-UKHO-PROVIDERS-A" in t, "FIX6" in t)
print("BUILD_NUM 229", "const APP_BUILD_NUM = 229" in t)
