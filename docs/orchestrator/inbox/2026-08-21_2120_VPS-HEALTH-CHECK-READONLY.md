# VPS-HEALTH-CHECK-READONLY

**Data evidence:** 2026-08-21 18:47–18:52 UTC  
**Host:** `ubuntu` via `ssh ionos-n8n` (root)  
**Esito:** **PASS** (censimento LIVE read-only; unico side effect: `apt-get update` metadata)  
**NON eseguito:** apt upgrade / reboot / restart / deploy / git pull runtime / modifiche nginx/Tailscale/systemd

Nessun secret/token/password/cookie/Authorization in questo report.

---

## 1. Identità host

| Voce | Valore LIVE |
|------|-------------|
| `date -Is` | `2026-08-21T18:47:58+00:00` |
| hostname | `ubuntu` |
| OS | Ubuntu 24.04.4 LTS (noble) |
| kernel **running** | `6.8.0-124-generic` `#124-Ubuntu` |
| kernel **expected** (needrestart) | `6.8.0-138-generic` |
| uptime | 65 days, 23:56 (boot ~ 2026-06-16) |
| CPU | 4 vCPU · load `0.00 0.00 0.00` |
| Tailscale IPv4 | `100.114.7.53` |

---

## 2. RAM / swap / disco

`free -m` LIVE:

| | total | used | free | buff/cache | available |
|--|------:|-----:|-----:|-----------:|----------:|
| **Mem (MiB)** | **3846** | **1896** | 320 | 1920 | **1950** |
| **Swap (MiB)** | **1023** | **657** | 366 | — | — |

- RAM used/total ≈ **49%** (1896/3846). Available ≈ **51%** (1950/3846) grazie a cache.
- Swap used/total ≈ **64%** (657/1023) su `/swapfile` 1024M (`swapon --show`).
- Disco root `/dev/vda1`: **16G / 116G (14%)** — Avail 100G.
- `/boot`: 117M / 881M (15%). `/boot/efi`: 6.2M / 105M (6%).

Confronto inventario `docs/INFRA_VPS.md` (2026-06-16): RAM a riposo era ~900 MiB / 24%; oggi **~1.9 GiB used + 657 MiB swap**. Vincolo RAM confermato e **più stretto**.

---

## 3. Top processi RSS

| PID | COMMAND | RSS | %MEM | Note |
|-----|---------|----:|-----:|------|
| 2034035 | java | 600460 kB | 15.2 | GraphHopper 11.0 |
| 2645184 | python3 | 250800 kB | 6.3 | `goi-dflight-helper` produzione `:8010` |
| 1470 | MainThread (node n8n) | 245084 kB | 6.2 | container `root-n8n-1` |
| 2481045 | flask | 120076 kB | 3.0 | `goi-nav-proxy` |
| 2618098 | systemd-journal | 83488 kB | 2.1 | |
| 1508 | n8n task-runner | 68636 kB | 1.7 | |
| 2456242 | tailscaled | 53260 kB | 1.3 | |
| 2882272 | containerd | 47676 kB | 1.2 | |
| 2765652 | python3 | 46036 kB | 1.1 | `goi-ors-gateway` `:8020` |
| 2643028 | python3 | 21408 kB | 0.5 | **leftover** ATM09 candidate `:8011` |
| 2899140 | python3 | 20836 kB | 0.5 | `goi-gis-app` http.server `:8000` |

---

## 4. Servizi GIS / n8n / Docker / Tailscale

| Unit | is-active | SubState | MemoryCurrent | MemoryPeak | ActiveEnterTimestamp |
|------|-----------|----------|---------------:|------------:|----------------------|
| `goi-nav-proxy` | active | running | ~110 MiB | ~115 MiB | 2026-08-07 12:03 UTC |
| `goi-gis-app` | active | running | ~10 MiB | ~14 MiB | **2026-08-21 18:46:55 UTC** (deploy MAP-CENTER 244, non questo task) |
| `goi-graphhopper` | active | running | **~604 MiB** | **~687 MiB** | 2026-07-29 00:12 UTC |
| `goi-ors-gateway` | active | running | ~34 MiB | ~34 MiB | 2026-08-18 02:46 UTC |
| `goi-dflight-helper` | active | running | ~239 MiB | ~257 MiB | 2026-08-13 00:22 UTC |
| `nginx` | active | running | — | — | 2026-08-20 06:09 UTC |
| `docker` | active | running | — | — | 2026-06-16 18:51 UTC |
| `tailscaled` | active | running | — | — | 2026-08-07 00:38 UTC |

**n8n / Docker**

