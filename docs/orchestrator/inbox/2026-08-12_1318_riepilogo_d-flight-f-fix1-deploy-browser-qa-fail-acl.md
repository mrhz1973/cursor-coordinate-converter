# D-FLIGHT-F-FIX1 — POST-REVIEW DEPLOY + CORS + Automated Browser QA

**Data:** 2026-08-12  
**Gate upstream:** `D-FLIGHT-F-FIX1 REVIEW GPT-SOSTITUTIVA PASS — GO DEPLOY`  
**FULL SHA approvato / deployato:** `ddce4345ace35056217e0846067e3dd7447961a6`  
**Target:** `APP_BUILD_ID=D-FLIGHT-F-FIX1` · `APP_BUILD_NUM=162` · `helper_version=0.1.2`

## Esito sintetico

| Fase | Esito |
|------|-------|
| Pre-flight locale | PASS — HEAD = origin/main = ls-remote = `ddce434…`, tree pulito |
| A Helper snapshot | PASS |
| B Deploy helper 0.1.2 | PASS |
| C CORS config | PASS — `origin_allowlist = ["http://100.114.7.53:8000"]`, `config_ok` |
| D Restart + LKG | PASS — LKG invariato, no `refresh_*` da restart |
| E CORS technical smoke | PASS (da VPS curl) |
| F Deploy GIS | PASS — byte/SHA match, HTTP 200, build 162 |
| G Automated Browser QA | **FAIL** — helper `:8010` non raggiungibile dal client Tailscale |
| H Gate PASS browser | **NON raggiunto** |
| QA operatore | **non attestata / non inferita** |
| `finito` | **NON eseguito** (Regola H) |

## Helper pre → post

| Campo | Pre | Post |
|-------|-----|------|
| helper_version | 0.1.1 | **0.1.2** |
| service | active/enabled | active/enabled |
| bind | `100.114.7.53:8010` | invariato |
| status | READY | READY |
| canonical_sha256 | `88d564a65152a795fb2ea2cff8d11dc7b5fd013992cfdc7160b722a37f0d67f7` | **invariato** |
| feature_count | 849 | **invariato** |
| fetched_at / last_change_at | `2026-08-11T21:40:52Z` | **invariato** |
| current.json | presente (~7360227 B) | preservato |
| previous.* | assente | non alterato |
| origin_allowlist | `[]` | `["http://100.114.7.53:8000"]` |

Deploy helper: `/opt/goi-dflight-helper/current/goi_dflight_helper.py` da SHA approvato; backup `*.bak-20260812_110905`; `REVISION=ddce4345…`. Nessun contatto D-Flight in Fase B–D. Nessuna credenziale stampata.

## CORS smoke (VPS, Origin `http://100.114.7.53:8000`)

1. OPTIONS `/status` → **204**, ACAO exact-match, no wildcard, no `Allow-Credentials`
2. GET `/status` → **200**, ACAO, helper_version **0.1.2**, LKG ok
3. GET `/dataset` → **200**, ACAO, `Access-Control-Expose-Headers` espone i tre `X-GOI-DFlight-*` valorizzati; count 849
4. Origin non autorizzata → **403**, nessun ACAO/expose permissivo

## GIS smoke

- `goi-gis-app.service` active/enabled
- HTTP **200**, Content-Length **9947406**
- Byte/SHA256 LF live = git blob SHA: `2877ebd6ad4979cfb0741afe417d3555b5615bfd6ec1d2905569c0b105a7db1f`
- Title/footer: **D-FLIGHT-F-FIX1 · build 162**
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ddce4345`

## Automated Browser QA — FAIL root cause

**Sintomo:** click **Carica zone** → `TypeError: Failed to fetch` su `http://100.114.7.53:8010/dataset`; pannello «Helper non raggiungibile»; dataset non applicato.

**Prove:**

- Client Windows Tailscale: `Test-NetConnection :8000` = **True**; `:8010` = **False** (timeout)
- Curl locale `:8000` = 200; `:8010` = timeout
- Curl **on-box** VPS verso `100.114.7.53:8010` = 200 (LKG/CORS ok)
- `tcpdump -ni tailscale0 'tcp port 8010'` durante connect client → **0 packets** (drop pre-host)
- Host firewall: UFW inactive; `ts-input` accetta `iifname tailscale0`
- Precedente noto: ACL grant storica solo `tcp:8000` (+ `tcp:5000`) verso `100.114.7.53` (inbox 2026-06-13) — **manca `tcp:8010`**

**Casi QA eseguiti parzialmente:**

1. Boot: build FIX1/162 OK; zero `:8010` prima del click; zero `d-flight.it` — OK fino a CTA
2. Carica zone: **FAIL** reachability (non si arriva a header/overlay)
3–6 OPSEC / offline / Rivaluta / regressioni: **non eseguiti** (blocco su #2)
7. Refresh live: **non eseguito** — helper irraggiungibile dal browser; `cooldown_remaining_sec` era **0** al check on-box ma nessuna prova POST senza path client

**Console:** nessun error/warn hook rilevante oltre Failed to fetch di rete.

## Codice repo

- **Nessuna** modifica codice locale in questo intervento (solo deploy VPS + memoria).
- Monolite **escluso** da questo commit autosync.
- Working tree locale: pulito su `ddce434…` pre/post.

## NEXT

1. Grant Tailscale ACL **additivo**: `tcp:8010` → `100.114.7.53/32` (stesso pattern di `:8000`).
2. Rieseguire Automated Browser QA D-FLIGHT-F (e solo allora gate ChatGPT / QA operatore / `finito` Regola H).

## Limiti

- Non è PASS browser; non dichiarare `QA FINALE CHATGPT — PENDING`.
- Non inferire QA operatore.
- Non eseguire `finito` finché non arriva `QA D-FLIGHT-F PASS operatore` **dopo** browser PASS.
