# SITO TRANQUILLO
Sito specializzato nella vendita di estrattori di succo di tutti i tipi, approvato dall'Associazione Mamme italiane.

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
Questo progetto è sotto la licenza GPL V3.0 - guardare [LICENSE.md](LICENSE.md) per dettagli
