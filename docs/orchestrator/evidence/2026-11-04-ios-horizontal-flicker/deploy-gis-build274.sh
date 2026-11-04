#!/usr/bin/env bash
set -euo pipefail

target_commit="${1:-}"
target_sha="${2:-}"
[[ "$target_commit" =~ ^[0-9a-f]{40}$ ]]
[[ "$target_sha" =~ ^[0-9a-f]{64}$ ]]

repo=/root/local-files/handoff-runtime/cursor-coordinate-converter
runtime='coordinate_converter Claude.html'
expected_origin='https://github.com/mrhz1973/cursor-coordinate-converter.git'
expected_before=1659f4d60fe415e4b83493dc16ebc14a4fe59596
expected_before_sha=4d608550a63261c0d7b6d5088c6bd6d1c62c3fe521253341ccad19f99f1d996a
url='http://100.99.54.93:8000/coordinate_converter%20Claude.html'
other_units=(goi-nav-proxy goi-graphhopper goi-ors-gateway)
n8n_container=root-n8n-1

repo_is_clean(){
  local status
  if ! status=$(git status --porcelain=v1 --untracked-files=normal); then return 1; fi
  [[ -z "$status" ]]
}
cd "$repo"
[[ "$(git remote get-url origin)" == "$expected_origin" ]]
[[ "$(git branch --show-current)" == main ]]
before_head=$(git rev-parse HEAD)
[[ "$before_head" == "$expected_before" ]]
repo_is_clean
before_sha=$(sha256sum -- "$runtime" | cut -d ' ' -f 1)
[[ "$before_sha" == "$expected_before_sha" ]]
systemctl is-active --quiet goi-gis-app

capture_other_services(){
  local unit active substate pid
  for unit in "${other_units[@]}"; do
    active=$(systemctl show "$unit" --property=ActiveState --value)
    substate=$(systemctl show "$unit" --property=SubState --value)
    pid=$(systemctl show "$unit" --property=MainPID --value)
    [[ "$active" == active && "$substate" == running && "$pid" =~ ^[1-9][0-9]*$ ]]
    printf '%s\t%s\t%s\t%s\n' "$unit" "$active" "$substate" "$pid"
  done
}
capture_n8n(){
  local value
  value=$(docker inspect --format '{{.State.Pid}} {{.State.Status}}' "$n8n_container")
  [[ "$value" =~ ^[1-9][0-9]*\ running$ ]]
  printf '%s\n' "$value"
}
fetch_http(){
  local tag="$1" output="$2" attempt
  for attempt in 1 2 3 4 5; do
    if curl -fsS --connect-timeout 3 --max-time 8 "$url?v=$tag" -o "$output"; then
      return 0
    fi
    sleep 1
  done
  return 1
}

umask 077
backup=$(mktemp -d /tmp/goi-gis-mobile-layer-274.XXXXXX)
cp -- "$runtime" "$backup/runtime-before.html"
printf '%s\n' "$before_head" > "$backup/commit-before.txt"
printf '%s\n' main > "$backup/branch-before.txt"
printf '%s\n' "$before_sha" > "$backup/runtime-sha-before.txt"
capture_other_services > "$backup/other-services-before.txt"
capture_n8n > "$backup/n8n-pid-before.txt"

