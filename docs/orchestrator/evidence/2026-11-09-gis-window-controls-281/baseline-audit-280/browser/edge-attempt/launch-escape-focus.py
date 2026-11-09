from pathlib import Path
import os,subprocess,json,datetime,hashlib
root=Path(r"D:\ChatGPT\TMAR-GIS\work\gpt-audit-20261109-1a2a0a10\browser");out=root/"escape-focus";out.mkdir(exist_ok=True)
assert not (out/"execution-manifest.json").exists(),"existing focus execution; no duplicate"
runtime=root.parent/"runtime-280-70553e52.html";assert hashlib.sha256(runtime.read_bytes()).hexdigest()=="70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde"
m={"startedAtUtc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"stage":"running","purpose":"One focused UI Escape reproduction; richer read-only focus metadata","wrapperSha256":hashlib.sha256((root/"audit-escape-focus.cjs").read_bytes()).hexdigest()}
(out/"execution-manifest.json").write_text(json.dumps(m,indent=2),encoding="utf-8")
env=os.environ.copy();env["GIS_PANELS_AUDIT"]="READONLY_DIAGNOSTIC";env["GIS_AUDIT_APP"]=str(runtime);env["AUDIT_CASES"]="desktop-escape-convert-help"
p=subprocess.run(["node",str(root/"audit-escape-focus.cjs")],cwd=str(root),env=env,capture_output=True,text=True,encoding="utf-8",errors="replace")
m.update({"stage":"completed","finishedAtUtc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"nodeExitCode":p.returncode});(out/"execution-manifest.json").write_text(json.dumps(m,indent=2),encoding="utf-8")
(out/"execution-console.txt").write_text(p.stdout+p.stderr,encoding="utf-8");print(p.stdout,p.stderr)
