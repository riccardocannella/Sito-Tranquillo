Database per ecommerce
======================

Utenti
------

Gli utenti sono identificati tramite la loro email. Deve essere presente
un campo password (se possibile con certi criteri di sicurezza). Oltre a
questo, sono necessari nome e cognome, indirizzo, numero di telefono,
data di iscrizione, boolean per capire se è un admin.

Prodotti
--------

I prodotti sono identificati tramite un codice a barre. Devono essere
presenti anche il campo prezzo, nome, descrizione lunga, descrizione
corta, disponibilità in magazzino, peso, data di inserimento nel db, url
delle immagini (thumbnail e fullsize). Bisogna istruire il motore di
Mongo per usare indici addizionali basati sulle categorie.

Categorie
---------

Usare la struttura come su
[*https://www.infoq.com/articles/data-model-mongodb*](https://www.infoq.com/articles/data-model-mongodb)
. In soldoni, macrocategorie e sottocategorie.

Fornitori
---------

I fornitori sono identificati tramite la loro P.Iva. Ogni fornitore ha
poi ragione sociale, indirizzo, numero di telefono, email.

Tabella delle forniture
-----------------------

Una fornitura è identificata dalle coppie id\_fornitore – id\_prodotto
per capire quali fornitori possono vendere determinati prodotti. Più
fornitori possono fornire lo stesso prodotto. È necessario anche un
campo prezzo unitario ed eventualmente il numero minimo di prodotti
ordinabili da quel fornitore.

C’è da capire se usando MongoDB è meglio inserire qualcosa come
“prodotti\_forniti:{…}” direttamente nei fornitori.

Ordini
------

Gli ordini sono caratterizzati da un numero univoco e progressivo.
Contengono un array di oggetti (contenente codice a barre, quantità di
quel tipo di oggetto, prezzo cumulativo per quell’oggetto), lo status
dell’ordine (“ricevuto”, “preparato”, “spedito”), totale dell’ordine,
indirizzo di spedizione, metodo di pagamento.

Carrelli
--------

Un carrello è associato a un utente. Se l’utente non è loggato, prima di
poter effettuare l’ordine deve loggarsi. Finché non si logga, il
carrello è mantenuto attivo tramite una sessione a tempo. Il carrello
contiene un array di oggetti simile a quello degli ordini.
