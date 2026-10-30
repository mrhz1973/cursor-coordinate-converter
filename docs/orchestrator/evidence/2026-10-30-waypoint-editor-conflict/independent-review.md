# Review indipendente — concorrenza editor waypoint

Candidato `aa035f52dbd49fd74047798d9b661f16e0e50f722c5f49b3c883924c4dc73066` su base `b6f0fca...`: nessuna regressione bloccante dimostrata nei casi coperti. In browser isolato: 36 cambi di formato con spostamento concorrente; conflitti di coordinate/nome e cancellazione bloccano il salvataggio senza alterare punto e storage; bozza conservata.

Limite preesistente verificato: metadati legacy sconosciuti presenti in memoria vengono scartati dal caricamento al reload, che applica una whitelist; il test dell'autore con persistenza disattivata non dimostra la conservazione dopo il riavvio. Resta da trattare separatamente. Il confronto dei conflitti riguarda lo stato della pagina, non garantisce rilevamento fra schede o per aggiornamenti non acquisiti.
