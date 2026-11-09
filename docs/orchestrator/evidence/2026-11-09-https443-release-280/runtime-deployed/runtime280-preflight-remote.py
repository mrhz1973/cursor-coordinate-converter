from pathlib import Path
import subprocess,os,json,hashlib,datetime,re,ssl,urllib.request,urllib.error,shutil
REPO=Path("/root/local-files/handoff-runtime/cursor-coordinate-converter")
FILE="coordinate_converter Claude.html"
TARGET="c33f58c956e9630b03f9ff86eb35eccd35879a4a"
BLOB="d2ec773205da2a6d4bf954f635765eb872ec646c"
NEW_SHA="70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde"
OLD_SHA="bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253"
ORIGIN="https://ionos-n8n-new.tailc01234.ts.net"
env=os.environ.copy();env["GIT_TERMINAL_PROMPT"]="0"
def git(*args):
 p=subprocess.run(["git","-C",str(REPO),*args],capture_output=True,env=env,timeout=90)
 if p.returncode:raise RuntimeError("Git "+args[0]+" failed, code "+str(p.returncode))
 return p.stdout
def sha(b):return hashlib.sha256(b).hexdigest()
def get(url,origin=None):
 req=urllib.request.Request(url,headers={"Origin":origin} if origin else {})
 try:r=urllib.request.urlopen(req,timeout=25,context=ssl.create_default_context())
 except urllib.error.HTTPError as e:r=e
 with r:
  b=r.read();return {"status":r.status,"bytes":len(b),"sha256":sha(b),"content_type":r.headers.get("Content-Type"),"allow_origin":r.headers.get("Access-Control-Allow-Origin")}
def services():
 p=subprocess.run(["systemctl","show","nginx","goi-ors-gateway","goi-gis-app","goi-gis-https443-proxy","--property=Id,MainPID,ActiveState"],capture_output=True,text=True,check=True,timeout=15)
 d={}
 for block in p.stdout.strip().split("\n\n"):
  v=dict(x.split("=",1) for x in block.splitlines() if "=" in x);d[v["Id"]]=v
 return d
def listeners():
 p=subprocess.run(["ss","-H","-ltnp","( sport = :8989 or sport = :8089 or sport = :8099 )"],capture_output=True,text=True,check=True,timeout=10)
 return sorted([{"address":x.split()[3],"pids":sorted(set(re.findall(r"pid=(\d+)",x)))} for x in p.stdout.splitlines()],key=lambda x:x["address"])
assert git("status","--porcelain=v1")==b"","DIRTY_CLONE"
head=git("rev-parse","HEAD").decode().strip();branch=git("branch","--show-current").decode().strip()
assert branch=="main","UNEXPECTED_BRANCH"
old=(REPO/FILE).read_bytes()
assert sha(old)==OLD_SHA,"UNEXPECTED_LIVE_FILE"
remote=git("ls-remote","origin","refs/heads/main").decode().split()[0]
assert remote==TARGET,"REMOTE_CHANGED"
git("fetch","--no-tags","origin","main")
assert git("rev-parse","FETCH_HEAD").decode().strip()==TARGET
assert git("rev-parse","origin/main").decode().strip()==TARGET
git("merge-base","--is-ancestor",head,TARGET)
blob=git("rev-parse",TARGET+":"+FILE).decode().strip()
candidate=git("show",TARGET+":"+FILE)
assert blob==BLOB and len(candidate)==11108654 and sha(candidate)==NEW_SHA
assert int(re.search(rb"const APP_BUILD_NUM\s*=\s*(\d+)",candidate).group(1))==280
changed=git("diff","--name-only",head,TARGET).decode().splitlines()
assert all(x==FILE or x.startswith("docs/") for x in changed),"UNEXPECTED_CHANGED_PATH"
configs={
"/etc/nginx/sites-available/goi-ors-gateway":"b57501bb9306127c6aef551a4afd8ecc720922ccb4979d8ab5461303478f5fd5",
"/opt/goi-ors-gateway/current/goi_ors_gateway.py":"e15a23f6b098b340b4c7f290c9ea96d4e01085bc4a5d9cc843ad32e9135089d8",
"/opt/goi-gis-https443/gis_same_origin_proxy.py":"ae32a22ac5b66fc4771e3d19d5fe7f89b34ce6ccfec0e1c02dc792a4165dc06d",
"/etc/systemd/system/goi-gis-https443-proxy.service":"dcd667915070e02b61a8a0d88b90af4daf88b81c715f562aed6e0d068574b012",
"/etc/nginx/snippets/goi-gis-https443.common.conf":"35702da28f71a7ab59574784af6ed1dc430e60d80c26e4bd8f31f31284f0f5c5",
"/etc/nginx/snippets/goi-gis-https443.locations.conf":"f01bba43f03d3b90aa35da4f70cd60d9ef7b1e75b8b4084796197abf938e9ab6"}
for name,want in configs.items():assert sha(Path(name).read_bytes())==want,"INFRA_CONFIG_CHANGED"
http={}
for label,url,origin in [
("runtime_http","http://100.99.54.93:8000/coordinate_converter%20Claude.html",None),
("runtime_https",ORIGIN+"/gis",None),("ors_old",ORIGIN+"/ors/status","http://100.99.54.93:8000"),
("ors_new",ORIGIN+"/ors/status",ORIGIN),("catalogo",ORIGIN+"/catalogo/",None),("vps",ORIGIN+"/vps/",None)]:
 http[label]=get(url,origin)
 assert http[label]["status"]==200,label
for label in ("runtime_http","runtime_https"):assert http[label]["sha256"]==OLD_SHA,label
service_state=services()
assert all(v["ActiveState"]=="active" for v in service_state.values())
stamp=datetime.datetime.now(datetime.timezone.utc)
parent=Path("/var/backups/goi-gis-runtime")
if not parent.exists():parent.mkdir(mode=0o700)
assert parent.is_dir() and not parent.is_symlink() and parent.stat().st_uid==0
backup=parent/stamp.strftime("%Y%m%dT%H%M%SZ");backup.mkdir(mode=0o700)
with open(backup/"runtime-before.html","xb") as f:
 os.fchmod(f.fileno(),0o600);f.write(old);f.flush();os.fsync(f.fileno())
result={"status":"PREFLIGHT_PASS","checked_at_utc":stamp.isoformat(),"backup_directory":str(backup),"repo":str(REPO),"branch":branch,"before_head":head,"target_commit":TARGET,"target_blob":BLOB,"target_sha256":NEW_SHA,"target_bytes":len(candidate),"changed_paths":changed,"config_hashes_before":configs,"services_before":service_state,"shared_listeners_before":listeners(),"http_before":http,"events":[]}
with open(backup/"state.json","x") as f:
 os.fchmod(f.fileno(),0o600);json.dump(result,f,indent=2);f.write("\n");f.flush();os.fsync(f.fileno())
print(json.dumps(result),flush=True)