merge_started=0
rollback(){
  result=${1:-$?}
  trap - ERR
  trap '' HUP INT TERM
  set +e
  rollback_state=NOT_NEEDED
  if [[ "$merge_started" == 1 ]]; then
    rollback_state=FAIL
    current_branch=$(git branch --show-current 2>/dev/null)
    current_head=$(git rev-parse HEAD 2>/dev/null)
    status_ok=0
    if current_dirty=$(git status --porcelain=v1 --untracked-files=normal 2>/dev/null); then status_ok=1; else current_dirty=STATUS_COMMAND_FAILED; fi
    if [[ "$current_branch" == main && "$current_head" == "$before_head" && "$status_ok" == 1 && -z "$current_dirty" ]]; then
      rollback_state=NOT_NEEDED
    elif [[ "$current_branch" == main && "$current_head" == "$target_commit" && "$status_ok" == 1 && -z "$current_dirty" ]]; then
      if git reset --hard "$before_head" > "$backup/rollback-git.log" 2>&1 \
        && [[ "$(git branch --show-current)" == main ]] \
        && [[ "$(git rev-parse HEAD)" == "$before_head" ]] \
        && [[ "$(sha256sum -- "$runtime" | cut -d ' ' -f 1)" == "$expected_before_sha" ]] \
        && systemctl is-active --quiet goi-gis-app \
        && fetch_http "rollback-$(date -u +%s)" "$backup/runtime-http-rollback.html" \
        && [[ "$(sha256sum "$backup/runtime-http-rollback.html" | cut -d ' ' -f 1)" == "$expected_before_sha" ]] \
        && capture_other_services > "$backup/other-services-rollback.txt" \
        && cmp -s "$backup/other-services-before.txt" "$backup/other-services-rollback.txt" \
        && capture_n8n > "$backup/n8n-pid-rollback.txt" \
        && cmp -s "$backup/n8n-pid-before.txt" "$backup/n8n-pid-rollback.txt"; then
        rollback_state=PASS
      fi
    else
      rollback_state=STOP_GUARD
      printf 'ROLLBACK_GUARD branch=%s head=%s dirty=%s\n' "$current_branch" "$current_head" "$([[ -n "$current_dirty" ]] && printf yes || printf no)" >&2
    fi
  fi
  printf 'DEPLOY=FAIL\nROLLBACK=%s\nBACKUP=%s\n' "$rollback_state" "$backup" >&2
  exit "$result"
}
trap 'rollback $?' ERR
trap 'rollback 129' HUP
trap 'rollback 130' INT
trap 'rollback 143' TERM

# Resolve and validate the exact GitHub main tip before touching the working tree.
git fetch --no-tags origin main
[[ "$(git rev-parse FETCH_HEAD)" == "$target_commit" ]]
[[ "$(git ls-remote --exit-code origin refs/heads/main | cut -f1)" == "$target_commit" ]]
git merge-base --is-ancestor "$before_head" "$target_commit"
blob_sha=$(git show "$target_commit:$runtime" | sha256sum | cut -d ' ' -f 1)
[[ "$blob_sha" == "$target_sha" ]]
# Recheck the remote tip immediately before the fast-forward.
git fetch --no-tags origin main
[[ "$(git rev-parse FETCH_HEAD)" == "$target_commit" ]]
[[ "$(git ls-remote --exit-code origin refs/heads/main | cut -f1)" == "$target_commit" ]]
merge_started=1
git merge --ff-only "$target_commit"
[[ "$(git branch --show-current)" == main ]]
[[ "$(git rev-parse HEAD)" == "$target_commit" ]]
repo_is_clean
[[ "$(sha256sum -- "$runtime" | cut -d ' ' -f 1)" == "$target_sha" ]]
systemctl is-active --quiet goi-gis-app
fetch_http 274 "$backup/runtime-http-after.html"
http_sha=$(sha256sum "$backup/runtime-http-after.html" | cut -d ' ' -f 1)
[[ "$http_sha" == "$target_sha" ]]
capture_other_services > "$backup/other-services-after.txt"
cmp -s "$backup/other-services-before.txt" "$backup/other-services-after.txt"
capture_n8n > "$backup/n8n-pid-after.txt"
cmp -s "$backup/n8n-pid-before.txt" "$backup/n8n-pid-after.txt"
gis_status=$(systemctl show goi-gis-app --property=ActiveState,SubState,MainPID --no-pager)
trap - ERR HUP INT TERM
printf 'DEPLOY=PASS\nCOMMIT=%s\nRUNTIME_SHA=%s\nHTTP_SHA=%s\nBACKUP=%s\nOTHER_SERVICES=UNCHANGED\n' "$target_commit" "$target_sha" "$http_sha" "$backup"
printf '%s\n' "$gis_status"
