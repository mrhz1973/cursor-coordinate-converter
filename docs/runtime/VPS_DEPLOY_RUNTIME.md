# VPS GOI — runtime e deploy (post WU-0009 Google Satellite)

Documento operativo **OPSEC-aware** per runtime/deploy del nodo VPS GOI.
Dati runtime/deploy rilevati il **2026-06-16**.
**Non contiene** credenziali, chiavi private, cookie, password o token.

> **Relazione con altri doc:** inventario host/servizi esteso anche in [`docs/INFRA_VPS.md`](../INFRA_VPS.md) (fonte deploy host). Questo file è il **supporto runtime** post-chiusura WU-0009 `gsat`, con focus architettura proxy, cache, boot/reboot e smoke verificati.

---

## 1. Scopo

- Registrare lo **stato operativo verificato** del runtime VPS dopo WU-0009 Google Satellite end-to-end (backend Planet-Clone + frontend GIS + deploy tailnet).
- Guidare deploy/smoke **senza** duplicare segreti o aprire superfici non necessarie.
- Complementare `docs/OPERATING_MEMORY.md` §7b — **non** sostituire §7 come stato vivo primario.

---

## 2. Architettura sintetica

| Componente | Ruolo |
|------------|--------|
| **GIS monolite** (`coordinate_converter Claude.html`) | Frontend: layer `gsat`, consenso OPSEC Google ≠ Navionics, cache tile browser (IndexedDB) |
| **Planet-Clone** (`mrhz1973/Planet-Clone`) | Backend proxy separato: Navionics `/tiles`, SonarChart `/sonar`, Google Satellite `/gsat` |
| **VPS tailnet** (`ubuntu`, `100.114.7.53`) | Runtime: proxy `:5000`, server statico GIS `:8000`, n8n Docker (host **condiviso**) |

Flusso **`gsat`:** browser GIS → proxy tailnet → egress Google dal VPS (discovery + tile); gate consenso OPSEC **solo lato client** (`ensureGsatConsent` / `tileFetchAllowed`).

Navionics e SonarChart restano su route `/tiles` e `/sonar` con consenso Navionics separato.

---

## 3. Servizi VPS

> Il VPS **non** è dedicato solo al GIS.

### 3.1 `goi-nav-proxy.service` (Planet-Clone)

| Voce | Valore |
|------|--------|
| Unit | `goi-nav-proxy.service` |
| WorkingDir | `/root/local-files/handoff-runtime/Planet-Clone` |
| Bind | `100.114.7.53:5000` (**tailnet-only**) |
| systemd | `enabled`, risale al boot |
| Repo @ deploy verificato | `a7359e7` (route `/gsat/{z}/{x}/{y}.jpg`, `/status` con `gsat`) |

### 3.2 Server statico GIS (`:8000`)

| Voce | Valore |
|------|--------|
| URL osservato | `http://100.114.7.53:8000/coordinate_converter%20Claude.html` |
| Bind | `100.114.7.53:8000` (**tailnet-only**) |
| Repo runtime | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| Commit GIS @ deploy verificato | `ef953fc` (allineato 2026-06-16; include layer `gsat`) |
| Egress | **Nessuno** — solo file statici |

**Nota:** unità systemd `goi-gis-app.service` citata in [`docs/INFRA_VPS.md`](../INFRA_VPS.md); **metodo di avvio completo da censire** (vedi §9 punti aperti).

### 3.3 n8n (Docker, non GIS)

| Voce | Valore |
|------|--------|
| Container osservato | `root-n8n-1` |
| Bind | `127.0.0.1:5678` (**solo localhost VPS**, non tailnet) |
| Ruolo | Automazione separata; **non** trattare come servizio GIS |

---

## 4. Proxy Planet-Clone

### 4.1 Route

| Route | Uso |
|-------|-----|
| `/tiles/{z}/{x}/{y}.png` | Navionics basemap |
| `/sonar/{z}/{x}/{y}.png` | SonarChart overlay |
| `/gsat/{z}/{x}/{y}.jpg` | Google Satellite (WU-0009) |
| `/status` | Health + metadati `gsat` |

### 4.2 Runtime env (systemd drop-in)

- File: `/etc/systemd/system/goi-nav-proxy.service.d/override.conf`
- Variabile: `GSAT_STATIC_VERSION=1012` (fallback statico se discovery fallisce)
- Modifiche env **solo** via drop-in — **non** nel repo Planet-Clone

### 4.3 `/status` atteso (smoke post-deploy)

Campi osservati/verificati:

- `gsat` presente
- `static_fallback_configured: true`
- `version: "1012"`
- `version_source: "discovery"`
- `tokens_ok: true`
- `last_error: null`

### 4.4 Commit di riferimento

| Repo | Commit | Nota |
|------|--------|------|
| Planet-Clone | `a7359e7` | Backend `/gsat`, `proxy.py` (repo separato — **non** modificato da questo doc GIS) |
| GIS monolite | `013b8cb` | Layer frontend `gsat`, consenso split, i18n |
| GIS autosync | `ef953fc` | Memoria/orchestratore allineati al runtime `gsat` |

