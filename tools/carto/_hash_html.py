from pathlib import Path
import hashlib, subprocess
p = Path("coordinate_converter Claude.html")
raw = p.read_bytes()
lf = raw.replace(b"\r\n", b"\n")
print("bytes_disk", len(raw))
print("bytes_lf", len(lf))
print("sha256_lf", hashlib.sha256(lf).hexdigest())
h = subprocess.check_output(["git", "hash-object", str(p)], text=True).strip()
print("git_blob", h)
print("head", subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip())
