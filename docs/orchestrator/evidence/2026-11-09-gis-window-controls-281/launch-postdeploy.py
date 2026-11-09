from pathlib import Path
import os, subprocess, json, hashlib, datetime, sys
assert sys.argv[1:]==["DEPLOY_VERIFIED_E8BD8C1D"],"explicit verified-deploy marker required"
root=Path(__file__).resolve().parent
runner=root/"postdeploy-panels-edge-281.cjs"
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(runner)=="5979c49ed81a8a07d17e7cfe2409c2c0705cd28166d1037e1ccf766c88dd98b0","runner hash mismatch"
assert (root.parent/"dependency-verification.json").exists(),"test packages not verified"
out=root/"postdeploy-281";out.mkdir(exist_ok=True)
assert not (out/"execution-manifest.json").exists(),"execution exists; inspect instead of duplicating"
manifest={"stage":"starting","launcherPid":os.getpid(),"runnerSha256":sha(runner),"expectedSha256":"e8bd8c1d354919064cfd09033f97fe294f366d34c12f1e92dc1d5a3bcd38ca62","expectedBytes":11108861,"build":281,"sourceMode":"live_https_document","engine":"Microsoft Edge (Chromium) on Windows","startedAtUtc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"networkPolicy":"Only native HTTPS document GET; all accessory requests blocked","existingUserProfileOpened":False}
def save():(out/"execution-manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
save()
env=os.environ.copy();env["GIS_LIVE_WINDOWS_QA"]="AUTHORIZED_AFTER_DEPLOY"
process=subprocess.Popen(["node",str(runner)],cwd=str(root),env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,encoding="utf-8",errors="replace")
manifest.update({"stage":"running","nodePid":process.pid});save()
lines=[]
for line in process.stdout:
 lines.append(line);print(line,end="",flush=True)
code=process.wait()
manifest.update({"stage":"completed","nodeExitCode":code,"finishedAtUtc":datetime.datetime.now(datetime.timezone.utc).isoformat()});save()
(out/"execution-console.txt").write_text("".join(lines),encoding="utf-8")
sys.exit(code)