---

## 5. Deploy proxy verificato

Accesso VPS: `ssh <LOCAL_SSH_ALIAS>` (alias in `~/.ssh/config` operatore — **non** documentare chiavi né credenziali).

```bash
ssh <LOCAL_SSH_ALIAS>
cd /root/local-files/handoff-runtime/Planet-Clone
git status -s                    # atteso: vuoto
git pull origin main
git rev-parse HEAD               # atteso: include a7359e7 o successivo con /gsat
# Env: solo drop-in systemd, non edit nel repo
systemctl daemon-reload
systemctl restart goi-nav-proxy
systemctl is-active goi-nav-proxy   # atteso: active
curl -s http://100.114.7.53:5000/status | head -c 500
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" \
  "http://100.114.7.53:5000/gsat/10/512/512.jpg"
# atteso: 200 image/jpeg
```

Deploy GIS (sintesi — dettaglio in [`docs/INFRA_VPS.md`](../INFRA_VPS.md)):

```bash
cd /root/local-files/handoff-runtime/cursor-coordinate-converter
git status -s && git pull origin main && git rev-parse HEAD
systemctl restart goi-gis-app    # se unit censita/attiva
curl -s "http://100.114.7.53:8000/coordinate_converter%20Claude.html" | grep -c gsat
# atteso: > 0
```

**Policy drift:** allineare **entrambi** i repo (Planet-Clone + GIS) a ogni deploy significativo.

---

## 6. Cache e persistenza

| Livello | Comportamento |
|---------|----------------|
| **Proxy Planet-Clone** | Pass-through tile; **nessuna** cache tile persistente documentata sul VPS |
| **Browser GIS** | IndexedDB / Mappe Offline quando l'operatore precacha o browse-cache (layer `gsat` offline-eligible lato client) |
| **Proxy Navionics/Google** | Token/discovery runtime in memoria processo; `GSAT_STATIC_VERSION` come fallback configurato |

Il proxy **non** sostituisce la persistenza offline del monolite.

---

## 7. Boot, reboot e update policy

| Evento | Comportamento verificato |
|--------|---------------------------|
| Boot | `goi-nav-proxy.service` **enabled** → risale al boot |
| Restart proxy | Discovery versione Google (`maps.googleapis.com`); fallback `GSAT_STATIC_VERSION=1012` |
| Reboot VPS | Proxy e n8n risalgono (~1 min downtime); servizi verificati boot-resilient post-reboot |
| Update sistema | Eseguito; kernel **6.8.0-124** (2026-06-16); proxy e n8n OK dopo reboot |

**Policy operativa:** eseguire `apt update && apt upgrade` e reboot **solo per kernel** come blocco controllato; post-reboot smoke:

```bash
systemctl is-active goi-nav-proxy goi-gis-app
docker ps | grep n8n
curl -s http://100.114.7.53:5000/status | head -c 200
```

---

## 8. OPSEC

- **Tailnet-only:** bind proxy e GIS statico su `100.114.7.53`, non esposizione pubblica diretta dei servizi GIS documentati qui.
- **Host condiviso:** proxy + GIS + n8n condividono RAM e superficie; n8n resta su `127.0.0.1:5678`.
- **IP pubblico IONOS** e **alias SSH locale:** trattati come sensibili — usare placeholder `<IONOS_PUBLIC_IP>` / `<LOCAL_SSH_ALIAS>` in copy operativa; non duplicare in chat pubblica.
- **`/gsat` lato proxy:** egress Google **non gated** sul VPS; fail-closed e consenso per-sessione **solo nel monolite**.
- **Nessun segreto** in questo documento.
- **Firebase pubblico** (`gistoolmarty-…web.app`): deploy separato dal VPS; raggiungibilità proxy tailnet da pagina pubblica = **nodo aperto** (fuori scope).

---

## 9. Punti aperti

1. **Censire metodo di avvio** del server statico GIS `:8000` (systemd `goi-gis-app.service` vs altro) e documentare unit file definitivo.
2. **Healthcheck / rate-limit / logging** proxy — blocchi successivi (non WU-0009 chiusura).
3. **Bing** e altre varianti Google — workstream separato (WU-0009B B4+); **non** aprire in questo documento.
4. **Browser QA operatore** su `gsat` sotto OPSEC strict — da attestare in OM §7 quando eseguito.

---

## 10. Riferimenti commit WU-0009 (chiusura end-to-end)

| Layer | Stato | Riferimento |
|-------|-------|-------------|
| Backend Planet-Clone `/gsat` | PASS deploy | `a7359e7` |
| Frontend GIS `gsat` | PASS runtime | `013b8cb` |
| Autosync memoria | PASS | `ef953fc` |
| Deploy VPS smoke | PASS | `/status` OK; tile `200 image/jpeg` |
| Documentazione runtime | Questo file + [`docs/INFRA_VPS.md`](../INFRA_VPS.md) |
