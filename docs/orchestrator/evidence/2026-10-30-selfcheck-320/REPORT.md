# Selfcheck a 320 px — fixture e prove mirate

## Stato

Base congelata `before.html` SHA-256 `e5f01fcdd299c90c559121fc7ee8627f85dedbdae76021a9c1822a3dcbc5c2c5`; candidato isolato `stage/coordinate_converter Claude.html` SHA-256 `af143396860a3b9230b20418a304464a2648e43ad59eeef138ec227bfffb36db`. Nessuna modifica al checkout condiviso o al VPS. La patch `combined-320.patch` SHA-256 `0b3a65ad7f54a1535433eff196074be5c3743e90ed7806bc67719b787244fbbd` si applica con `git apply --check` sulla copia esatta della base. Le modifiche sono tutte all'interno di tre funzioni di test: nessuna modifica al comportamento operativo dell'app.

Patch separabili rispetto alla medesima base: `hita-fixture.patch`, `ga1-overflow.patch`, `legend-fixture.patch`. La modifica GA1 riprende la proposta `work/selfcheck-audit/ga1-adaptive-overflow.patch` e rafforza la verifica di raggiungibilità del pulsante e il test di apertura/ripristino.

## Esiti

Chromium headless locale, contesti separati e rete non locale bloccata. Ogni percorso `?debug` attende esplicitamente il messaggio di completamento per un massimo di 20 secondi; timeout è errore della prova. La chiamata `GOIDflight.selfTest()` è eseguita in un nuovo contesto dopo 600 ms. Risultati della base e della prima versione: `results.json`; risultati finali `updated-results.json`, script `verify-updated.cjs`. La prima versione è conservata in `previous-candidate.html` SHA `eba7bb47e710282bf71c990e974d624457a9a4f035b9fef497eb7e6ed0a4acdc`.

| Viewport | Base: check falliti/totale | Candidato: check falliti/totale | Assert `?debug`, base → candidato |
| --- | ---: | ---: | ---: |
| 320×720 | 5/922 | 0/924 | 1 → 0 |
| 390×844 | 0/922 | 0/922 | 0 → 0 |
| 1280×720 | 0/919 | 0/919 | 0 → 0 |
| 1920×900 | 0/919 | 0/919 | 0 → 0 |

A 320 ci sono due controlli aggiuntivi reali di accesso/ripristino dell'overflow. A viewport più ampi nessun overflow è presente in quello scenario e tali due controlli non vengono emessi. Nessun pageerror. Il candidato ha stampato il messaggio di completamento positivo a ogni viewport dopo che gli assert del percorso debug sono risultati zero; resta evidenza limitata a questi browser, condizioni e byte e non è un'approvazione di deploy o una certificazione di altre funzioni.

## Cause e correzioni

- **HitA_FIX1_info_above_efp / HitA_FIX1_single_dispatch_info.** Nella sequenza aggregata il pannello D-Flight aperto copre il punto dei layer sintetici a 320. In `../selftest-fix/hita-sequence.json` l'hit intercetta elementi del pannello, mentre `../selftest-fix/hita-diag.json` mostra i controlli isolati riusciti. Durante i due test si nasconde sincronicamente il solo pannello e si ripristina la visibilità in `finally`. Rimangono `elementFromPoint`, i layer effettivi, la priorità del target e il dispatch singolo; nel secondo caso si ripristinano le callback anche in caso di eccezione. Il test riguarda la mappa libera, non click attraverso un pannello visibile.
- **DOCK_GA1_all_chips_rendered.** A 320 lo stato contiene tre pannelli, rappresentati da due chip e una voce nel menu. Il vecchio conteggio escludeva il menu. Il nuovo `DOCK_GA1_all_panels_represented` richiede una sola rappresentazione per ogni pannello, nessun extra e il pulsante overflow realmente visibile e al suo punto di hit. `DOCK_GA1_overflow_menu_reachable` controlla espansione aria, visibilità, geometria nel viewport e punto di hit della voce; `DOCK_GA1_overflow_restores_panel` attiva la voce, verifica il pannello ripristinato e lo rimette minimizzato per continuare la suite. In `results.json` la voce provata è `layersPanel`. La prova browser indipendente `keyboard.cjs` / `keyboard.json`, eseguita sulla versione precedente SHA eba7 (la correzione successiva restringe soltanto la selezione del pannello fixture), usa realmente Enter per aprire il menu e per ripristinare la voce: aria-expanded true, voce x=159 y=193 larga 146, pannello aperto e non minimizzato. Non copre ogni dispositivo assistivo.
- **WSF1_A_both_sbs / WSF1_B_solo_df_right.** La logica corrente prevede impilamento quando lo spazio laterale manca; il test storico imponeva sempre affiancamento e spostamento strettamente a destra. `geometry.json` rileva a 320: D-Flight x=132..255,734 y=322,625..376,625; ATM x=120..256,406 y=386,625..606,625, con 10 px tra rettangoli ed entrambi nell'area utile/viewport entro tolleranza 1 px. A 390 e 1280 i rettangoli sono affiancati. Il nuovo `WSF1_A_both_fit` richiede entrambi visibili, interamente nella zona sicura/viewport e divisi dal gap previsto, orizzontale o verticale. Il secondo test mantiene il ritorno alla posizione solo corretta e il movimento verso destra per il caso affiancato; per il caso impilato ammette la stessa posizione iniziale, senza spostamenti a sinistra, e verifica il rettangolo solo. I nomi modificati sono dichiarati per confronti per nome.

