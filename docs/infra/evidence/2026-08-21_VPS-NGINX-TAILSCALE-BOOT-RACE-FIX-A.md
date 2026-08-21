# VPS-NGINX-TAILSCALE-BOOT-RACE-FIX-A

**Esito: PASS**  
**Data:** 2026-08-21 21:36–21:40 UTC  
**Host:** `ubuntu` via `ssh ionos-n8n`  
**Baseline BLOCKED:** `0818b26bc38217cd255ba2facc8a1274f3144a8d`  
**Rollback:** **no**

Nessun secret/token/password/cookie/Authorization.  
Nessuna modifica monolite / FRONTIER / inbox / latest / LAST_CURSOR_REPORT / runtime GIS.  
GIS VPS HEAD invariato: `ac4789ea420bc691f9f8de5d7f751e040d3e6dc9` (LIVE **247**).

---

## Root cause

**Confermata.** nginx `ExecStartPre` (`nginx -t`) gira su `After=network-online.target` **senza** dipendenza da `tailscaled`. Al boot precedente (21:17:41) nginx partiva **prima** di `tailscaled` (21:17:42) e falliva:

`bind() to 100.114.7.53:443 failed (99: Cannot assign requested address)`

Recovery immediato (Fase 2) con IP già su `tailscale0`: `nginx -t` PASS, `systemctl start nginx` → active, `:443` presente, ORS HTTPS `ready`. Diagnosi race sufficiente.

---

## Timeline

| UTC | Evento |
|-----|--------|
| 21:36:50 | Preflight: kernel 6.8.0-138, TS `100.114.7.53` su `tailscale0`, nginx still failed, GOI 5/5, n8n UP, ORS loopback ready |
| 21:37:22 | Recovery: `systemctl start nginx` → active; ORS HTTPS ready |
| 21:38:04 | `systemctl restart nginx` (post drop-in): readiness active in ~1 s (IP già presente) |
| 21:38:15 | `sync` + `reboot` validazione |
| 21:38:24 | boot: `tailscaled` starting; `goi-tailscale-ready` waiting |
| 21:38:25 | IP assegnato su `tailscale0` (~**1 s** wait); nginx Starting → Started **automaticamente** |
| 21:39:50 | SSH di nuovo OK (reboot ~95 s) |

**Tempo readiness Tailscale (boot validazione):** ~**1 s** (21:38:24 → 21:38:25).  
Journal nginx boot corrente: **0** occorrenze di `Cannot assign requested address`.

---

## Unit / drop-in installati

| Path | Ruolo |
|------|--------|
| `/usr/local/sbin/goi-wait-tailscale-ip` | script 0755: poll `ip -4 -o addr show dev tailscale0` per `inet 100.114.7.53/` (non sleep fisso; timeout systemd 90 s) |
| `/etc/systemd/system/goi-tailscale-ready.service` | oneshot `RemainAfterExit=yes`, `Requires/After=tailscaled.service`, `TimeoutStartSec=90`, enabled |
| `/etc/systemd/system/nginx.service.d/goi-tailscale-ready.conf` | `Requires=` + `After=goi-tailscale-ready.service` — **non** tocca ExecStartPre/ExecStart vendor |

Listen nginx **invariato** (`100.114.7.53:443` + `:80`). Nessun 0.0.0.0:443. Nessun Funnel/Serve/ACL/firewall.

### `goi-tailscale-ready.service` (sanitizzato)

```
[Unit]
Description=Wait until GOI Tailscale IPv4 is assigned on tailscale0
Requires=tailscaled.service
After=tailscaled.service

[Service]
Type=oneshot
RemainAfterExit=yes
TimeoutStartSec=90
ExecStart=/usr/local/sbin/goi-wait-tailscale-ip

[Install]
WantedBy=multi-user.target
```

### drop-in nginx

```
[Unit]
Requires=goi-tailscale-ready.service
After=goi-tailscale-ready.service
```

Vendor `ExecStartPre=/usr/sbin/nginx -t …` **preservato**. `systemctl show nginx After=` include `goi-tailscale-ready.service`. `systemd-analyze verify` senza output (OK).

---

## Recovery nginx (Fase 2)

PASS. `nginx -t` OK. start → active. `0.0.0.0:80` + `100.114.7.53:443`. ORS HTTPS `status=ready`, `secret=PRESENT` (no valore).

---

## Validation pre-reboot (Fase 4)

`daemon-reload` + `enable goi-tailscale-ready` + `systemctl restart nginx`:

- `goi-tailscale-ready`: active (exited) SUCCESS
- nginx: active
- `:443` presente
- ORS HTTPS ready

---

## Validation post-reboot (Fase 5) — PASS

| Check | Esito |
|-------|--------|
| kernel | `6.8.0-138-generic` |
| Tailscale | 1.102.3 online, `100.114.7.53` su `tailscale0` |
| `goi-tailscale-ready` | **active** (automatico) |
| nginx | **active** senza intervento manuale |
| `:443` | `100.114.7.53:443` nginx |
| failed units | **0** |
| GOI 5/5 | active |
| docker + n8n | `root-n8n-1` Up ~1 min, `127.0.0.1:5678` |
| `:8011` | **assente** (non ricreata) |

### Endpoint GET-only

| Target | Esito |
|--------|--------|
| GIS `:8000` | HTTP **200** |
| Nav/GSAT `:5000/status` | HTTP **200**, `last_error` null (snippet) |
| GraphHopper `:8989/info` | HTTP **200** |
| ORS loopback `:8020/ors/status` | `ready` |
| ORS HTTPS tailnet `:443/ors/status` | **ready** PASS |
| D-Flight `:8010/status` | READY, 841 feature, helper 0.1.3 |

### Porte post-boot

Pubblico: `:22` ssh, `:80` nginx (come prima). `:443` **solo** `100.114.7.53`. GIS 8000, proxy 5000, D-Flight 8010, GH 8989 tailnet; ORS 8020 / GH admin 8990 / n8n 5678 loopback. Nessuna nuova esposizione pubblica.

---

## RAM / swap post-boot

`free -m` ~21:39 UTC:

| | used | available | swap used |
|--|------:|----------:|----------:|
| Mem 3846 MiB | 1175 | **2670** | **0** / 1023 |

---

## Servizi PASS count

**8/8** della lista produzione (5 `goi-*` + nginx + docker + tailscaled) + readiness oneshot active. n8n UP.

---

## Esito finale

**PASS.** Race confermata e corretta con ordering systemd (IP su `tailscale0`, non sleep). nginx sale da solo al boot; ORS HTTPS ready; GIS 247 invariato; rollback non necessario.
