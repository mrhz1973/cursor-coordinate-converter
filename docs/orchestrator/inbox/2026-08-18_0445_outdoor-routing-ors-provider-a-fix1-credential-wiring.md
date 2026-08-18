# OUTDOOR-ROUTING-ORS-PROVIDER-A — REVIEW-FIX1-INFRA-CREDENTIAL-WIRING

**BLOCK-ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**PASS:** `REVIEW-FIX1-INFRA-CREDENTIAL-WIRING`  
**Categoria:** DELICATO  
**Gate:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**Deploy GIS / ABQA / QA / finito / build bump / monolite:** **NON ESEGUITI**

## Candidate

| Campo | Valore |
| --- | --- |
| FULL SHA candidate (bundle FIX) | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` |
| Parent | `2bb1a5c61bd5a7928862041d16969c6a97beebde` |
| Runtime HTML origin | `268787379f18f52bf2f6285d3e852f9770f260ed` (build 220, immutabile) |
| `APP_BUILD_NUM` | **220** (invariato) |
| `APP_BUILD_ID` | `OUTDOOR-ROUTING-ORS-PROVIDER-A` (invariato) |
| Blob git monolite | `23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1` (**identico** a review 220) |
| LIVE | `5477a5e0d8d9a5681dbfab37b3c39e182306fc79` · build **219** |

```text
git ls-tree cfee0e4c1db5b6e55b07f4eda50ce085d261f54a -- "coordinate_converter Claude.html"
100644 blob 23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1	coordinate_converter Claude.html
```

## Diff infra (no HTML)

```text
 docs/INFRA_VPS.md                                  | 10 ++-
 infra/ors-gateway/README.md                        | 65 ++++++++++-----
 infra/ors-gateway/deploy_vps.py                    | 93 +++++++++++++++++-----
 infra/ors-gateway/goi-ors-gateway.service          |  7 +-
 infra/ors-gateway/goi-ors-gateway.service.d/credential.conf | 6 ++
 infra/ors-gateway/install_secret.py                | 56 ++++++++++++-
 infra/ors-gateway/tests/test_deploy_vps.py         | 50 ++++++++++++
 infra/ors-gateway/tests/test_install_secret.py     | 56 +++++++++++++
 infra/ors-gateway/verify_vps.py                    |  2 +-
 9 files changed, 296 insertions(+), 49 deletions(-)
```

## Credential wiring canonico

Source: `infra/ors-gateway/goi-ors-gateway.service.d/credential.conf`

```
[Service]
LoadCredential=ORS_API_KEY:/etc/systemd/ors-credentials/ORS_API_KEY
```

- File secret: **0600 root:root** `/etc/systemd/ors-credentials/ORS_API_KEY` — **mai** nel repo
- Processo `goi-ors` **non** apre quel path; systemd copia in `$CREDENTIALS_DIRECTORY`
- Drop-in **installato solo se** il file secret esiste e non è vuoto
- File assente → drop-in **omesso** → unit start + POST **503** fail-closed

`install_secret.py` dopo write: drop-in → `daemon-reload` → restart → verifica `PRESENT` + `active`. Fail-closed `phase=…`. Nessun hash/print del valore.

`deploy_vps.py`:
- **ABSENT:** drop-in omitted, status ABSENT, POST 503 `secret_not_configured`
- **PRESENT:** drop-in installed, status PRESENT, **skip 503**, **no** upstream ORS probe

## Verifica VPS (key invariata)

| Check | Esito |
| --- | --- |
| `SECRET_STATE` | PRESENT |
| `SECRET_MODE` | 600 root:root |
| `DROPIN` | INSTALLED · `LoadCredential=ORS_API_KEY:…` |
| service | **active** |
| `/ors/status` | ready / **PRESENT** |
| TCP client `:443` + HTTPS | **PASS** HTTP 200 |
| Journal leak | **NO** |
| Min capability `foot-hiking` POST | **PASS** HTTP 200 · 155 coords · no secret in body |
| Matrice 1–10 | **non rieseguita** |
| nginx / GIS / nav / GH / D-Flight PID | **invariati** (solo ORS restart) |
| Helper | **0.1.3** |

Regression: non generic proxy (root 404, driving-car 404, GET directions 403); bind `:443` Tailscale-only; whitelist path/profile invariata.

## Tests locali

`python -m unittest discover -s infra/ors-gateway/tests -v` → **14/14 OK**

## FRONTIER target

BLOCK = `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
STATE/GATE = **REVIEW GPT-SOSTITUTIVA — PENDING**  
LIVE = build **219**  
CANDIDATE = `cfee0e4` / build **220**  
NEXT = review candidate 220
