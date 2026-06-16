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
| Swap | Nessuno |
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
| Ruolo | Serve il file canonico `coordinate_converter Claude.html` |
| Repo / WorkingDir | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| Meccanismo | `http.server`, bind `100.114.7.53:8000` (tailnet) |
| RAM (indicativa) | ~20 MiB |
| systemd | `enabled` |
| Repo @ deploy | `ef953fc` (allineato 2026-06-16; **prima** era `c848ce8`, **33 commit indietro**, senza layer `gsat`) |
| Egress | **Nessuno** — solo file statici |

### 3. `root-n8n-1` — n8n (Docker)

| Voce | Dettaglio |
|------|-----------|
| Ruolo | Automazione n8n (in fase di test) |
| Bind | `127.0.0.1:5678` (**solo** locale VPS, **non** esposto su tailnet) |
| RAM (indicativa) | ~405 MiB |
| Avvio | Risale al boot via Docker |

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

## URL operativi (tailnet)

| Servizio | URL |
|----------|-----|
| GIS (monolite) | `http://100.114.7.53:8000/coordinate_converter%20Claude.html` |
| Proxy status | `http://100.114.7.53:5000/status` |

*(Accesso tipico: rete Tailscale dell'operatore; non esporre credenziali in documentazione.)*
