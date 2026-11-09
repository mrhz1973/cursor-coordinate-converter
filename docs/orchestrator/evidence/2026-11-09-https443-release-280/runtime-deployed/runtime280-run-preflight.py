from pathlib import Path
import subprocess,json
root=Path(r"C:\Users\Utente\Downloads\Documents\ChatGPT\TMART GIS Tool\work\gpt-resume-20261109")
p=subprocess.run(["ssh","-T","-o","BatchMode=yes","-o","ConnectTimeout=10","-o","StrictHostKeyChecking=yes","root@31.70.139.73","python3 -B -"],input=(root/"runtime280-preflight-remote.py").read_bytes(),capture_output=True,timeout=180)
if p.returncode:
 print(json.dumps({"status":"PREFLIGHT_FAILED","code":p.returncode,"stderr":p.stderr.decode()[-3000:]}),flush=True)
 raise SystemExit(p.returncode)
r=json.loads(p.stdout)
(root/"runtime280-preflight.json").write_text(json.dumps(r,indent=2))
print(json.dumps({k:v for k,v in r.items() if k not in ("changed_paths","http_before","config_hashes_before")},indent=2),flush=True)
print(json.dumps({"changed_paths_count":len(r["changed_paths"]),"live_http_sha":r["http_before"]["runtime_http"]["sha256"],"live_https_sha":r["http_before"]["runtime_https"]["sha256"]}),flush=True)
