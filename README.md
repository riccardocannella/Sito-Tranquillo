# SITO TRANQUILLO
Per far partire il server, eseguire il comando
```
npm start
```
che si occuperà di installare tutte le dipendenze dell'applicazione e di eseguire il file che creerà un server.



## Requisiti
1) Creare un account su heroku.com
2) Scaricare heroku-cli
3) Creare un account su mlab.com
4) Clonare questo repo in una cartella locale
5) Spostarsi nella cartella locale del progetto in una finestra console
---- Fase mLab ----
6.1) Creare un db su mLab, anche di quelli gratuiti
6.2) Creare username e password per accedere al db
6.3) Modificare il campo "urlRemoto" in config/db.js con quello di mLab
----  Fase Heroku ----
7.1) Eseguire heroku login
7.2) Eseguire heroku create
7.3) Eseguire git push heroku master