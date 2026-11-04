#!/usr/bin/env bash
set -euo pipefail

target_commit="${1:-}"
helper_sha="${2:-}"
[[ "$target_commit" =~ ^[0-9a-f]{40}$ ]]
[[ "$helper_sha" =~ ^[0-9a-f]{64}$ ]]

repo=/root/local-files/handoff-runtime/cursor-coordinate-converter
runtime='coordinate_converter Claude.html'
helper=diagnostica-viewport-273.html
expected_before=450c83188956401ce098747879195ac3b20932f4
runtime_sha=4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a
expected_origin=https://github.com/mrhz1973/cursor-coordinate-converter.git
url=http://100.99.54.93:8000/diagnostica-viewport-273.html
other_units=(goi-nav-proxy goi-graphhopper goi-ors-gateway)

cd "$repo"
[[ "$(git branch --show-current)" == main ]]
[[ "$(git rev-parse HEAD)" == "$expected_before" ]]
[[ "$(git remote get-url origin)" == "$expected_origin" ]]
[[ -z "$(git status --porcelain=v1 --untracked-files=normal)" ]]
[[ "$(sha256sum -- "$runtime" | cut -d ' ' -f 1)" == "$runtime_sha" ]]
systemctl is-active --quiet goi-gis-app

snapshot_services(){
  local unit
  for unit in "${other_units[@]}"; do
    printf '%s ' "$unit"
    systemctl show "$unit" --property=ActiveState,SubState,MainPID --value | tr '\n' ' '
    printf '\n'
  done
  docker inspect --format 'n8n {{.State.Pid}} {{.State.Status}}' root-n8n-1
}
services_before=$(snapshot_services)

git fetch --no-tags origin main
[[ "$(git rev-parse FETCH_HEAD)" == "$target_commit" ]]
[[ "$(git ls-remote --exit-code origin refs/heads/main | cut -f1)" == "$target_commit" ]]
git merge-base --is-ancestor "$expected_before" "$target_commit"
[[ "$(git show "$target_commit:$runtime" | sha256sum | cut -d ' ' -f 1)" == "$runtime_sha" ]]
[[ "$(git show "$target_commit:$helper" | sha256sum | cut -d ' ' -f 1)" == "$helper_sha" ]]
changed_files=$(git diff --name-only "$expected_before" "$target_commit")
while IFS= read -r changed; do
  case "$changed" in docs/*|diagnostica-viewport-273.html) ;; *) printf 'Unexpected changed path: %s\n' "$changed" >&2; exit 1 ;; esac
done <<< "$changed_files"

git merge --ff-only "$target_commit"
[[ "$(git rev-parse HEAD)" == "$target_commit" ]]
[[ -z "$(git status --porcelain=v1 --untracked-files=normal)" ]]
[[ "$(sha256sum -- "$runtime" | cut -d ' ' -f 1)" == "$runtime_sha" ]]
[[ "$(sha256sum -- "$helper" | cut -d ' ' -f 1)" == "$helper_sha" ]]
systemctl is-active --quiet goi-gis-app
[[ "$(curl -fsS --connect-timeout 3 --max-time 15 "$url" | sha256sum | cut -d ' ' -f 1)" == "$helper_sha" ]]
[[ "$(snapshot_services)" == "$services_before" ]]
printf 'DIAGNOSTIC_DEPLOY=PASS\nCOMMIT=%s\nRUNTIME_SHA=%s\nHELPER_SHA=%s\nOTHER_SERVICES=UNCHANGED\n' "$target_commit" "$runtime_sha" "$helper_sha"
