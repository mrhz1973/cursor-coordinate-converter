from pathlib import Path
import os, subprocess, json, hashlib, datetime, sys

root = Path(__file__).resolve().parent
runner = root / "audit-panels-edge-280.cjs"
runtime = root.parent / "runtime-280-70553e52.html"
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(runner) == "bfe8d103d9e699d8cc7cb652ee5f7bb0a5ea014f79334e21febae67b38e5b201", "runner hash mismatch"
assert sha(runtime) == "70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde", "runtime hash mismatch"
assert (root / "dependency-verification.json").exists(), "dependencies not verified"
assert not (root / "execution-manifest.json").exists(), "existing execution; inspect instead of launching again"
manifest = {"stage": "starting", "launcherPid": os.getpid(),
            "runnerSha256": sha(runner), "candidateSha256": sha(runtime), "candidateBytes": runtime.stat().st_size,
            "sourceMode": "candidate_injected", "engine": "Microsoft Edge (Chromium) on Windows",
            "startedAtUtc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "networkAllowed": False, "existingUserProfileOpened": False}
(root / "execution-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
env = os.environ.copy()
env["GIS_PANELS_AUDIT"] = "READONLY_DIAGNOSTIC"
env["GIS_AUDIT_APP"] = str(runtime)
env.pop("AUDIT_CASES", None)
process = subprocess.Popen(["node", str(runner)], cwd=str(root), env=env, stdout=subprocess.PIPE,
                           stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace")
manifest.update({"stage": "running", "nodePid": process.pid})
(root / "execution-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
lines = []
for line in process.stdout:
    lines.append(line)
    print(line, end="", flush=True)
code = process.wait()
manifest.update({"stage": "completed", "nodeExitCode": code,
                 "finishedAtUtc": datetime.datetime.now(datetime.timezone.utc).isoformat()})
(root / "execution-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
(root / "execution-console.txt").write_text("".join(lines), encoding="utf-8")
sys.exit(code)
