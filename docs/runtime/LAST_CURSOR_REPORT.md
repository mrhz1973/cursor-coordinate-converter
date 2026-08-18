# LAST_CURSOR_REPORT

## LATEST

* real_task_commit: `5477a5e0d8d9a5681dbfab37b3c39e182306fc79` — LIVE GIS invariato
* branch: main
* result_cursor: INFRA2 secret **PRESENT** · GIS client HTTPS **FAIL** (ACL tcp:443) · **STOP** no build 220
* pass_operatore: n/a
* result_runtime: LIVE `5477a5e` / 219
* notes: LoadCredential only · file 600 root:root · journal leak NO · helper 0.1.3 invariato · monolite **UNTOUCHED**

## OUTPUT VERBATIM

```text
OUTDOOR-ROUTING-ORS-PROVIDER-A-INFRA2
ORS_API_KEY=PRESENT
/ors/status on-box PASS
JOURNAL_SECRET_LEAK NO
GIS client tcp:443 TcpTestSucceeded=False (ping True)
https://ubuntu.tailc01234.ts.net/ors/status timeout
BLOCKED — HTTPS client unreachable
no capability 1-10; no runtime patch; no build 220
LIVE 5477a5e build 219
```

## LIMITI

Capability e candidate 220 bloccati da ACL Tailscale `tcp:443`. Nessun valore secret in questo report.
