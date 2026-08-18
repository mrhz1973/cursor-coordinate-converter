# OUTDOOR-ROUTING-ORS-PROVIDER-A — INFRA/CAPABILITY GATE FAIL

**BLOCK-ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**Categoria:** DELICATO  
**Data:** 2026-08-18  
**Esito:** **STOP PRIMA della patch runtime**

## BASE LIVE (invariata)

| Campo | Valore |
| --- | --- |
| FULL SHA | `5477a5e0d8d9a5681dbfab37b3c39e182306fc79` |
| Build / ID | **219** / `OUTDOOR-ROUTING-F-AVOID-AREAS-A-FIX1` |
| Helper | **0.1.3** (non toccato) |
| Candidate 220 | **non creato** |
| Build bump | **nessuno** |
| Deploy / ABQA / QA / finito | **nessuno** |

## Gate 0 — verdetto

| Check | Esito |
| --- | --- |
| A. Sede gateway HTTPS canonica già utilizzabile | **FAIL** |
| B. Secret ORS server-side (`ORS_API_KEY` / equivalente) | **ABSENT** |
| C. Capability ORS 1–10 via gateway | **NON ESEGUITO** (A+B fail; nessun endpoint improvvisato) |

**Nessun valore di chiave letto o stampato.**

## A — sede gateway HTTPS

Inventario VPS (`ssh ionos-n8n`, presenza/porte/nomi file):

| Voce | Osservato |
| --- | --- |
| `nginx` | `active`, listen **`:80` only** (`0.0.0.0:80` + `[::]:80`) |
| TLS `:443` | **`443_LISTEN=0`** |
| Let's Encrypt | `no_letsencrypt_live` |
| `sites-available/default` | `listen 443 ssl` **commentato** |
| Servizi GIS esistenti | HTTP Tailscale: `:8000` (GIS), `:8010` (helper 0.1.3), `:8989` (GH), `:5000` (nav proxy) |
| Unit `goi-ors-gateway` / `/opt/goi-ors-gateway` / `/etc/goi-ors` | **assenti** |
| `OUTDOOR-ROUTING-API-GATEWAY-A` | resta **BACKLOG / NON APERTO** |

Il prompt richiede che il browser parli **solo** con un endpoint **HTTPS** controllato. Non esiste oggi una sede TLS già utilizzabile. Helper 0.1.3 **non** è stato modificato (divieto automatico; non è un gateway ORS).

## B — secret ORS

Scan **solo presenza/assenza di nomi** (nessun `cat` di secret, nessun dump env value):

| Sorgente | Verdetto |
| --- | --- |
| Env sessione SSH (`ORS_API_KEY`, `OPENROUTESERVICE_API_KEY`, `ORS_KEY`, `OPENROUTESERVICE_KEY`) | **ABSENT** |
| File unit systemd / `.env` / `/etc/environment` / bashrc (match nome) | **ABSENT** |
| Filename systemd `*ors*` / `*openroute*` | **ABSENT** |
| `LoadCredential` | solo `dflight_username` / `dflight_password` |
| Docker `root-n8n-1` env key names | `ors_key_name_present=False` |

**ORS_SECRET_VERDICT: ABSENT**

## C — capability matrix

Non eseguita. Senza gateway HTTPS e senza secret server-side, ogni probe verso `api.openrouteservice.org` richiederebbe un endpoint improvvisato o la chiave in questo pass — entrambi vietati.

## Cosa non è stato fatto

- nessuna patch a `coordinate_converter Claude.html`
- nessun build 220
- nessun helper bump
- nessun servizio gateway creato
- nessuna chiave richiesta all’operatore in chat
- nessun deploy / ABQA / QA operatore / finito

## Sblocco minimo (fuori da questo pass)

1. Provisionare **sede HTTPS** già utilizzabile sul VPS (certificato + listen `:443` o equivalente Tailscale HTTPS canonico) per un gateway minimo whitelist ORS.  
2. Configurare **server-side** `ORS_API_KEY` (systemd `LoadCredential` / env unit) **senza** copiarla in repo, evidence o chat.  
3. Solo dopo A+B PASS: ripetere capability 1–10 **tramite gateway**, poi candidate runtime.

## Monolite

**UNTOUCHED.** LIVE resta build **219**.
