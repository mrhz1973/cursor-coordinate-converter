from pathlib import Path
import subprocess,os,json,hashlib,datetime,re,ssl,urllib.request,urllib.error,time
ROOT=Path("/var/backups/goi-gis-runtime/20261109T133117Z")
STATE=ROOT/"state.json"
s=json.loads(STATE.read_text())
REPO=Path(s["repo"]);FILE="coordinate_converter Claude.html"
TARGET=s["target_commit"]
ORIGIN="https://ionos-n8n-new.tailc01234.ts.net"
OLD_SHA="bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253"
env=os.environ.copy();env["GIT_TERMINAL_PROMPT"]="0"
def now():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(b):return hashlib.sha256(b).hexdigest()
def save(event,value=None):
 s["events"].append({"at_utc":now(),"event":event,"value":value})
 p=ROOT/".state.pending"
 with open(p,"w") as f:
  os.fchmod(f.fileno(),0o600);json.dump(s,f,indent=2);f.write("\n");f.flush();os.fsync(f.fileno())
 os.replace(p,STATE);fd=os.open(ROOT,os.O_RDONLY);os.fsync(fd);os.close(fd)
def run(args):
 p=subprocess.run(args,capture_output=True,text=True,env=env,timeout=45)
 save("command",{"argv":args,"code":p.returncode,"stdout":p.stdout,"stderr":p.stderr})
 if p.returncode:raise RuntimeError("Command failed: "+" ".join(args[:3]))
 return p.stdout.strip()
def git(*args):return run(["git","-C",str(REPO),*args])
def get(url,origin=None):
 req=urllib.request.Request(url,headers={"Origin":origin} if origin else {})
 try:r=urllib.request.urlopen(req,timeout=25,context=ssl.create_default_context())
 except urllib.error.HTTPError as e:r=e
 with r:
  b=r.read();v={"status":r.status,"bytes":len(b),"sha256":sha(b),"content_type":r.headers.get("Content-Type"),"allow_origin":r.headers.get("Access-Control-Allow-Origin")}
  if "coordinate_converter" in url or url.endswith("/gis"):
   match=re.search(rb"const APP_BUILD_NUM\s*=\s*(\d+)",b)
   v["build"]=int(match.group(1)) if match else None
  return v
def services():
 out=run(["systemctl","show","nginx","goi-ors-gateway","goi-gis-app","goi-gis-https443-proxy","--property=Id,MainPID,ActiveState"])
 d={}
 for block in out.split("\n\n"):
  v=dict(x.split("=",1) for x in block.splitlines() if "=" in x);d[v["Id"]]=v
 return d
def listeners():
 out=run(["ss","-H","-ltnp","( sport = :8989 or sport = :8089 or sport = :8099 )"])
 return sorted([{"address":x.split()[3],"pids":sorted(set(re.findall(r"pid=(\d+)",x)))} for x in out.splitlines()],key=lambda x:x["address"])
def runtime_pair(expected,expected_build):
 for index in range(12):
  try:
   http=get("http://100.99.54.93:8000/coordinate_converter%20Claude.html")
   break
  except (OSError,urllib.error.URLError):
   if index==11:raise
   time.sleep(.25)
 https=get(ORIGIN+"/gis")
 for x in (http,https):assert x["status"]==200 and x["sha256"]==expected and x["build"]==expected_build,"RUNTIME_BYTE_PROOF_FAILED"
 return {"http":http,"https":https}
assert s["status"]=="PREFLIGHT_PASS"
assert git("status","--porcelain=v1")==""
assert git("rev-parse","HEAD")==s["before_head"]
assert git("ls-remote","origin","refs/heads/main").split()[0]==TARGET
assert sha((REPO/FILE).read_bytes())==OLD_SHA
for path,want in s["config_hashes_before"].items():assert sha(Path(path).read_bytes())==want,"INFRA_CHANGED_SINCE_PREFLIGHT"
try:
 s["fast_forward_attempted"]=True;save("fast_forward_attempt",TARGET)
 git("merge","--ff-only",TARGET)
 assert git("rev-parse","HEAD")==TARGET
 assert git("status","--porcelain=v1")==""
 b=(REPO/FILE).read_bytes()
 assert len(b)==s["target_bytes"] and sha(b)==s["target_sha256"]
 assert git("rev-parse","HEAD:"+FILE)==s["target_blob"]
 s["gis_restart_attempted"]=True;save("gis_restart_attempt")
 run(["systemctl","restart","goi-gis-app"])
 s["runtime_after"]=runtime_pair(s["target_sha256"],280)
 save("runtime_byte_proof",s["runtime_after"])
 current=services();s["services_after"]=current
 for name,before in s["services_before"].items():
  assert current[name]["ActiveState"]=="active"
  if name!="goi-gis-app.service":assert current[name]["MainPID"]==before["MainPID"],"SHARED_SERVICE_PID_CHANGED:"+name
 s["shared_listeners_after"]=listeners()
 assert s["shared_listeners_after"]==s["shared_listeners_before"],"SHARED_LISTENER_CHANGED"
 s["config_hashes_after"]={path:sha(Path(path).read_bytes()) for path in s["config_hashes_before"]}
 assert s["config_hashes_after"]==s["config_hashes_before"],"INFRA_CONFIG_CHANGED"
 s["shared_http_after"]={}
 for label,url,origin in [("ors_old",ORIGIN+"/ors/status","http://100.99.54.93:8000"),("ors_new",ORIGIN+"/ors/status",ORIGIN),("catalogo",ORIGIN+"/catalogo/",None),("vps",ORIGIN+"/vps/",None)]:
  value=get(url,origin);s["shared_http_after"][label]=value
  for key in ("status","bytes","sha256","content_type","allow_origin"):
   assert value[key]==s["http_before"][label][key],"SHARED_ENDPOINT_CHANGED:"+label+":"+key
 s["final_head"]=git("rev-parse","HEAD");s["final_status"]=git("status","--porcelain=v1")
 assert s["final_head"]==TARGET and s["final_status"]==""
 s["completed_at_utc"]=now();s["status"]="DEPLOY_PASS";save("deploy_completed")
except BaseException as e:
 s["status"]="DEPLOY_FAILED";s["deploy_error"]=type(e).__name__+": "+str(e);save("deploy_failed",s["deploy_error"])
 try:
  if git("rev-parse","HEAD")==TARGET and git("status","--porcelain=v1")=="":
   save("rollback_detached_checkout_attempt",s["before_head"])
   git("switch","--detach",s["before_head"])
   run(["systemctl","restart","goi-gis-app"])
   s["rollback_runtime"]=runtime_pair(OLD_SHA,279)
   s["rollback_services"]=services()
   assert all(v["ActiveState"]=="active" for v in s["rollback_services"].values())
   assert git("status","--porcelain=v1")==""
   s["status"]="ROLLED_BACK_TO_279";save("rollback_completed")
  else:
   s["status"]="DEPLOY_FAILED_REQUIRES_REVIEW";save("rollback_refused_nonexact_or_dirty_state")
 except BaseException as rollback_error:
  s["status"]="ROLLBACK_INCOMPLETE";s["rollback_error"]=type(rollback_error).__name__+": "+str(rollback_error);save("rollback_failed",s["rollback_error"])
 raise
finally:
 print(json.dumps({"status":s["status"],"completed_at_utc":s.get("completed_at_utc"),"backup_directory":str(ROOT),"head":s.get("final_head"),"runtime":s.get("runtime_after"),"services_after":s.get("services_after"),"deploy_error":s.get("deploy_error"),"rollback_error":s.get("rollback_error")}),flush=True)
