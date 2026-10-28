# FIX8 — deploy GIS-only verificato, 2026-10-28

Runtime candidate762fb1605a7c20b3b7bd21a6b0cfa1c04f8e4739, build265, blob5da70951b43300f5165448049ba8c20a2f8ae867.
Repo VPS aggiornato fast-forward a a31136b8bc14141993ec7a0f8dae27e8bf48ef66, working tree pulito.
SHA256 file e risposta HTTP: 0c39ce77e27b2d0116faa0638eec30020fd0e2865eab14bb024a487c92357145.
URL: http://100.99.54.93:8000/coordinate_converter%20Claude.html

## Preflight e preservazione
IP pubblico31.70.139.73 confermato dall'operatore; ED25519 SHA256:XYGGrNMpzx5xElPgEpYah7zolKSifkFFNlNK6HjqTEQ coincide con console IONOS e known_hosts.
Vecchio alias ionos-n8n punta217.160.71.145: non usato, configurazione locale lasciata invariata.
Tailnet nuovo100.99.54.93 online, vecchio100.114.7.53 offline.
Base VPSf215011, solo monolite modificato con6 sostituzioni endpoint. Backup runtime effettivo SHA25660a51d9620d2f71787357f6460da20ca5aee48c37550400f23061275f366a0f4.
Backup /tmp/goi-fix8-20261028-predeploy/runtime-before.html; patch locale e base salvate nello stesso percorso. Stash Git nominato FIX8 predeploy verified six endpoint migration changes, conservato.
Dopo backup e verifica identità: stash del solo file noto, fast-forward al commit docs pinnato, confronto hash file+HTTP. Nessun force/reset, nessun cambiamento altri repository.

## Servizi condivisi
Prima/dopo stessi MainPID e active: GIS1699004, GraphHopper4095839, ORS1699002, proxy1699043.
Docker invariati: storefront healthy, vps-status healthy, preview-web, rustdesk hbbs/hbbr, litellm, n8n, postgres healthy (uptime invariati).
Nessun restart, modifica Tailscale, SSH, ACL/firewall, container, porte o infrastruttura.
Il pull ha sincronizzato documentazione Git oltre al monolite; nessun eseguibile di altri servizi cambiato.

## Routing preflight read-only
/info GraphHopper11.0 attesta road_environment [OTHER,ROAD,FERRY,TUNNEL,BRIDGE,FORD] e quattro profili hiking/hiking_easy/mtb_touring/mtb_trail. Nessuna patch routing o ricostruzione grafo.

Deploy tecnico PASS. ABQA HTTP separata in postdeploy/. QA operatore ancora non attestata.
