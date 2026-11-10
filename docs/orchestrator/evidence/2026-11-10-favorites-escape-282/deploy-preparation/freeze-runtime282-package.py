"""Local packaging only; never opens SSH, fetches, deploys or changes the repository."""
from pathlib import Path
import argparse, hashlib, json, re, subprocess, datetime, os

SOURCE = "6b906869b77a2b3c91c8848012894ffff85399e3"
TARGET_BLOB = "4636ad186934b0d2f43e8564c9e657cdcdfc652e"
TARGET_SHA = "71267f1a9d95488adf527db40333c811c2beeef0c9051e98ee5673debb5a7399"
TARGET_BYTES = 11108980
REMOTE_TEMPLATE_SHA = "e633af45cd26fd65e0dc81dd41b81cbb462f58d40d6c5ee3f7c703a55c0be44d"
LAUNCHER_TEMPLATE_SHA = "8e8647dd81b74e001e080e6c8c9dacb8cd19d32219947a9fdf7d62799f2c063e"
GIT = r"C:\Program Files\Git\cmd\git.exe"
REPO = Path(r"C:\Users\Utente\Documents\TMAR-GIS\work\gpt-20261110\repo")

def sha(data):
    return hashlib.sha256(data).hexdigest()

def need(ok, message):
    if not ok:
        raise RuntimeError(message)

def git(*args):
    p = subprocess.run([GIT, "-C", str(REPO), *args], capture_output=True, timeout=25)
    need(p.returncode == 0, "LOCAL_GIT_READ_FAILED:" + " ".join(args))
    return p.stdout

def new_file(path, data):
    with path.open("xb") as stream:
        stream.write(data)
        stream.flush()
        os.fsync(stream.fileno())

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--target-remote-head", required=True)
    a = p.parse_args()
    need(re.fullmatch(r"[0-9a-f]{40}", a.target_remote_head) is not None, "FULL_TARGET_HEAD_REQUIRED")
    packet = Path(__file__).resolve().parent
    remote = (packet/"runtime282-remote.template.py").read_bytes()
    launcher = (packet/"runtime282-launch-windows.template.py").read_bytes()
    need(sha(remote) == REMOTE_TEMPLATE_SHA, "REMOTE_TEMPLATE_CHANGED")
    need(sha(launcher) == LAUNCHER_TEMPLATE_SHA, "LAUNCHER_TEMPLATE_CHANGED")
    git("merge-base", "--is-ancestor", SOURCE, a.target_remote_head)
    for ref in [SOURCE, a.target_remote_head]:
        need(git("rev-parse", ref+":coordinate_converter Claude.html").decode().strip() == TARGET_BLOB,
             "RUNTIME_BLOB_MISMATCH")
    paths = git("diff", "--name-only", SOURCE, a.target_remote_head).decode("utf-8").splitlines()
    need(all(x.startswith("docs/") for x in paths), "NON_DOC_CHANGE_AFTER_RUNTIME_SOURCE")
    runtime = git("show", SOURCE+":coordinate_converter Claude.html")
    need(len(runtime) == TARGET_BYTES and sha(runtime) == TARGET_SHA, "CANDIDATE_BYTES_MISMATCH")
    build = re.search(rb"const APP_BUILD_NUM\s*=\s*(\d+)", runtime)
    need(build is not None and int(build.group(1)) == 282, "CANDIDATE_BUILD_MISMATCH")
    text = launcher.decode("utf-8")
    need(text.count("__REMOTE_SCRIPT_SHA256__") == 1, "LAUNCHER_PLACEHOLDER_MISMATCH")
    launcher = text.replace("__REMOTE_SCRIPT_SHA256__", sha(remote)).encode("utf-8")
    compile(remote, "runtime282-remote.py", "exec")
    compile(launcher, "runtime282-launch-windows.py", "exec")
    folder = packet/("frozen-"+a.target_remote_head[:12])
    need(not folder.exists(), "FROZEN_PACKET_ALREADY_EXISTS_DO_NOT_OVERWRITE")
    folder.mkdir()
    entries = {
        "runtime282-remote.py": remote,
        "runtime282-launch-windows.py": launcher,
        "runtime-282.html": runtime,
    }
    for name,data in entries.items():
        new_file(folder/name, data)
    manifest = {
        "status": "FROZEN_PACKAGE_REQUIRES_SEPARATE_PARENT_GO",
        "created_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "runtime_source_commit": SOURCE, "runtime_blob": TARGET_BLOB,
        "target_remote_head": a.target_remote_head,
        "runtime_sha256": TARGET_SHA, "runtime_bytes": TARGET_BYTES, "runtime_build": 282,
        "deployment_executed": False,
        "go_is_external_and_still_required": True,
        "files": [{"path": name, "bytes": len(data), "sha256": sha(data)} for name,data in entries.items()],
        "notes": [
            "All Git operations performed by this packager are local and read-only.",
            "The launcher still requires --go-remote-head matching the explicit later parent GO.",
            "Remote origin/main must equal that GO head at preflight and apply.",
        ],
    }
    new_file(folder/"frozen-manifest.json", (json.dumps(manifest,indent=2)+"\n").encode("utf-8"))
    print(json.dumps({"folder": str(folder), "manifest": manifest}))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
