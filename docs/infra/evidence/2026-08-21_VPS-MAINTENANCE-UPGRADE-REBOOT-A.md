# VPS-MAINTENANCE-UPGRADE-REBOOT-A

**Esito: BLOCKED**  
**Data:** 2026-08-21 21:16–21:25 UTC  
**Host:** `ubuntu` via `ssh ionos-n8n`  
**Causa blocco:** `nginx.service` **failed** post-reboot — bind `100.114.7.53:443` prima che Tailscale avesse l’indirizzo (`Cannot assign requested address`). Nessun repair eseguito (FAIL CLOSED).

Nessun secret/token/password/cookie/Authorization in questo report.  
Nessun deploy GIS, nessun `git pull` runtime, nessun full-upgrade/autoremove, nessuna modifica nginx/systemd/ACL.

---

## Timeline

| UTC | Evento |
|-----|--------|
| 21:16:33 | Preflight |
| 21:16:49 | `apt-get update` start |
| 21:17:14 | `apt-get upgrade -y` OK — 21 upgraded |
| 21:17:31 | `sync` + `reboot` |
| 21:17:41 | nginx fail (boot +~10 s) |
| 21:19:16 | SSH di nuovo OK · kernel `6.8.0-138-generic` · uptime 1 min |
| 21:19:29 | Post-boot servizi/RAM T+1 min |
| 21:25:20 | Soak ~5 min |

**Reboot duration (SSH drop → SSH back):** ~**105 s** (21:17:31 → 21:19:16).

---

## Kernel / Tailscale

| | Prima | Dopo |
|--|-------|------|
| kernel running | `6.8.0-124-generic` | **`6.8.0-138-generic`** |
| Tailscale | 1.102.2 · online `100.114.7.53` | **1.102.3** · online `100.114.7.53` |
| `/var/run/reboot-required` | YES (`*** System restart required ***`) | **REBOOT_NOT_REQUIRED** |

Acceptance kernel: PASS (138 vs 124).

---

## Pacchetti aggiornati (`apt-get upgrade -y`)

21 upgraded, 0 newly installed, 0 to remove, 4 not upgraded (phased, non forzati).

- apport, apport-core-dump-handler, python3-apport, python3-problem-report (2.28.3-0ubuntu0.1)
- iproute2 6.1.0-1ubuntu6.4
- open-vm-tools 2:13.0.10-0ubuntu0.24.04.1
- krb5-locales, libgssapi-krb5-2, libkrb5-3, libkrb5support0, libk5crypto3 (1.20.1-6ubuntu2.8)
- libplymouth5, plymouth, plymouth-theme-ubuntu-text (24.004.60-1ubuntu7.2)
- docker-buildx-plugin 0.36.1 · docker-compose-plugin 5.5.0
- fwupd / libfwupd3 2.0.20-1ubuntu2~24.04.2
- kpartx / multipath-tools 0.9.4-5ubuntu8.2
- **tailscale 1.102.3**

needrestart durante upgrade (pre-reboot): restart `containerd`, `packagekit`, `ssh`; docker **deferred**.

### Ancora pending (phased — non toccati)

- console-setup, console-setup-linux, keyboard-configuration
- snapd 2.76+ubuntu24.04.1 → 2.76.3+ubuntu24.04

---

## GIS runtime (invariato)

VPS HEAD (no git pull): `ac4789ea420bc691f9f8de5d7f751e040d3e6dc9` (LIVE **247**).

---

## Servizi

| Unit | Pre | Post-boot | Esito |
|------|-----|-----------|-------|
| goi-nav-proxy | active | active | PASS |
| goi-gis-app | active | active | PASS |
| goi-graphhopper | active | active | PASS |
| goi-ors-gateway | active | active | PASS |
| goi-dflight-helper | active | active | PASS |
| docker + n8n `root-n8n-1` | Up 2 months | Up ~1 min | PASS |
| tailscaled | active | active | PASS |
| **nginx** | active | **failed** | **FAIL** |

