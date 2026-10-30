# Verifica successiva risorse

La QA file:// riportava tre `ERR_FILE_NOT_FOUND` nel checkout sparse. I percorsi erano già presenti nell'albero Git; sono stati inclusi nel checkout dopo la QA. Richieste HTTP HEAD alla versione LIVE sul VPS hanno risposto 200 per `/assets/layers.svg`, `/assets/measure-polygon.png` e `/assets/waypoint-map.png`, con content type coerente. Queste risposte non equivalgono a un controllo visivo sul candidato non distribuito.
