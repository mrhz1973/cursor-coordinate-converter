# Deploy GIS-only Build 293 — PASS

Data 2026-11-12 12:03:33 Europe/Rome. Esecutore: GPT con TMAR Desktop Commander Win da AsusDesktop, SSH al VPS.

- Git main baseline e320fde5b5e206a5684cb813829e49d9856241b2 (Build292), target codice 86d27e7707046ec9829f5be4ef2832aec86f4a6c sul main nuovo. Blob HTML f7ef7266bbf6d0b9912bc9f9d6f0c9f0336c7442, SHA256 b4bc346f74be303fa157bc8b7ebc80b532e50fec002edde55adf13ba64e3720e, 11.121.119 byte.
- Preflight branch clean, origin/main target corretto, whitelist delta monolite+FRONTIER+tre evidenze, hash base 292 verificato. Backup **/var/backups/goi-gis-runtime/20261112T105954Z-build293**, SHA della 292 verificata.
- Pull fast-forward main, unico restart goi-gis-app.service, PID dopo restart 210200, active. Nessuna modifica a Nginx/proxy/ORS/gateway o altri servizi.
- Smoke HTTP interno 8000 e HTTPS /gis: status 200, bytes 11.121.119 e SHA256 b4bc346f74be303fa157bc8b7ebc80b532e50fec002edde55adf13ba64e3720e esatti. Git monolite pulito.
- Nessun software installato, nessun endpoint di rete nuovo, nessun deploy mobile specifico. UI telefonica mantiene la vecchia priorità Escape grazie al predicato desktop.
- Deploy tecnico ≠ PASS operatore. [QA LIVE](QA-LIVE-293.md).