- Container: `root-n8n-1` · `Up 2 months` · bind `127.0.0.1:5678->5678/tcp`
- `docker stats`: CPU **0.13%** · MEM **322.4 MiB / 3.756 GiB (8.38%)**
- Engine: `docker.io` **29.1.3** · `containerd` **2.2.1** (pacchetti Ubuntu, non Docker CE)

**Tailscale**

- versione **1.102.2** (upgradable → 1.102.3)
- `tailscale serve status`: **No serve config** (ORS resta su nginx `:443` Tailscale IP)
- 5 nodi tailnet; VPS online; 1 Windows idle; 3 offline. Nessun serve HTTPS Tailscale.

**Failed systemd**

- 1 unit failed: transient `run-rf41dc22f12bf4048b0597b3db7a414df.service` (2026-08-16) — leftover probe `/tmp/atm09-rulemeta…/probe2.py` SyntaxError. **Non** è un servizio GIS di produzione. Non ripulito (read-only).

**Leftover operativo**

- PID 2643028: `python3 goi_dflight_helper.py --config /tmp/goi-dflight-atm09-cand/config.toml` in ascolto su **`100.114.7.53:8011`**. `/status` → `EMPTY` (non è il helper LIVE). Cwd `/tmp/goi-dflight-atm09-cand`. Non killato (fuori scope).

---

## 5. Porte in ascolto (`ss -ltnp`) — sintesi

| Bind | Porta | Processo | Ruolo |
|------|------:|----------|-------|
| `0.0.0.0` / `[::]` | 22 | sshd | SSH pubblico |
| `0.0.0.0` / `[::]` | 80 | nginx | HTTP pubblico |
| `100.114.7.53` | 443 | nginx | TLS Tailscale (ORS gateway) |
| `100.114.7.53` | 5000 | flask | Nav/GSAT proxy |
| `100.114.7.53` | 8000 | python3 | GIS static |
| `100.114.7.53` | 8010 | python3 | D-Flight helper LIVE |
| `100.114.7.53` | 8011 | python3 | leftover ATM09 candidate |
| `127.0.0.1` | 8020 | python3 | ORS gateway loopback |
| `100.114.7.53` | 8989 | java | GraphHopper app |
| `127.0.0.1` | 8990 | java | GraphHopper admin (localhost-only) |
| `127.0.0.1` | 5678 | docker-proxy | n8n |
| `127.0.0.53` / `.54` | 53 | systemd-resolve | DNS locale |
| `127.0.0.1` | 34389 | containerd | debug/API locale |
| `100.114.7.53` | 47048 | tailscaled | Tailscale magicsock |

Nessun GraphHopper/ORS/D-Flight/GIS in ascolto sull’IP pubblico oltre SSH/nginx:80.

---

## 6. Endpoint GET (nessun POST / nessun refresh)

| Target | Esito |
|--------|--------|
| GIS `http://100.114.7.53:8000/coordinate_converter%20Claude.html` | HTTP **200**, `Content-Length: 10848088`, SimpleHTTP Python 3.12.3. Repo VPS HEAD `6d0b78a0a67b9fc804a387d1fc37f30c85b0ca69` (LIVE **244**). |
| Proxy `http://100.114.7.53:5000/status` | JSON OK; `last_error: null`; `tokens_ok: true`; gsat version_source `discovery` (nessun token stampato). |
| GraphHopper `http://100.114.7.53:8989/info` | version **11.0**, elevation true, 4 profili (`hiking`, `hiking_easy`, `mtb_touring`, `mtb_trail`), `import_date=2026-07-28T23:39:23Z`. |
| ORS `http://127.0.0.1:8020/ors/status` e `https://ubuntu.tailc01234.ts.net/ors/status` | `status=ready`, version `0.1.0`, `secret=PRESENT` (solo flag, **nessun valore**), profili `cycling-mountain` / `foot-hiking` / `foot-walking`. |
| D-Flight `http://100.114.7.53:8010/status` | `READY`, helper **0.1.3**, 841 feature, dataset_available true. Nessun POST. |
| leftover `:8011/status` | `EMPTY` (non produzione). |

---

## 7. APT / aggiornamenti / reboot

**Side effect ammesso:** `apt-get update` OK (indici Docker + Ubuntu + Tailscale). **Nessun pacchetto installato/rimosso.**

- `apt list --upgradable`: **25** pacchetti.
- `apt-get -s upgrade`: **21 upgraded, 0 newly installed, 0 to remove, 4 not upgraded** (phased: `console-setup`, `console-setup-linux`, `keyboard-configuration`, `snapd`).
- Autoremove simulato (NON eseguito): `libfwupd2`, `libgusb2`.

**Reboot richiesto: SÌ**

```
*** System restart required ***
```

`/var/run/reboot-required.pkgs` (già installati in precedenza, flag del 2026-08-19 06:46 UTC):

