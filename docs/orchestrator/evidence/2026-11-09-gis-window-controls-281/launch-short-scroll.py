from pathlib import Path
import os, subprocess, json, hashlib, datetime, sys
root=Path(__file__).resolve().parent
build=int(sys.argv[1])
assert build==281
identities={280:("runtime-280-70553e52.html","70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde"),281:("runtime-281-e8bd8c1d.html","e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62")}
filename,expected=identities[build]
runtime=root.parent.parent/filename
runner=root/"short-scroll-astro-281.cjs"
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(runner)=="b217175041d52ba112404fe5f58d7ec408f3f803ee33722da8621b94810663a7", "runner hash mismatch"
assert sha(runtime)==expected, "runtime hash mismatch"
assert (root.parent/"dependency-verification.json").exists(),"dependencies not verified"
out=root/"short-scroll-281"
out.mkdir(exist_ok=True)
assert not (out/"execution-manifest.json").exists(),"execution exists; inspect instead of duplicating"
manifest={"stage":"starting","launcherPid":os.getpid(),"runnerSha256":sha(runner),"candidateSha256":sha(runtime),"candidateBytes":runtime.stat().st_size,"build":build,"sourceMode":"candidate_injected","engine":"Microsoft Edge (Chromium) on Windows","startedAtUtc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"networkAllowed":False,"existingUserProfileOpened":False}
def save(): (out/"execution-manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
save()
env=os.environ.copy()
env["GIS_PANELS_AUDIT"]="READONLY_DIAGNOSTIC"
env["GIS_AUDIT_APP"]=str(runtime)
env["GIS_AUDIT_BUILD"]=str(build)
if build==280: env["AUDIT_CASES"]="desktop-native-child-cancel,desktop-astro-reference"
else: env.pop("AUDIT_CASES",None)
process=subprocess.Popen(["node",str(runner)],cwd=str(root),env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,encoding="utf-8",errors="replace")
manifest.update({"stage":"running","nodePid":process.pid});save()
lines=[]
for line in process.stdout:
 lines.append(line)
 print(line,end="",flush=True)
code=process.wait()
manifest.update({"stage":"completed","nodeExitCode":code,"finishedAtUtc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"runtimeAfterSha256":sha(runtime)});save()
(out/"execution-console.txt").write_text("".join(lines),encoding="utf-8")
sys.exit(code)