## Controlli negativi e limiti

`negative.cjs` / `negative.json`, eseguito sulla versione precedente SHA eba7, modifica temporaneamente in memoria il bersaglio di `elementFromPoint` facendolo puntare allo strato sottostante: entrambi i controlli HitA falliscono. Simula separatamente legende sovrapposte e posizionate fuori viewport: il nuovo check di geometria fallisce in entrambi i casi. Disattiva temporaneamente il toggle del menu: entrambi i controlli di apertura e ripristino falliscono. Le sostituzioni sono ripristinate e riguardano solo il browser di prova, non il file.

Le prove geometriche e da tastiera non attestano il comportamento su hardware touch o screen reader, né tutte le dimensioni e orientamenti. Il controllo dell'overflow effettua un ripristino e successiva minimizzazione nell'ambito della suite esistente; la funzione di test ripristina lo stato precedente nel suo cleanup. I layer di prova ATM sono sintetici e non validano servizi esterni. Eventuale integrazione richiede revisione del diff e nuova esecuzione sul monolite integrato effettivo.

## Correzione per una sessione pre-popolata

Il reviewer ha osservato che scegliere `overflowItems[0]` poteva ripristinare un pannello dell'utente già minimizzato. Il test ora seleziona esclusivamente Favoriti, Misura o Livelli se quel pannello era prima **chiuso e non presente** nell'array dei minimizzati. Se nessun elemento overflow idoneo esiste, il test di ripristino resta esplicitamente rosso (`no_safe_fixture`) invece di operare su un pannello utente o dichiarare un successo non provato. La scelta non modifica le voci di routing o traccia.

`preserve.cjs` / `preserve-results.json` testa il candidato finale con Routing e Traccia già aperti e minimizzati: l'array, le loro proprietà `open`/minimized e gli oggetti stato di routing/traccia confrontati risultano invariati; nessuna chiamata a `gisRestoreMinimizedPanel` o `gisMinimizePanel` sui due ID. La fixture ripristina solo Favoriti, creato dal test, e lo minimizza di nuovo. Questa osservazione non copre tutti i dati, timer o sessioni possibili. I negativi nel medesimo file simulano separatamente una voce mancante e una duplicata: `DOCK_GA1_all_panels_represented` fallisce in entrambi.

Nella sessione pre-popolata alcuni controlli storici GA1 assumono comunque un dock vuoto (`pilot_chip_favorites` e `fifo_3plus`) e falliscono; l'esecuzione mirata altera inoltre la stringa sorgente della funzione avvolta dal recorder, facendo fallire il controllo strutturale storico `workbench_whitelist_present`. Questi risultati non vengono presentati come PASS generale. Il test storico GD già esistente può anch'esso scegliere una voce overflow dell'utente e compiere operazioni su di essa: tale rischio preesistente non è risolto dalla presente patch. L'intero selfcheck può già aprire/chiudere altri pannelli e non è dimostrato privo di effetti su sessioni attive arbitrarie.
