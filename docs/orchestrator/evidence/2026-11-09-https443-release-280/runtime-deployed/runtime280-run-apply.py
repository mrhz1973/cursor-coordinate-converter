from pathlib import Path
import subprocess,json
root=Path(r"C:\Users\Utente\Downloads\Documents\ChatGPT\TMART GIS Tool\work\gpt-resume-20261109")
code=(root/"runtime280-apply-remote.py").read_bytes()
p=subprocess.run(["ssh","-T","-o","BatchMode=yes","-o","ConnectTimeout=10","-o","StrictHostKeyChecking=yes","root@31.70.139.73","python3 -B -"],input=code,capture_output=True,timeout=240)
result={"returncode":p.returncode,"stdout":p.stdout.decode(),"stderr":p.stderr.decode()}
(root/"runtime280-apply-process.json").write_text(json.dumps(result,indent=2))
print(p.stdout.decode(),flush=True)
if p.returncode:print(p.stderr.decode()[-4000:],flush=True)
raise SystemExit(p.returncode)
