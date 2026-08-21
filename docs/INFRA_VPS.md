# VPS GOI — runtime e deploy

Documentazione operativa del nodo VPS che ospita proxy tailnet (Planet-Clone), server statico del monolite GIS e servizi di routing/geozone.
Dati rilevati **live** il **2026-08-21** (post-manutenzione apt + reboot + fix boot race nginx/Tailscale). Host **condiviso** con altri servizi (n8n).

> **Sicurezza:** questo documento **non** contiene credenziali, chiavi SSH, token o segreti. L'accesso SSH è descritto solo a livello di alias operatore.

---

## Host

| Voce | Valore LIVE (2026-08-21) |
|------|--------------------------|
| Nodo tailnet | `ubuntu` |
| Tailscale IP | `100.114.7.53` |
| Tailscale | **1.102.3** |
| IP pubblico (IONOS) | `217.160.71.145` |
| OS | Ubuntu **24.04.4** LTS (noble) |
| Kernel running | **`6.8.0-138-generic`** |
| CPU | **4** vCPU · load a riposo `0.00` |
| RAM totale | **3846 MiB** (~3.8 GiB) |
| RAM used / available | **1224 / 2621 MiB** (`free -m` @ 21:46 UTC) |
| Swap | **1 GiB** `/swapfile` · used **0 MiB** LIVE |
| Disco root `/` | **15G / 116G (13%)** |
| Reboot required | **REBOOT_NOT_REQUIRED** |
| APT pending | **4 phased** (non forzati): `console-setup`, `console-setup-linux`, `keyboard-configuration`, `snapd` |
| Failed units | **0** |
| Accesso SSH | `ssh ionos-n8n` (alias in `~/.ssh/config` dell'operatore; chiave già configurata) |

**GIS LIVE sul VPS:** tip `ac4789ea420bc691f9f8de5d7f751e040d3e6dc9` · build **247** · nessun `git pull` in questo housekeeping.

---

## Porte LIVE (sintesi)

| Bind | Porta | Servizio |
|------|------:|----------|
| `100.114.7.53` | 443 | nginx TLS (ORS) — **Tailscale-only** |
| `0.0.0.0` / `[::]` | 80 | nginx HTTP |
| `100.114.7.53` | 5000 | `goi-nav-proxy` |
| `100.114.7.53` | 8000 | `goi-gis-app` |
| `100.114.7.53` | 8010 | `goi-dflight-helper` LIVE |
| `127.0.0.1` | 8020 | `goi-ors-gateway` loopback |
| `100.114.7.53` | 8989 | GraphHopper app |
| `127.0.0.1` | 8990 | GraphHopper admin (localhost-only) |
| `127.0.0.1` | 5678 | n8n (`root-n8n-1`) |
| `0.0.0.0` / `[::]` | 22 | sshd |

**Assente:** `:8011` (leftover ATM09 candidate — eliminato dal reboot di manutenzione; **non** ricreato).

---

## Servizi attivi

> **Attenzione:** il VPS **non** è dedicato solo al GIS. Sullo stesso host convivono proxy, app statica GIS, GraphHopper, ORS, D-Flight, nginx e n8n (Docker).

Tutti i seguenti erano **active** al snapshot 2026-08-21 21:46 UTC:
`goi-nav-proxy`, `goi-gis-app`, `goi-graphhopper`, `goi-ors-gateway`, `goi-dflight-helper`, `nginx`, `docker`, `tailscaled`, `goi-tailscale-ready`.

### 1. `goi-nav-proxy.service` — proxy Navionics + Google Satellite

| Voce | Dettaglio |
|------|-----------|
| Ruolo | Proxy tailnet per tile Navionics e Google Satellite (`/gsat/`) |
| WorkingDir | `/root/local-files/handoff-runtime/Planet-Clone` |
| ExecStart | `.venv/bin/flask --app proxy run --host <tailnet-ip> --port 5000` |
| Drop-in | `/etc/systemd/system/goi-nav-proxy.service.d/override.conf` → `Environment=GSAT_STATIC_VERSION=1012` |
| Bind | `100.114.7.53:5000` (solo tailnet) |
| MemoryCurrent LIVE | ~43 MiB (peak ~43 MiB) |
| systemd | `enabled`, risale al boot |
| Egress al boot/restart | Contatta `maps.googleapis.com` (discovery static fallback; scelta accettata) |

### 2. `goi-gis-app.service` — server statico monolite GIS

| Voce | Dettaglio |
|------|-----------|
| Unit | `goi-gis-app.service` |
| Unit file | `/etc/systemd/system/goi-gis-app.service` |
| Ruolo | Serve il file canonico `coordinate_converter Claude.html` |
| Repo / WorkingDir | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| Meccanismo | `python3 -m http.server 8000 --bind "$TS_IP"` con `TS_IP` da `tailscale ip -4`; `ExecStartPre` attende Tailscale IPv4 fino a 45 s |
| Bind osservato | `100.114.7.53:8000` (tailnet) |
| MemoryCurrent LIVE | ~21 MiB |
| systemd | `enabled`, `Restart=on-failure`, `RestartSec=5` |
| Repo @ LIVE 2026-08-21 | tip **`ac4789e`** / build **247** |
| Egress | **Nessuno** — solo file statici |

### 3. `root-n8n-1` — n8n (Docker)

| Voce | Dettaglio |
|------|-----------|
| Ruolo | Automazione n8n |
| Bind | `127.0.0.1:5678` (**solo** locale VPS, **non** esposto su tailnet) |
| Mem LIVE (`docker stats`) | ~425 MiB (~11% del limite container) |
| Avvio | Risale al boot via Docker |

### 4. `goi-graphhopper.service` — GraphHopper outdoor routing (Tailscale only)

| Voce | Dettaglio |
|------|-----------|
| Unit | `goi-graphhopper.service` |
| Ruolo | GraphHopper **11.0** — routing outdoor (4 profili applicativi, cache Nord-Ovest Import B, MMAP) |
| User | `graphhopper` (system, nologin) |
| Root deploy | `/opt/goi-graphhopper` |
| Release corrente | `20260727-0400-gh11-nordovest-b` (`current` → symlink atomico) |
| JDK | Temurin **21.0.11+10** Linux x64 (`/opt/goi-graphhopper/jdk/current`) |
| Bind applicazione | **`100.114.7.53:8989`** (solo tailnet; **non** esposto su IP pubblico) |
| Bind admin | **`127.0.0.1:8990`** (solo localhost VPS — **non** raggiungibile da tailnet) |
| JVM | `-Xms256m -Xmx768m -XX:+UseG1GC` |
| Storage grafo | **MMAP** (`graph.dataaccess.default_type=MMAP`) |
| systemd limiti | `MemoryHigh=1100M`, `MemoryMax=1400M` |
| Cache live | **`nord-ovest-B-v3-elev`**: 16 file / **776000971** byte; CH×4; elevation **bilinear + ramer max_elevation 5** (INFRA-GH-1D PASS 2026-07-29); `import_date=2026-07-28T23:39:23Z`; **no reimport** a runtime |
| Cache V0 (rollback) | `nord-ovest-B`: 16 file / 790681035 byte — **trattenuta**; non cancellare |
| MemoryCurrent LIVE | ~1068 MiB (peak ~1073 MiB) — post-reboot 2026-08-21, senza swap |

> **Sicurezza:** endpoint admin **8990** resta localhost-only; **non** aggiungere 8990 alle ACL Tailscale. Accesso applicazione **8989** solo via tailnet con ACL esplicita.

### 5. `goi-ors-gateway.service` — micro-gateway HTTPS openrouteservice (INFRA1)

| Voce | Dettaglio |
|------|-----------|
| Ruolo | Gateway **ORS-specifico** (non generic proxy): POST `/ors/v2/directions/{profile}/geojson` + GET `/ors/status` |
| Codice | `/opt/goi-ors-gateway/current/goi_ors_gateway.py` (source: `infra/ors-gateway/`) |
| Bind applicazione | **`127.0.0.1:8020`** (loopback only) |
| TLS / reverse proxy | **nginx** `listen 100.114.7.53:443 ssl` — certificato Tailscale / Let's Encrypt (`/etc/goi-ors/tls/`) |
| Profili whitelist | `foot-hiking`, `foot-walking`, `cycling-mountain` |
| Upstream | hardcoded `https://api.openrouteservice.org` |
| Secret | nome canonico **`ORS_API_KEY`** · path `/etc/systemd/ors-credentials/ORS_API_KEY` · **0600 root:root** · accesso applicativo **solo** via systemd `LoadCredential` · valore **mai** in repo/docs |
| Fail-closed | file assente → drop-in omesso · POST `503 secret_not_configured` · **zero** upstream |
| MemoryCurrent LIVE | ~12 MiB |
| Helper D-Flight | **0.1.3** (servizio separato §6) |
| GIS monolite LIVE | build **247** / tip `ac4789e` (non 219/220) |

**ACL client:** grant `tcp:8000`/`tcp:5000`/`tcp:8010`/`tcp:443` → `100.114.7.53/32`. Listen `:443` solo Tailscale IP.

**Install/redeploy:** `python infra/ors-gateway/deploy_vps.py` (idempotente ABSENT/PRESENT) poi, se serve la key, `python infra/ors-gateway/install_secret.py`. Source of truth: [`infra/ors-gateway/README.md`](../infra/ors-gateway/README.md).

**Sicurezza:** nessun valore di `ORS_API_KEY` in questo documento.

### 6. `goi-dflight-helper.service` — helper D-Flight / NO_FLY_ZONE

| Voce | Dettaglio |
|------|-----------|
| Bind | **`100.114.7.53:8010`** (tailnet) |
| Helper version LIVE | **0.1.3** |
| MemoryCurrent LIVE | ~72 MiB (peak ~107 MiB) |
| Note | Porta candidate storica `:8011` **assente** LIVE |

---

## Boot ordering Tailscale → nginx

**Problema risolto (2026-08-21):** al reboot, nginx poteva eseguire `ExecStartPre` (`nginx -t` / bind `100.114.7.53:443`) **prima** che Tailscale avesse assegnato l’IPv4 su `tailscale0` → `Cannot assign requested address` → `nginx.service` failed e ORS HTTPS down.

**Stato canonico LIVE:**

| Path | Ruolo |
|------|--------|
| `/usr/local/sbin/goi-wait-tailscale-ip` | Poll: IP `100.114.7.53` **realmente** su `tailscale0` (non sleep fisso) |
| `/etc/systemd/system/goi-tailscale-ready.service` | Oneshot `RemainAfterExit=yes`, `Requires/After=tailscaled`, `TimeoutStartSec=90` |
| `/etc/systemd/system/nginx.service.d/goi-tailscale-ready.conf` | `Requires=` + `After=goi-tailscale-ready.service` — **non** altera ExecStartPre/ExecStart vendor |

**Principi:**

- nginx dipende dalla **readiness reale** dell’IP Tailscale su `tailscale0`;
- timeout 90 s;
- nessuno sleep fisso come unica condizione;
- listen nginx **invariato** (`100.114.7.53:443`);
- nessun Funnel / Serve Tailscale;
- nessun ampliamento esposizione pubblica.

**Validazione:** reboot reale 2026-08-21 — nginx risale **automaticamente**; ORS HTTPS `ready`; failed units **0**.
Evidence: [`docs/infra/evidence/2026-08-21_VPS-NGINX-TAILSCALE-BOOT-RACE-FIX-A.md`](infra/evidence/2026-08-21_VPS-NGINX-TAILSCALE-BOOT-RACE-FIX-A.md).

---

## Carico LIVE (2026-08-21, post-reboot)

| Metrica | Valore |
|---------|--------|
| Load average | `0.00 0.00 0.00` |
| RAM used / available | 1224 / **2621** MiB su 3846 |
| Swap used | **0** / 1023 MiB |
| Disco root | 15G / 116G (13%) |
| Vincolo principale | **RAM** (GraphHopper ~1.0–1.1 GiB resident + n8n ~425 MiB + stack GOI) |

> **Storico (2026-06-16, a riposo, pre-GraphHopper/ORS/D-Flight):** load `0.00`, RAM ~900 MiB / 3846 (~24%). Non usare come baseline corrente.

---

## Procedura di deploy (verificata)

### Proxy (Planet-Clone)

```bash
ssh ionos-n8n
cd /root/local-files/handoff-runtime/Planet-Clone
git status -s                    # atteso: vuoto
git pull origin main
git rev-parse HEAD
# Modifiche env SOLO via drop-in systemd (override.conf), non nel repo
systemctl daemon-reload
systemctl restart goi-nav-proxy
systemctl is-active goi-nav-proxy   # atteso: active
curl http://100.114.7.53:5000/status
# atteso: gsat presente, static_fallback_configured: true
```

### GIS (`cursor-coordinate-converter`)

```bash
cd /root/local-files/handoff-runtime/cursor-coordinate-converter
git status -s                    # atteso: vuoto
git pull origin main
git rev-parse HEAD
systemctl restart goi-gis-app
curl -I http://100.114.7.53:8000/coordinate_converter%20Claude.html
# atteso: HTTP 200
```

### Update di sistema

```bash
apt-get update
apt-get upgrade -y
# reboot SOLO se /var/run/reboot-required (es. nuovo kernel già installato)
# NON forzare pacchetti phased; NON full-upgrade/autoremove senza decisione esplicita
```

- Un **reboot** interrompe l’intero stack (proxy, GIS, GraphHopper, ORS, D-Flight, nginx, Docker/n8n, Tailscale) per ~1–2 minuti; i servizi `enabled` e Docker risalgono da soli **dopo** Tailscale IP (nginx via `goi-tailscale-ready`).
- **Post-reboot:** verificare `systemctl is-active` di `goi-nav-proxy` `goi-gis-app` `goi-graphhopper` `goi-ors-gateway` `goi-dflight-helper` `nginx` `docker` `tailscaled` `goi-tailscale-ready`, `docker ps` (n8n), e GET ORS HTTPS.

---

## Note operative / rischi

1. **Host condiviso** — proxy GIS, server statico GIS, GraphHopper, ORS, D-Flight, nginx e n8n condividono lo stesso VPS (IP pubblico, RAM, superficie di attacco).
2. **Allineare i repo** a ogni deploy significativo (GIS + Planet-Clone).
3. **Boot-egress proxy** — ogni restart/boot del proxy esegue discovery verso Google (`GSAT_STATIC_VERSION=1012` come rete di sicurezza / static fallback).
4. **`/gsat` sul VPS** — egress verso Google **non gated** a livello proxy; il gate consenso OPSEC vive nel **monolite client** (`ensureGsatConsent` / `tileFetchAllowed`).
5. **TODO (fuori scope di questo doc)** — esiste un deploy **Firebase** pubblico del GIS (`gistoolmarty-…web.app`); **non** è il VPS. La raggiungibilità del proxy tailnet da una pagina pubblica è un **nodo aperto** da chiarire separatamente.

---

## URL operativi (tailnet)

| Servizio | URL |
|----------|-----|
| GIS (monolite) | `http://100.114.7.53:8000/coordinate_converter%20Claude.html` |
| GraphHopper routing | `http://100.114.7.53:8989` (Tailscale only; `/info`, POST `/route`) |
| Proxy status | `http://100.114.7.53:5000/status` |
| ORS gateway status | `https://ubuntu.tailc01234.ts.net/ors/status` (Tailscale TLS; secret **not** in responses) |
| D-Flight status | `http://100.114.7.53:8010/status` |

*(Accesso tipico: rete Tailscale dell'operatore; non esporre credenziali in documentazione.)*

---

## Storico — Censimento GraphHopper (2026-07-24 / 2026-07-25)

> **Censimento datato (pre-1B).** Stato **superseded** da deploy INFRA-GH-1B (2026-07-27) e dallo snapshot LIVE 2026-08-21 sopra.

| Voce | Valore al censimento |
|------|----------------------|
| RAM totale VPS | ~3.8 GB |
| RAM disponibile (approx.) | ~2532 MB |
| Swap | assente (poi aggiunto 1 GiB in INFRA-GH-1B) |
| Porta **8989** | libera al censimento |
| Endpoint GraphHopper attivo | **nessuno** al censimento |

---

## Storico — GraphHopper deployato (INFRA-GH-1B — 2026-07-27)

**Stato:** **CLOSED / PASS end-to-end** — endpoint **`http://100.114.7.53:8989`** (Tailscale); profili `hiking`, `hiking_easy`, `mtb_touring`, `mtb_trail`; GraphHopper **11.0**; elevation ON; no PBF on-disk; no reimport runtime.

| Voce | Valore verificato (2026-07-27) |
|------|-------------------------------|
| Servizio | `goi-graphhopper.service` active/enabled |
| Release | `20260727-0400-gh11-nordovest-b` |
| `/info` | HTTP 200; version 11.0; elevation true; 4 profili |
| Bind | `100.114.7.53:8989` + `127.0.0.1:8990` |
| Esposizione pubblica 8989 | **assente** |
| Soak 30 min | PASS (p95 ~7.6 ms) |

Dettaglio WU: [`WU-0011`](work-units/WU-0011-infra-gh-1a-graphhopper-local-poc.md). Report PoC (fuori repo): `graphhopper-poc\reports\INFRA-GH-1B-WRITE-REPORT.md`.