**Servizi PASS count:** 7/8 della lista post-boot (nginx FAIL). GOI `goi-*` 5/5.

### nginx — evidence FAIL CLOSED

```
nginx: [emerg] bind() to 100.114.7.53:443 failed (99: Cannot assign requested address)
nginx: configuration file /etc/nginx/nginx.conf test failed
```

`ExecStartPre` fallito alle 21:17:41 UTC (boot `c2ecb584…`). Tailscale IP è presente dopo (~21:19). **Nessun `systemctl start/restart nginx`.**

---

## Endpoint GET-only

| Target | Esito |
|--------|--------|
| GIS `:8000` HTML | HTTP **200** PASS |
| Nav/GSAT `:5000/status` | OK, `last_error: null`, `tokens_ok: true` (nessun token) PASS |
| GraphHopper `:8989/info` | HTTP **200**, version **11.0**, 4 profili, elevation true PASS |
| ORS `127.0.0.1:8020/ors/status` | `ready`, `secret=PRESENT` (no valore) PASS |
| ORS HTTPS `ubuntu.tailc01234.ts.net:443/ors/status` | **FAIL** connect (nginx down) |
| D-Flight `:8010/status` | **READY**, 841 feature, helper 0.1.3 PASS |

---

## Porte

| Porta | Pre | Post | Note |
|------:|-----|------|------|
| 443 nginx Tailscale | sì | **no** | nginx failed |
| 80 nginx pubblico | sì | **no** | nginx failed |
| 5000 Nav/GSAT | sì | sì | |
| 8000 GIS | sì | sì | |
| 8010 D-Flight LIVE | sì | sì | |
| 8011 leftover candidate | sì | **assente** | cleanup naturale reboot — non ricreato |
| 8020 ORS loopback | sì | sì | |
| 8989 GraphHopper | sì | sì | |
| 8990 GH admin loopback | sì | sì | |
| 5678 n8n loopback | sì | sì | |
| 22 ssh | sì | sì | unico listener pubblico rimasto oltre DNS locale |

Nessuna nuova porta critica esposta pubblicamente. `:80`/`:443` assenti perché nginx down (regressione raggiungibilità ORS TLS / HTTP nginx, non nuova esposizione).

---

## Failed units

| | |
|--|--|
| Pre | transient ATM09 `run-rf41dc22f12bf4048b0597b3db7a414df` (probe 2026-08-16) |
| Post | **assente** (cleanup naturale) |
| Post nuovo | **`nginx.service` failed** — produzione/infra ORS TLS |

---

## RAM / swap

`free -m`

| Fase | Mem used | Mem available | Swap used | Swap total |
|------|----------:|-------------:|----------:|-----------:|
| Baseline health-check | 1896 | 1950 | 657 | 1023 |
| Preflight 21:16 | ~1900 (1.9 Gi) | ~1900 (1.9 Gi) | 657 | 1023 |
| Post-boot T+1 min | **1214** | **2632** | **0** | 1023 |
| Soak ~5 min 21:25 | **1219** | **2627** | **0** | 1023 |

Swap azzerato. MemAvailable migliorata (~2.6 Gi vs 1.9 Gi). GraphHopper systemd MemoryCurrent soak ≈ **1073 MiB** (peak 1074) — in RAM, senza swap; più alto del ~604 MiB pre-reboot (processo fresco / niente paging). D-Flight ~71 MiB; proxy ~37 MiB. n8n Docker soak **411.4 MiB (10.70%)**. Disco root **15G / 116G (13%)**. Load soak `0.01 0.02 0.00`.

Non è regressione RAM: cache/Linux + GraphHopper resident; swap 0 è miglioramento.

---

## Esito finale

**BLOCKED** — upgrade + reboot + kernel + Tailscale + GOI stack + n8n + endpoint GIS/proxy/GH/ORS-loopback/D-Flight OK; **nginx non è risalito** (race Tailscale IP `:443`). ORS HTTPS tailnet non raggiungibile. Repair nginx **fuori scope** (FAIL CLOSED).
