# VPS GOI — runtime e deploy

Documentazione operativa del nodo VPS che ospita proxy tailnet (Planet-Clone) e server statico del monolite GIS.  
Dati rilevati **live** il **2026-06-16**. Host **condiviso** con altri servizi (n8n).

> **Sicurezza:** questo documento **non** contiene credenziali, chiavi SSH, token o segreti. L'accesso SSH è descritto solo a livello di alias operatore.

---

## Host

| Voce | Valore |
|------|--------|
| Nodo tailnet | `ubuntu` |
| Tailscale IP | `100.114.7.53` |
| IP pubblico (IONOS) | `217.160.71.145` |
| OS | Ubuntu 24.04.4 LTS, kernel 6.8.0-124 (aggiornato 2026-06-16; **0** update pendenti) |
| RAM | ~3.8 GB |
| Disco | ~115 GB (~7.7% usato) |
| Swap | **1 GiB** (`/swapfile`; `vm.swappiness=10` — aggiunto con INFRA-GH-1B, 2026-07-27) |
| Accesso SSH | `ssh ionos-n8n` (alias in `~/.ssh/config` dell'operatore; chiave già configurata) |

---

## Servizi attivi

> **Attenzione:** il VPS **non** è dedicato solo al GIS. Sullo stesso host convivono proxy, app statica GIS e n8n (Docker).

### 1. `goi-nav-proxy.service` — proxy Navionics + Google Satellite

| Voce | Dettaglio |
|------|-----------|
| Ruolo | Proxy tailnet per tile Navionics e Google Satellite (`/gsat/`) |
| WorkingDir | `/root/local-files/handoff-runtime/Planet-Clone` |
| ExecStart | `.venv/bin/flask --app proxy run --host <tailnet-ip> --port 5000` |
| Drop-in | `/etc/systemd/system/goi-nav-proxy.service.d/override.conf` → `Environment=GSAT_STATIC_VERSION=1012` |
| Bind | `100.114.7.53:5000` (solo tailnet) |
| RAM (indicativa) | ~41 MiB |
| systemd | `enabled`, risale al boot |
| Repo @ deploy | `a7359e7` (route `/gsat` presente) |
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
| RAM (indicativa) | ~20 MiB |
| systemd | `enabled`, `active (running)` @ censimento 2026-06-16; `WantedBy=multi-user.target`; `Restart=on-failure`, `RestartSec=5` |
| Repo @ deploy | `ef953fc` (allineato 2026-06-16; **prima** era `c848ce8`, **33 commit indietro**, senza layer `gsat`) |
| Egress | **Nessuno** — solo file statici |

### 3. `root-n8n-1` — n8n (Docker)

| Voce | Dettaglio |
|------|-----------|
| Ruolo | Automazione n8n (in fase di test) |
| Bind | `127.0.0.1:5678` (**solo** locale VPS, **non** esposto su tailnet) |
| RAM (indicativa) | ~405 MiB |
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
| Collaudo | INFRA-GH-1B WRITE PASS (2026-07-27): smoke VPS + tailnet CORS + soak 30 min (p95 ~7.6 ms) |
| RAM osservata (soak) | MemoryCurrent max ~242 MiB; MemoryPeak ~248 MiB |
| Swap osservata (soak) | ~1.3 MiB usati su swapfile 1 GiB |
| Report PoC (fuori repo) | `C:\Users\mrhz\Documents\AI\Tools\graphhopper-poc\reports\INFRA-GH-1B-WRITE-REPORT.md` |

> **Sicurezza:** endpoint admin **8990** resta localhost-only; **non** aggiungere 8990 alle ACL Tailscale. Accesso applicazione **8989** solo via tailnet con ACL esplicita.

---

## Carico (2026-06-16, a riposo)

| Metrica | Valore |
|---------|--------|
| Load average | `0.00` |
| CPU | 100% idle |
| RAM | ~900 MiB / 3846 (~24%) |
| Margine | Ampio |
| Vincolo futuro probabile | **RAM** (non CPU) |

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
curl http://100.114.7.53:8000/coordinate_converter%20Claude.html | grep -c gsat
# atteso: > 0
```

### Update di sistema

```bash
apt update && apt upgrade -y
# reboot SOLO se necessario (es. nuovo kernel)
```

- Un **reboot** interrompe i tre servizi per ~1 minuto; risalgono da soli (`enabled` per i servizi systemd; Docker per n8n).
- **Post-reboot:** verificare `systemctl is-active goi-nav-proxy goi-gis-app` e `docker ps` per n8n.

---

## Note operative / rischi

1. **Host condiviso** — proxy GIS, server statico GIS e n8n condividono lo stesso VPS (IP pubblico, RAM, superficie di attacco).
2. **Drift storico** — il repo GIS era **33 commit indietro** mentre il proxy era aggiornato. **Allineare entrambi i repo** a ogni deploy significativo.
3. **Boot-egress proxy** — ogni restart/boot del proxy esegue discovery verso Google (`GSAT_STATIC_VERSION=1012` come rete di sicurezza / static fallback).
4. **`/gsat` sul VPS** — egress verso Google **non gated** a livello proxy; il gate consenso OPSEC vive nel **monolite client** (`ensureGsatConsent` / `tileFetchAllowed`).
5. **TODO (fuori scope di questo doc)** — esiste un deploy **Firebase** pubblico del GIS (`gistoolmarty-…web.app`); **non** è il VPS. La raggiungibilità del proxy tailnet da una pagina pubblica è un **nodo aperto** da chiarire separatamente.

---

## Censimento GraphHopper (2026-07-24 / 2026-07-25) — solo inventario, non deploy

> **Censimento datato (pre-1B).** Stato **superseded** da deploy INFRA-GH-1B (2026-07-27) — vedi servizio §4 e sezione **GraphHopper deployato** sotto.

| Voce | Valore al censimento |
|------|----------------------|
| RAM totale VPS | ~3.8 GB |
| RAM disponibile (approx.) | ~2532 MB |
| Swap | assente |
| Porta **8989** | libera al censimento |
| nginx | attivo su porta **80** (precedentemente assente dall’inventario di questo doc) |
| Idoneità import Nord-Ovest sul VPS | **non idoneo** (RAM insufficiente per import; import previsto su Ryzen in INFRA-GH-1A) |
| Serving GraphHopper futuro | **possibile solo dopo** misure INFRA-GH-1A / INFRA-GH-1B |
| `MemoryMax` systemd | **nessuno ratificato** (vietato fissarlo prima delle misure) |
| Modifiche infrastrutturali in 1A | **nessuna** (PoC solo loopback locale; VPS intatto) |
| Endpoint GraphHopper attivo | **nessuno** al censimento |

---

## GraphHopper deployato (INFRA-GH-1B — 2026-07-27)

**Stato:** **CLOSED / PASS end-to-end** — endpoint **`http://100.114.7.53:8989`** (Tailscale); profili `hiking`, `hiking_easy`, `mtb_touring`, `mtb_trail`; GraphHopper **11.0**; elevation ON; no PBF on-disk; no reimport runtime.

| Voce | Valore verificato |
|------|-------------------|
| Servizio | `goi-graphhopper.service` active/enabled |
| Release | `20260727-0400-gh11-nordovest-b` |
| `/info` | HTTP 200; version 11.0; elevation true; 4 profili |
| Bind | `100.114.7.53:8989` + `127.0.0.1:8990` |
| Esposizione pubblica 8989 | **assente** |
| CORS tailnet | PASS (Allow-Origin `*` da origine GIS tailnet) |
| ACL | tcp:8989 verso `100.114.7.53` — PASS operatore |
| Soak 30 min | PASS (p95 ~7.6 ms) |
| Co-located services | n8n, GIS, proxy, nginx, Tailscale **invariati** |

**Monolite GIS:** nessuna chiamata GraphHopper integrata — **OUTDOOR-ROUTING-GH-B2** resta bundle runtime separato (**READY**, non implementato).

Dettaglio WU: [`WU-0011`](work-units/WU-0011-infra-gh-1a-graphhopper-local-poc.md). Report PoC: `graphhopper-poc\reports\INFRA-GH-1B-WRITE-REPORT.md`.

---

## URL operativi (tailnet)

| Servizio | URL |
|----------|-----|
| GIS (monolite) | `http://100.114.7.53:8000/coordinate_converter%20Claude.html` |
| GraphHopper routing | `http://100.114.7.53:8989` (Tailscale only; `/info`, POST `/route`) |
| Proxy status | `http://100.114.7.53:5000/status` |
| ORS gateway status | `https://ubuntu.tailc01234.ts.net/ors/status` (Tailscale TLS; secret **not** in responses) |

*(Accesso tipico: rete Tailscale dell'operatore; non esporre credenziali in documentazione.)*

---

## 5. `goi-ors-gateway.service` — micro-gateway HTTPS openrouteservice (INFRA1)

| Voce | Dettaglio |
|------|-----------|
| Ruolo | Gateway **ORS-specifico** (non generic proxy): POST `/ors/v2/directions/{profile}/geojson` + GET `/ors/status` |
| Codice | `/opt/goi-ors-gateway/current/goi_ors_gateway.py` (source: `infra/ors-gateway/`) |
| Bind applicazione | **`127.0.0.1:8020`** (loopback only) |
| TLS / reverse proxy | **nginx** `listen 100.114.7.53:443 ssl` — certificato Tailscale / Let's Encrypt (`/etc/goi-ors/tls/`) |
| Profili whitelist | `foot-hiking`, `foot-walking`, `cycling-mountain` |
| Upstream | hardcoded `https://api.openrouteservice.org` |
| Secret | nome canonico **`ORS_API_KEY`** · path `/etc/systemd/ors-credentials/ORS_API_KEY` · **non valorizzato in INFRA1** |
| Fail-closed | POST senza secret → `503 secret_not_configured`, **zero** chiamata upstream |
| Helper D-Flight | **0.1.3 invariato** |
| GIS monolite | **non collegato** (nessun build 220) |

**ACL client:** lo storico grant Tailscale copre `tcp:8000`/`tcp:5000`/`tcp:8010`. Il listen `:443` è solo Tailscale IP (non `0.0.0.0`). Un client Windows può vedere timeout finché non esiste grant additivo `tcp:443` → `100.114.7.53/32` (stesso pattern di `:8010`). La verifica on-box VPS con `curl --resolve` è PASS.

**Sicurezza:** nessun valore di `ORS_API_KEY` in questo documento.