- `linux-image-6.8.0-134-generic` … **`linux-image-6.8.0-138-generic`**
- `linux-base`, `libc6`

`needrestart -b`: `NEEDRESTART-KSTA: 3` (kernel outdated: 124 → 138). Servizi già segnalati per restart (da libc/kernel precedente, **non** da questo task): `containerd`, `docker`, `dbus`, `systemd-logind`, `unattended-upgrades`, getty.

`unattended-upgrades.service`: enabled, active (shutdown helper dal boot 2026-06-16). Ha già applicato kernel/libc; manca il reboot.

### Pacchetti sensibili nel set upgradable attuale

| Famiglia | Nel `apt upgrade` simulato? |
|----------|-----------------------------|
| kernel | **No** (già installato 138; manca reboot) |
| systemd | No |
| docker engine / containerd | **No** (`docker.io` 29.1.3 e `containerd` 2.2.1 invariati) |
| docker plugins | **Sì** — `docker-buildx-plugin` 0.34.1→0.36.1, `docker-compose-plugin` 5.1.4→5.5.0 |
| tailscale | **Sì** — **1.102.2 → 1.102.3** |
| nginx | No (1.24.0-2ubuntu7.17) |
| openssl | No (3.0.13-0ubuntu3.12) |
| python interpreter | No (3.12.3); solo `python3-apport` / `python3-problem-report` |
| java/jdk | No (Temurin 21.0.11+10 bundled GraphHopper) |

Altri nel simulato: apport, iproute2, open-vm-tools, krb5 libs, plymouth, fwupd, kpartx, multipath-tools.

---

## 8. Classificazione rischio FUTURO aggiornamento: **MEDIUM**

Motivazione evidence-based:

1. Il set `apt upgrade` corrente **non** tocca kernel, systemd, nginx, openssl, docker-engine, Java — è prevalentemente userland + plugin Docker + **Tailscale patch**.
2. Il rischio vivo dell’upgrade APT è **Tailscale 1.102.2→1.102.3**: un restart di `tailscaled` interrompe brevemente tutti i bind su `100.114.7.53` (GIS, proxy, GH, D-Flight, nginx:443).
3. Un **reboot è già dovuto** (kernel 124→138, libc6 già applicata, docker/containerd già in needrestart). Non è causato da questo `apt upgrade`, ma è il vero evento di manutenzione.
4. RAM ~49% used + **swap 64%**: GraphHopper (~604 MiB) + D-Flight (~239 MiB) + n8n (~322 MiB Docker) convivono su 3.8 GiB. Post-reboot serve soak; non è LOW.
5. Disco 14% e load 0.00: niente pressione I/O/CPU.
6. Leftover `:8011` e unit failed transiente: rumore, non blocco; un reboot li eliminerà.

**Si può ragionevolmente eseguire `apt upgrade`?** Sì, con consapevolezza del blip Tailscale. Non in questo task.

**Serve maintenance window?** Sì se si include il reboot (consigliato: stessa finestra). Per il solo `apt upgrade` una finestra breve è comunque raccomandata per Tailscale.

**Reboot probabile?** **Già richiesto** indipendentemente. L’upgrade APT attuale da solo probabilmente **non** aggiunge un nuovo kernel; il flag reboot resta finché non si riavvia.

**Verifiche post-update (GET-only):**

- `systemctl is-active` dei cinque `goi-*` + `nginx` + `docker` + `tailscaled`
- `docker ps` n8n
- `tailscale status` / `tailscale ip -4`
- GET: GIS `:8000`, proxy `/status`, GH `/info`, ORS `/status`, D-Flight `/status`
- `ss -ltnp` (bind ancora sul Tailscale IP, non su pubblico)
- `free -h` / swap dopo soak GraphHopper

---

## 9. Cosa questo task NON ha fatto

- Nessun `apt upgrade` / `full-upgrade` / `autoremove`
- Nessun reboot / shutdown
- Nessun `systemctl restart` / `docker restart`
- Nessun deploy / `git pull` sui runtime VPS
- Nessuna modifica firewall / ACL / Tailscale serve / nginx / unit systemd
- Nessuna modifica a FRONTIER, monolite, WU prodotto
- File temporaneo `/tmp/df-status-ro.json` rimosso (parse fallito per quoting; status ri-letto via curl)

---

## 10. Note per GPT / operatore

- Prodotto GIS **invariato da questo task**. LIVE osservato sul VPS: tip `6d0b78a` / build **244** (deploy MAP-CENTER concorrente ~18:46 UTC, prima del census).
- Gate prodotto: **MAP-CENTER-VIEWPORT-AWARE-A** QA FINALE PENDING (non toccato).
- `docs/INFRA_VPS.md` resta snapshot 2026-06-16 (RAM/swap/kernel stale); **non** aggiornato in questo pass.
