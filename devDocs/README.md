Specifica PROVVISORIA Database per ecommerce
======================

Admin
-----

Gli amministratori sono dei normali utenti che hanno un flag "admin" impostato a true. Ogni volta che si accede a una pagina amministrativa si controlla che l'utente sia loggato e che sia effettivamente un admin, altrimenti si viene reindirizzati a una pagina "401 unauthorized" nel primo caso o a una pagina "403 forbidden" nel secondo caso.

Utenti
------

Gli utenti sono identificati tramite la loro email. Deve essere presente
un campo password (se possibile con certi criteri di sicurezza). Oltre a questo, sono necessari nome e cognome, indirizzo, numero di telefono.
Opzionalmente può contenere più indirizzi di spedizione.

Carrelli
--------

Ogni riga di un carrello è identificata da un id interno di uno specifico utente.
Il carrello è l'insieme delle righe con l'id interno, l'id prodotto, la quantità,
prezzo unitario.
Ha anche uno stato (in pagamento o standard). 

Prodotti
--------

I prodotti sono identificati tramite un codice alfanumerico. Devono essere
presenti anche il campo prezzo, nome, descrizione lunga, descrizione
corta, disponibilità in magazzino, scorta minima, peso, nome dei file delle immagini. Bisogna istruire il motore di Mongo per usare indici 
addizionali basati sulle categorie.
Contiene anche altri due campi per l'impegno nei carrelli e gli impegni in pagamento.

Categorie
---------

Usare la struttura come su
[*https://www.infoq.com/articles/data-model-mongodb*](https://www.infoq.com/articles/data-model-mongodb)
. In soldoni, macrocategorie e sottocategorie.

Ordini
------

Gli ordini sono caratterizzati da un numero univoco e progressivo.
Contengono un array di oggetti (contenente codice a barre, quantità di
quel tipo di oggetto, prezzo cumulativo per quell’oggetto), lo status
dell’ordine (“ricevuto”, “preparato”, “spedito”) e tracking code, totale dell’ordine,
indirizzo di spedizione, metodo di pagamento.
