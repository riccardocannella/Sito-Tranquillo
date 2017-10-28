# SITO TRANQUILLO
Sito specializzato nella vendita di estrattori di succo di tutti i tipi, approvato dall'Associazione Mamme italiane.

## User story implementate
### Basilari
* Come admin voglio poter accedere ad un’area privata tramite username e password
* Come admin voglio gestire le rimanenze e i re-ordini dei prodotti
* Il server deve inviare una email all’admin quando sta per terminare un prodotto
* Come admin voglio poter creare e inserire un nuovo prodotto (con proprietà come nome, descrizione, peso, ecc.)
* Come user voglio essere avvertito quando un prodotto terminato, risulta nuovamente disponibile.
### Aggiuntive
* Come user voglio avere la garanzia di avere le password cifrate
* Come user voglio poter recuperare la mia password attraverso la mia email di registrazione
* Come user voglio poter modificare i miei dati personali e poter cancellare il mio account
* Come user voglio poter ordinare i prodotti per nome, prezzo ascendente o prezzo discendente
* Come user voglio poter visualizzare la mia storia degli acquisti
* Come admin voglio poter gestire gli account utenti esistenti

## Per cominciare
Per far partire il server, eseguire il comando
```
npm start
```
che si occuperà di installare tutte le dipendenze dell'applicazione e di eseguire il file che creerà un server.



## Requisiti
### Accounts e utility
* Creare un account su heroku.com
* Scaricare heroku-cli
* Creare un account su mlab.com
* Clonare questo repo in una cartella locale
### Fase mLab
* Creare un db su mLab, anche di quelli gratuiti
* Creare username e password per accedere al db
* Modificare il campo ```urlRemoto``` in ```config/db.js``` con quello di mLab
###  Fase Heroku
* Spostarsi nella cartella locale del progetto in una finestra console
* Eseguire ```heroku login```
* Eseguire ```heroku create```
* Eseguire ```git push heroku master```

## Autori
* **Riccardo Cannella**
* **Corrado Petrelli**
* **Michele Biondi**
* **Andrea Salvatori**

## Licenza
Questo progetto è sotto la licenza GPL V3.0 - guardare [LICENSE](LICENSE) per dettagli
