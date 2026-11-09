# Build 280 — deploy del solo runtime GIS

**DEPLOY_PASS — 9 novembre 2026, ore 14:32:47 Europe/Rome.** Fast-forward del clone VPS al commit richiesto e riavvio del solo servizio GIS. Nessuna reinstallazione o riattivazione dell'infrastruttura HTTPS.

## Identità distribuita

| Oggetto | Valore verificato |
| --- | --- |
| Commit runtime | `c33f58c956e9630b03f9ff86eb35eccd35879a4a` |
| Blob Git del monolite | `d2ec773205da2a6d4bf954f635765eb872ec646c` |
| Build servita | **280** |
| Dimensione | **11.108.654 byte** |
| SHA-256 | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| Clone VPS | `/root/local-files/handoff-runtime/cursor-coordinate-converter` |
| HEAD del clone dopo il deploy | `c33f58c956e9630b03f9ff86eb35eccd35879a4a`, branch `main`, working tree pulito |
| URL HTTPS | `https://ionos-n8n-new.tailc01234.ts.net/gis` |
| Backup e registro | `/var/backups/goi-gis-runtime/20261109T133117Z` |

Questa è la variante definitiva indicata dal GO del parent; il precedente candidato di staging SHA `1e6c11cf…` resta storico. Il commit sopra identifica il runtime distribuito, non eventuali successivi commit documentali di `origin/main`.

## Preflight

Alle **14:31:17 Europe/Rome** il clone risultava pulito su `main` al commit `7a2c88b1b292ff0b46a2f90b1115143673fe72f1`. Il monolite locale, HTTP8000 e HTTPS `/gis` corrispondevano alla Build 279 attesa, SHA `bb6db0079ad5376e256191ef5a32c51b21c53fab8de653454c184d41f673f253`.

`git ls-remote origin refs/heads/main` ha restituito il commit richiesto `c33f58c…`. Dopo fetch, FETCH_HEAD e origin/main concordavano; è stata verificata la relazione di antenato del vecchio HEAD. Blob, byte, SHA e numero di build della nuova revisione sono stati controllati prima di modificare il checkout. Le 74 differenze riguardavano esclusivamente il monolite e file sotto `docs/`.

Sono stati acquisiti lo stato dei servizi, i listener condivisi, sei hash dell'infrastruttura HTTPS e le risposte degli endpoint esistenti. La copia completa del runtime precedente e il registro sono conservati nella directory privata di backup. [Preflight originale](runtime280-preflight.json).

## Operazioni eseguite

1. Nuova verifica di working tree pulito, HEAD atteso, main remoto e configurazioni HTTPS.
2. `git merge --ff-only c33f58c956e9630b03f9ff86eb35eccd35879a4a` nel clone canonico.
3. Verifica del monolite aggiornato: byte, SHA, blob Git e checkout pulito.
4. `systemctl restart goi-gis-app`, unico riavvio di servizio in questa attività.
5. Verifica byte del runtime via HTTP e HTTPS, stato dei servizi, hash configurazioni, listener ed endpoint condivisi.

**Nessun errore, nessun rollback, nessun force push o reset forzato.** Il registro [runtime280-deployed-state.json](runtime280-deployed-state.json) contiene i comandi e i relativi risultati. Il [riepilogo compatto](deployment-summary.json) contiene le identità e i controlli conclusivi.

## Verifica dopo il deploy

| Percorso | HTTP | Build | Byte | SHA-256 |
| --- | ---: | ---: | ---: | --- |
| Runtime originale su porta 8000 | 200 | 280 | 11.108.654 | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |
| HTTPS `/gis` | 200 | 280 | 11.108.654 | `70553e5270ad7049ae8c762c97abded9f2cd3d5fc986a776748b518867a7ffde` |

HTTPS usa il controllo ordinario della catena e del nome del certificato, senza bypass TLS. Entrambe le risposte coincidono con il monolite del commit richiesto.

| Servizio | PID prima | PID dopo | Risultato |
| --- | ---: | ---: | --- |
| GIS | 2243979 | **1838127** | active; unico servizio riavviato |
| Nginx master | 209145 | 209145 | active, invariato |
| Gateway ORS | 1780876 | 1780876 | active, invariato |
| Proxy HTTPS443 | 1780843 | 1780843 | active, invariato |

Listener e PID di GraphHopper, catalogo e pannello VPS sono invariati. I sei hash dell'infrastruttura HTTPS coincidono prima e dopo: server Nginx, sorgente gateway ORS, sorgente proxy, unità systemd e due snippet. Le risposte ORS con vecchio/nuovo Origin, catalogo e pannello VPS mantengono status, byte, tipo e header confrontati con la baseline.

## Perimetro e gate successivo

- L'esecuzione segue il GO del parent riferito al commit e allo SHA esatti, nell'ambito della standing authorization del solo runtime GIS.
- Questa attività non ha effettuato POST ai provider e non dichiara PASS della UI o dell'intero routing.
- Il gate browser dopo il deploy è assegnato al collega, con verifica obbligatoria dello SHA prima dei POST. Il suo esito resta un'evidenza distinta.
- Non sono stati migrati, letti o cancellati dati browser dell'utente. Il percorso HTTP originale rimane disponibile e serve anch'esso la Build 280.
- Tailscale, Nginx, gateway ORS, proxy HTTPS e altri provider non sono stati riavviati o riconfigurati durante questo deploy.

I sette file originali trasferiti sono identificati nel [manifest di trasferimento](transfer-manifest.json). Il [manifest complessivo](artifact-manifest.json) conserva l'identità degli artefatti di questa consegna.
