# QA tecnica addizionale — PC del lavoro, Build293

**Data:** 2026-11-12 12:16:59 Europe/Rome. Test eseguito con plugin **Remote Desktop Commander originale** su dispositivo **DESKTOP-DPIJL64** Windows (0.3.2), non AsusDesktop. Il dispositivo è stato verificato ONLINE con list_devices/get_config. Edge disponibile sul PC lavoro. HTTPS /gis GET 200 e 11.121.119 byte ricevuti.

**Metodo:** Python 3.12 e protocollo CDP locale su Microsoft Edge headless, profilo temporaneo isolato sotto C:\Users\Utente\AppData\Local\Temp, viewport 1440×1000; azioni click mouse e tasto Escape reali nel browser. Solo GET/HEAD same-origin permessi, richieste a provider terzi e mutative bloccate; 0 POST. Nessuna finestra/browser dell'operatore chiusa, nessun file di lavoro alterato. Profilo temporaneo eliminato dopo il test.

**Risultato 21/21 PASS**, 0 FAIL:
- Mappe Offline: Build293, apertura UI, minimizzazione, Poligoni visibile, Escape chiude Poligoni mantenendo Offline minimizzata (5/5 PASS).
- Cerca: stessa sequenza, ricerca minimizzata preservata (5/5 PASS).
- Cronologia: stessa sequenza, cronologia minimizzata preservata (5/5 PASS).
- D-Flight: build confermata, apertura menu Layers, minimizzazione, Poligoni visibile e Escape lascia D-Flight minimizzato (5/5 PASS).
- Zero POST (1/1 PASS), **301 richieste terze bloccate** in totale.

Questa QA tecnica sul PC del lavoro è separata sia dalla precedente Automated Browser QA HTTPS 38/38 PASS condotta da AsusDesktop sia dal PASS operatore. Non è screen-sharing visuale umano né un test di tutti i 38 dialog GIS. Nessuna modifica al runtime, all'OPSEC, ai dati o al telefono.
