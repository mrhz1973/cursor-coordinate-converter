from pathlib import Path
import subprocess, os, json, hashlib, datetime, shutil, sys

root = Path(r"C:\Users\Utente\Downloads\Documents\ChatGPT\TMART GIS Tool\work\gpt-resume-20261109\qa-real-280")
target = root / "postdeploy"
source = root / "real-routing-280.cjs"
candidate = root.parent / "candidate-280-70553e52.html"
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(source) == "4d3c4283a24a902ad379a20864b2f0cc79a57faea04d150ea00a76092b2ce770", "runner hash mismatch"
assert sha(candidate) == "70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde", "candidate hash mismatch"
target.mkdir(exist_ok=True)
assert not (target / "results.json").exists(), "postdeploy evidence already exists; no automatic retry"
runner = target / source.name
shutil.copyfile(source, runner)
manifest = {
    "startedAtUtc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "candidateSha256": sha(candidate),
    "runnerSha256": sha(runner),
    "mode": "postdeploy_native_document_two_post_budget",
    "documentInterception": False,
}
(target / "execution-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
env = os.environ.copy()
env["GIS_REAL_QA_AUTHORIZED"] = "D2BIS_DEPLOY_PASS"
env["GIS_QA_MODE"] = "postdeploy"
env["QA_TRANSPORT"] = "direct"
process = subprocess.Popen(
    ["node", str(runner)], cwd=str(target), env=env, stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace"
)
lines = []
for line in process.stdout:
    lines.append(line)
    print(line, end="", flush=True)
rc = process.wait()
manifest.update({"finishedAtUtc": datetime.datetime.now(datetime.timezone.utc).isoformat(), "nodeExitCode": rc})
(target / "execution-manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
(target / "execution-console.txt").write_text("".join(lines), encoding="utf-8")
sys.exit(rc)
