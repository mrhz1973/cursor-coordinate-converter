from pathlib import Path
import json, re
p = Path("coordinate_converter Claude.html")
t = p.read_text(encoding="utf-8")
print("size", p.stat().st_size, "lines", t.count("\n")+1)
print("build", "CARTO-IIM-UKHO-PROVIDERS-A" in t, "num229", "const APP_BUILD_NUM = 229" in t)
print("FIX6 leftover", "OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6" in t)
print("end marker", "runSelfCheck" in t, t[-80:].replace("\n","\\n")[:80])
for eid in ("cartoIgmEmbeddedData", "cartoIimEmbeddedData", "cartoUkhoEmbeddedData"):
    m = re.search(rf'<script type="application/json" id="{eid}"[^>]*>([\s\S]*?)</script>', t)
    if not m:
        print(eid, "MISSING")
        continue
    obj = json.loads(m.group(1))
    print(eid, obj.get("schema"), obj.get("feature_count"), len(obj.get("records") or []))
print("expand", "catalog_status" in t)
print("paper filter", "cartoIimFilterPaper" in t)
print("refresh stub", "cartoTryProviderRefresh" in t)
print("iim keys", '"carto.seriesIim"' in t)
