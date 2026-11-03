# Deploy Build 271 — esito verificato

Data: 2026-11-03. L’utente ha autorizzato la pubblicazione di ogni nuova versione GIS su GitHub e VPS. Ambito del deploy: fast-forward del repository GIS e riavvio del solo servizio `goi-gis-app`.

## Artefatto

- Commit GitHub/VPS: `173611f27299662bcc203212d063158ee411a5cf`.
- Build: `GIS-IOS-LAYER-DISMISS-A`, 271.
- SHA-256 runtime: `7f96e58ea912cd9c017c225b1d12276f5ef397c55b3e4ee6c8bfbd11c5b76ea8`.
- Link tailnet: [TMART GIS Build 271](http://100.99.54.93:8000/coordinate_converter%20Claude.html?v=271).
- Script deploy: [deploy-gis-build271.sh](deploy-gis-build271.sh), SHA-256 `B3833ED3AF21C01EADBA7530B4F0AB8956175765CD763E48A1FFBB7EB46AA7D0`; `bash -n` PASS.

## Preflight strict SSH

Connessione a IONOS `31.70.139.73` con `StrictHostKeyChecking=yes` e chiave nota, come `root`. Prima del deploy:

- branch `main`, HEAD `cd575bc7f7521f669223e1696e079ab0da57426f`, worktree pulito;
- runtime Build 270 SHA-256 `704022b03f7e0b314f0ce88f64cb26c9641739e68d70b41319427d7dad01b544`;
- GIS, proxy, GraphHopper, ORS e n8n attivi; PID n8n `2945282`.

L’account `ubuntu` non accetta la chiave disponibile; `root` è stato autenticato con strict host checking. L’alias SSH locale `ionos-n8n` resta sull’IP vecchio e non è stato usato.

## Esito deploy e verifica indipendente

Lo script ha validato il tip esatto di GitHub `main`, il commit target, il blob runtime e l’hash prima del fast-forward. Ha riavviato solo `goi-gis-app`; un primo tentativo HTTP durante il riavvio ha fallito, il retry dello script ha avuto successo.

```text
DEPLOY=PASS
COMMIT=173611f27299662bcc203212d063158ee411a5cf
RUNTIME_SHA=7f96e58ea912cd9c017c225b1d12276f5ef397c55b3e4ee6c8bfbd11c5b76ea8
HTTP_SHA=7f96e58ea912cd9c017c225b1d12276f5ef397c55b3e4ee6c8bfbd11c5b76ea8
BACKUP=/tmp/goi-gis-mobile-layer-271.DrPnyv
OTHER_SERVICES=UNCHANGED
MainPID=322827
ActiveState=active
SubState=running
```

Una sessione SSH strict successiva ha verificato branch `main`, HEAD/commit `173611f…`, worktree pulito e corrispondenza esatta fra runtime e HTTP SHA-256. L’applicazione ha restituito HTTP 200 dalla workstation, 11.036.744 byte e la label Build 271. GIS è `active/running`, PID `322827`; proxy PID `1699043`, GraphHopper `4095839`, ORS `1699002` e n8n `2945282` sono rimasti invariati e attivi.

## Limite

Il deploy è verificato. La correzione richiede ancora conferma funzionale sul telefono iOS: la QA automatica usa Edge/Chromium con touch emulato e inietta il `mousedown` tardivo; non registra gli eventi nativi di Safari o Chrome su iPhone.
