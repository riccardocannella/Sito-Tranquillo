'use strict';

// Importo le librerie che andrò ad utilizzare 
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var UTENTI = 'utenti';


// Modello mongoose dell'utente
var mongoose = require('mongoose'),
    Utente = mongoose.model('Utente'),
    Prodotto = mongoose.model('Prodotto');

// Importo funzioni utili in generale e i file di configurazione
var utilities = require('../utilities/utilities');
var encryption = require('../config/encryption');
var mailer = require('../utilities/mailer');

/**
 * Fa riferimento al Database
 */
var db;
exports.setDb = function(extdb) {
    db = extdb;
};

/*--------------------------------------------------------------
|    Funzione: registraUtente()                                 |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        username : username del nuovo utente                   |
|        password : password del nuovo utente                   |
|        email: email del nuovo utente                          |
|        domanda_segreta: domanda per recupero account          |
|        risposta_segreta: risposta della domanda sopra         |
|                                                               |
|    Parametri restituiti in caso di successo:                  |
|        successo: valore impostato a true                      |
|        utente: Oggetto in formato JSON del nuovo utente       |
|                                                               |
 ---------------------------------------------------------------*/
exports.registraUtente = function(req, res) {
    console.log("POST Utenti registrazione");

    // Controllo se l'utente esiste già
    Utente.findOne({ username: req.body.username })
        .then(function(user) { // Connessione al database riuscita
            if (user) {

                /* 
                    L'utente esiste già
                    allora restituisco un errore 409 'Conflict'
                */
                res.status(409).json({
                    'errore': "Esiste già un utente con questo username",
                    'username': req.body.username,
                    'successo': false
                });

            } else { // Utente non trovato quindi controllo l'email
                Utente.findOne({ email: req.body.email })
                    .then(function(user) {
                        if (user) {
                            /* 
                            Esiste un utente con la stessa e-mail
                            allora restituisco un errore 409 'Conflict'
                            */
                            res.status(409).json({
                                'errore': "Esiste già un utente con questa e-mail",
                                'email': req.body.email,
                                'successo': false
                            });
                        } else { // Email disponibile

                            // Creo quindi l'utente
                            var password_hash;
                            var risposta_segreta_hash;

                            bcrypt.hash(req.body.password, encryption.saltrounds)
                                .then(function(pass_hash) { // Creo l'hash della password
                                    password_hash = pass_hash;
                                    bcrypt.hash(req.body.risposta_segreta, encryption.saltrounds)
                                        .then(function(risp_hash) { // Creo l'hash della risposta
                                            risposta_segreta_hash = risp_hash;

                                            // creo un utente in base al modello
                                            var nuovoUtente = new Utente({
                                                nome: req.body.nome,
                                                cognome: req.body.cognome,
                                                username: req.body.username,
                                                stato: req.body.stato,
                                                provincia: req.body.provincia,
                                                comune: req.body.comune,
                                                indirizzo: req.body.indirizzo,
                                                telefono: req.body.telefono,
                                                email: req.body.email,
                                                password_hash: password_hash,
                                                domanda_segreta: req.body.domanda_segreta,
                                                risposta_segreta_hash: risposta_segreta_hash
                                            });

                                            // salvo l'utente nel database
                                            nuovoUtente.save(function(err) {
                                                if (err)
                                                    return utilities.handleError(res, err, "I valori non hanno superato la validazione del server");
                                                else {
                                                    res.status(201).json({ 'utenteID': nuovoUtente._id, 'successo': true });
                                                }
                                            });
                                        })
                                        .catch(function(err) {
                                            return utilities.handleError(res, err, "Errore riscontrato durante l'hashing della risposta segreta");
                                        });
                                }).catch(function(err) {
                                    return utilities.handleError(res, err, "Errore riscontrato durante l'hashing della password dell'utente");
                                });
                        }
                    })
                    .catch(function(err) { // Connessione al database non riuscita
                        return utilities.handleError(res, err, 'Errore riscontrato durante la connessione al database');
                    })



            }


        })
        .catch(function(err) { // Connessione al database non riuscita
            return utilities.handleError(res, err, 'Errore riscontrato durante la connessione al database');
        });



};

/*--------------------------------------------------------------
|    Funzione: loginUtente()                                    |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        username : username dell'utente                        |
|        password : password dell'utente                        |
|                                                               |
|    Parametri restituiti in caso di successo:                  |
|        successo: valore impostato a true                      |
|        token: stringa che rappresenta il token dell'utente    |
|                                                               |
 ---------------------------------------------------------------*/
exports.loginUtente = function(req, res) {
    console.log("POST login utente");
    Utente.findOne({ username: req.body.username })
        .then(function(utente) {
            if (utente) {
                // Utente trovato, passo a controllare la password
                bcrypt.compare(req.body.password, utente.password_hash)
                    .then(function(esito) {
                        if (esito) { // password corretta
                            // Creo il token
                            var token = jwt.sign({ utenteID: utente._id }, encryption.secret, { expiresIn: 1440 });

                            // Restituisco il token
                            res.status(201).json({ 'token': token, 'successo': true, 'username': utente.username });

                        } else {
                            return utilities.handleError(res, 'ReferenceError', 'Tentativo di login fallito, credenziali non valide');
                        }

                    })
                    .catch(function() { // Password errata
                        return utilities.handleError(res, 'ERR_WRONG_PW', "Problemi durante la creazione del token");
                    });
            } else { // Utente non trovato
                return utilities.handleError(res, err, 'Tentativo di login fallito, credenziali non valide');
            }
        })
        .catch(function(err) {
            return utilities.handleError(res, err, 'Tentativo di login fallito, credenziali non valide');
        });

};

/*--------------------------------------------------------------
|    Funzione: validaRispostaSegreta()                          |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        username : username dell'utente                        |
|        risposta_segreta : la risposta da validare             |
|                                                               |
|     Parametri restituiti in caso di successo:                 |
|        username : username dell'utente                        |
|        successo: valore impostato a true                      |
 ---------------------------------------------------------------*/
exports.validaRispostaSegreta = function(req, res) {
    console.log('POST risposta alla domanda segreta');

    Utente.findOne({ username: req.body.username })
        .then(function(utente) {
            if (!utente) return utilities.handleError(res, err, "Non so come sia possibile, ma sei arrivato a questa richiesta con un nome utente non valido!")
            bcrypt.compare(req.body.risposta_segreta, utente.risposta_segreta_hash)
                .then(function(esito) {
                    if (esito) return res.json({ username: utente.username, successo: true });
                    else return utilities.handleError(res, "ERR_RISPOSTA_ERRATA", "La risposta fornita non corrisponde");
                })
                .catch(function(err) {
                    return utilities.handleError(res, err, "Errore sconosciuto");
                })
        });
};
exports.getUtente = function(req, res) {
    console.log('GET utente');
    Utente.findOne({ username: req.params.utente })
        .then(function(utente) {
            res.json({ utente });
        })
        .catch(function(err) {
            return utilities.handleError(res, err);
        });
};

/*--------------------------------------------------------------
|    Funzione: recuperoPassword()                               |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        username : username dell'utente                        |
|        nuova_password : nuova password da impostare           |
|                                                               |
|     Parametri restituiti in caso di successo:                 |
|        successo: valore impostato a true                      |
|        messaggio : messaggio di successo                      |
 ---------------------------------------------------------------*/

exports.resetPassword = function(req, res) {
    console.log("POST Reset password");

    Utente.findOne({ username: req.body.username })
        .then(function(utente) {
            // Utente trovato, creo l'hash per la nuova password
            bcrypt.hash(req.body.nuova_password, encryption.saltrounds)
                .then(function(hash_nuova_password) {
                    // Cambio la password dell'utente
                    utente.password_hash = hash_nuova_password;
                    // Invalido l'eventuale token
                    utente.scadenzaRecupero = Date.now();
                    utente.tokenRecupero = '';
                    utente.save(function(err, updatedDoc) {
                        if (err) return utilities.handleError(res, err);
                        else res.status(201).json({ 'messaggio': "Operazione riuscita", 'successo': true });
                    })
                })
                .catch(function(err) {
                    return utilities.handleError(res, err, "Errore riscontrato durante l'hashing della password dell'utente");
                });
        })
        .catch(function(err) {
            return utilities.handleError(res, err, 'Tentativo di reset password fallito');
        });
};

/*--------------------------------------------------------------
|    Funzione: validaToken()                                    |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        token : il token da usare per il recupero              |
|                                                               |
|     Parametri restituiti in caso di successo:                 |
|        user: tutti i dati dell'utente che fa richiesta        |
|        successo: valore impostato a true                      |
 ---------------------------------------------------------------*/

exports.validaToken = function(req, res) {
    console.log("POST Token per recupero");
    var dataAttuale = Date.now();
    Utente.findOne({
            tokenRecupero: req.body.token
        }, function(err, utente) {
            if (err) return utilities.handleError(res, err);
            if (utente === null) return utilities.handleError(res, "ERR_TOKEN_NON_VALIDO", "Token per il recupero password non valido");
            if (utente.scadenzaRecupero < dataAttuale && utente.scadenzaRecupero != null) {
                // token scaduto
                return utilities.handleError(res, "ERR_TOKEN_SCADUTO", "Token per recupero password scaduto")

            } else {
                // DECOMMENTARE PER DISABILITARE IL LINK APPENA CLICCATO
                // utente.tokenRecupero='';
                // utente.scadenzaRecupero=Date.now();
                // utente.save(function(err, updatedDoc){
                // if (err) return utilities.handleError(res,err);
                // else return res.json({ user: utente, successo: true });
                //})
                return res.json({ user: utente, successo: true });
            }
        })
        .catch(function(err) {
            return utilities.handleError(res, err);
        });

};


/*--------------------------------------------------------------
|    Funzione: richiestaRecuperoPassword()                      |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        username : username dell'utente                        |
|                                                               |
|                                                               |
|     Parametri restituiti in caso di successo:                 |
|        successo: valore impostato a true                      |
 ---------------------------------------------------------------*/

exports.richiestaRecuperoPassword = function(req, res) {
    console.log("POST richiesta recupero pw");
    var crypto = require('crypto');
    Utente.findOne({ username: req.body.username })
        .then(function(utente) {
            if (!utente) return utilities.handleError(res, "ERR_NO_USER", "L'utente ricercato non esiste");
            var indirizzoRecupero = req.body.indirizzo;
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                var dataScadenza = Date.now() + (3600000 * 5); // cinque ore
                // imposto il token per il recupero e la sua scadenza
                utente.tokenRecupero = token;
                utente.scadenzaRecupero = dataScadenza;
                utente.save(function(err, updatedDoc) {
                    if (err) return utilities.handleError(res, err);
                    else {
                        var corpoInHtml = "<p> Puoi reimpostare la password fornendo la giusta risposta segreta al seguente link : </p>" +
                            '<a href="' + indirizzoRecupero + token + '">' + indirizzoRecupero + token + '</a>' +
                            " <p>Il link rimarrà valido per 5 ore da ora.</p>" +
                            " <p></p>" +
                            " <hr /> Cordiali Saluti, Il Team Sito Tranquillo";

                        // Utente trovato, invio il link per email alla richiesta 
                        mailer.inviaEmail('dummy', 'dummy', utente.email, "Recupero password", corpoInHtml);
                        res.status(201).json({ 'successo': true });
                    }
                });
            })

            .catch(function(err) {
                return utilities.handleError(res, err, 'Tentativo di recupero password fallito, non esiste lo utente scelto o richiesta malformata');
            });
        });
}

/*--------------------------------------------------------------
|    Funzione: aggiungiAlCarrello()                             |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        token : token dell'utente                              |
|        prodotto : _id del prodotto immesso                    |
|        quantita : quantità di prodotti                        |
|                                                               |
|     Parametri restituiti in caso di successo:                 |
|        successo: valore impostato a true                      |
 ---------------------------------------------------------------*/

exports.aggiungiAlCarrello = function(req, res) {
    console.log("POST aggiungi al carrello");

    // Verifico e spacchetto il token dell'utente
    jwt.verify(req.body.token, encryption.secret, function(err, decoded) {
        if (err) {
            return utilities.handleError(res, err, 'Token non valido o scaduto.');
        } else {

            // Token valido
            console.log('Token valido');
            var quantitaRichiesta;

            if (!req.body.quantita || req.body.quantita <= 0) { // Controllo se la richiesta ha un campo quantita, altrimenti restituisco errore
                return utilities.handleError(res, err, 'Devi inserire una quantità ( maggiore di 0 ) per il prodotto richiesto');
            } else {
                quantitaRichiesta = parseInt(req.body.quantita); // CONVERTIRE SEMPRE IN INT LE RICHIESTE DESIDERATE IN FORMA NUMERICA
            }

            if (!req.body.prodotto) { // Controllo se la richiesta ha un prodotto
                return utilities.handleError(res, err, 'Devi inserire un codice prodotto');
            }


            var utenteID = decoded.utenteID;

            Utente.findById(utenteID, function(err, utenteTrovato) {
                if (!err) { // Trovato
                    Prodotto.findById(req.body.prodotto, function(err, prodottoTrovato) {

                        if (!err) { // Codice plausibile 

                            if (prodottoTrovato == null) { // Richiesta funzionante ma prodotto non trovato (il codice è conforme alle regole mongoDB)
                                return utilities.handleError(res, err, 'Prodotto non trovato');
                            }

                            var found_index = -1; // -1 indica non trovato, valore di default
                            for (var i = 0; i < utenteTrovato.carrello.prodotti.length; i++) {
                                if (utenteTrovato.carrello.prodotti[i]._id.equals(prodottoTrovato._id)) { // Java sei tu?
                                    found_index = i;
                                    break;
                                };
                            }
                            if (found_index == -1) {

                                // Aggiungo il nuovo prodotto al carrello
                                if (prodottoTrovato.giacenza < prodottoTrovato.impegnoInCarrelli + quantitaRichiesta + prodottoTrovato.impegnoInPagamento) { // Giacenza minore della richiesta
                                    return utilities.handleError(res, err, 'Hai richiesto più prodotti di quanto disponibile');
                                } else { // Quantità ok
                                    Utente.findByIdAndUpdate(utenteID, // Aggiungo al carrello
                                        {
                                            $push: {
                                                "carrello.prodotti": {

                                                    nome: prodottoTrovato.nome,
                                                    prezzo: prodottoTrovato.prezzo,
                                                    descrizioneBreve: prodottoTrovato.descrizioneBreve,
                                                    quantita: quantitaRichiesta,
                                                    urlImmagine: prodottoTrovato.urlImmagine,
                                                    _id: prodottoTrovato._id
                                                }
                                            }
                                        }, { upsert: true },
                                        function(err) {
                                            if (!err) { // Aggiungo il prodotto
                                                // Aggiorno l'impegno in carrello del prodotto
                                                prodottoTrovato.impegnoInCarrelli += quantitaRichiesta;

                                                prodottoTrovato.save(function(err) {
                                                    if (!err) {
                                                        res.status(201).json({ 'successo': true });
                                                    } else {
                                                        return utilities.handleError(res, err, 'Errore durante il salvataggio del database');

                                                    }
                                                });
                                            } else { // Errore nell'aggiungere il prodotto al carrello
                                                return utilities.handleError(res, err, 'Impossibile aggiungere il prodotto richiesto al carrello');
                                            }
                                        });

                                }
                            } else { // Trovato un indice quindi modifico la quantità già presente nel carrello
                                if (prodottoTrovato.giacenza < prodottoTrovato.impegnoInCarrelli + quantitaRichiesta + prodottoTrovato.impegnoInPagamento) { // Giacenza minore della richiesta
                                    return utilities.handleError(res, err, 'Hai richiesto più prodotti di quanto disponibile');
                                } else { // Aggiorno carrello e impegnoincarrello

                                    // Aggiorno l'impegno in carrello del prodotto
                                    prodottoTrovato.impegnoInCarrelli += quantitaRichiesta;

                                    // Salvo nel db
                                    prodottoTrovato.save(function(err) {
                                        if (!err) {
                                            // Aggiorno la quantità nel carrello
                                            utenteTrovato.carrello.prodotti[found_index].quantita += quantitaRichiesta;

                                            // Salvo nel db
                                            utenteTrovato.save(function(err) {
                                                if (!err) {
                                                    res.status(201).json({ 'successo': true });
                                                } else {
                                                    return utilities.handleError(res, err, 'Errore durante il salvataggio del database');
                                                }
                                            });
                                        } else {
                                            return utilities.handleError(res, err, 'Errore durante il salvataggio del database');

                                        }
                                    });

                                }

                            }


                        } else { // Prodotto non trovato
                            return utilities.handleError(res, err, 'Errore durante il ritrovamento del prodotto');
                        }
                    });
                } else { // Utente non trovato
                    return utilities.handleError(res, err, 'Errore durante il ritrovamento dello utente');
                }
            });
        }
    });
}

/*--------------------------------------------------------------
|    Funzione: rimuoviDalCarrello()                             |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        token : token dell'utente                              |
|        prodotto : _id del prodotto da rimuovere               |
|        quantita : quantità di prodotto da togliere            |
|                                                               |
|     Parametri restituiti in caso di successo:                 |
|        successo: valore impostato a true                      |
 ---------------------------------------------------------------*/

exports.rimuoviDalCarrello = function(req, res) {
    console.log("POST rimuovi dal carrello");

    // Controllo il token della richiesta
    jwt.verify(req.body.token, encryption.secret, function(err, decoded) {
        if (err) {
            return utilities.handleError(res, err, 'Token non valido o scaduto.');
        } else {

            var quantitaRichiesta;
            var utenteID = decoded.utenteID; // Salvo l'id dell'utente

            if (!req.body.quantita || req.body.quantita <= 0) { // Controllo se la richiesta ha un campo quantita, altrimenti restituisco errore
                return utilities.handleError(res, err, 'Devi inserire una quantità ( maggiore di 0 ) per il prodotto richiesto');
            } else {
                quantitaRichiesta = parseInt(req.body.quantita); // CONVERTIRE SEMPRE IN INT LE RICHIESTE DESIDERATE IN FORMA NUMERICA
            }

            if (!req.body.prodotto) { // Controllo se la richiesta ha un prodotto
                return utilities.handleError(res, err, 'Devi inserire un codice prodotto');
            }

            // Superati i controlli procedo con la funzione
            Utente.findById(utenteID, function(err, utenteTrovato) {
                if (!err) { // Trovato
                    var found_index = -1;
                    for (var i = 0; i < utenteTrovato.carrello.prodotti.length; i++) {
                        if (utenteTrovato.carrello.prodotti[i]._id.equals(req.body.prodotto)) {
                            found_index = i;
                            break;
                        }
                    }

                    if (found_index != -1) { // Prodotto trovato nel carrello dell'utente
                        Prodotto.findById(req.body.prodotto, function(err, prodottoTrovato) {
                            if (!err) { // Codice plausibile 
                                if (prodottoTrovato == null) { // Richiesta funzionante ma prodotto non trovato (il codice è conforme alle regole mongoDB)
                                    // Quindi rimuovo l'oggetto dal carrello che non esiste più
                                    Utente.findByIdAndUpdate(utenteID, {
                                        $pull: { "carrello.prodotti": { _id: utenteTrovato.carrello.prodotti[found_index]._id } }
                                    }, function(err) {
                                        if (!err) {
                                            res.status(201).json({ 'successo': true, 'messaggio': 'Oggetto non più esistente nel database, quindi eliminato' });
                                        } else {
                                            return utilities.handleError(res, err, 'Errore durante la rimozione dello oggetto nel carrello');
                                        }
                                    });
                                } else {
                                    // Prodotto trovato

                                    // Controllo la quantità da togliere e a seconda dei casi mi comporto di conseguenza
                                    if (utenteTrovato.carrello.prodotti[found_index].quantita > quantitaRichiesta) {

                                        //Tolgo l'impegno dal carrello
                                        prodottoTrovato.impegnoInCarrelli -= quantitaRichiesta;

                                        prodottoTrovato.save(function(err) {
                                            if (!err) {
                                                utenteTrovato.carrello.prodotti[found_index].quantita -= quantitaRichiesta;

                                                utenteTrovato.save(function(err) {
                                                    if (!err) {
                                                        res.status(201).json({ 'successo': true });
                                                    } else {
                                                        return utilities.handleError(res, err, 'Errore durante il salvataggio del database');
                                                    }
                                                });
                                            } else {
                                                return utilities.handleError(res, err, 'Errore durante il salvataggio del database');
                                            }
                                        });
                                    } else if (utenteTrovato.carrello.prodotti[found_index].quantita == quantitaRichiesta) { // Rimossi tutte le unità
                                        prodottoTrovato.impegnoInCarrelli -= quantitaRichiesta;


                                        prodottoTrovato.save(function(err) {
                                            if (!err) {
                                                // Elimino il prodotto dal carrello
                                                Utente.findByIdAndUpdate(utenteID, {
                                                    $pull: { "carrello.prodotti": { _id: prodottoTrovato._id } }
                                                }, function(err) {
                                                    if (!err) {
                                                        res.status(201).json({ 'successo': true });
                                                    } else {
                                                        return utilities.handleError(res, err, 'Errore durante la rimozione dello oggetto nel carrello');
                                                    }
                                                });
                                            } else {
                                                return utilities.handleError(res, err, 'Errore durante il salvataggio del database');
                                            }
                                        });
                                    } else { // Si è cercato di rimuovere più di quanto ci fosse nel carrello
                                        return utilities.handleError(res, err, 'Quantità richiesta superiore al numero di oggetti nel carrello');
                                    }

                                }
                            } else {
                                // Quindi rimuovo l'oggetto dal carrello che non esiste più
                                Utente.findByIdAndUpdate(utenteID, {
                                    $pull: { "carrello.prodotti": { _id: utenteTrovato.carrello.prodotti[found_index]._id } }
                                }, function(err) {
                                    if (!err) {
                                        res.status(201).json({ 'successo': true, 'messaggio': 'Oggetto non più esistente nel database, quindi eliminato' });
                                    } else {
                                        return utilities.handleError(res, err, 'Errore durante la rimozione dello oggetto nel carrello');
                                    }
                                });
                                return utilities.handleError(res, err, 'Errore durante il ritrovamento del prodotto');
                            }
                        });

                    } else { // prodotto non trovato nel carrello
                        return utilities.handleError(res, err, 'Lo utente non ha questo prodotto');
                    }
                } else {
                    return utilities.handleError(res, err, 'Errore durante il ritrovamento dello utente');
                }
            });
        }
    });

}

/*--------------------------------------------------------------
|    Funzione: acquistaProdottiNelCarrello()                    |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        token : token dell'utente                              |
|                                                               |
|                                                               |
|     Parametri restituiti in caso di successo:                 |
|        successo: valore impostato a true                      |
|        carrello_obsoleto: valore impostato a false            |
|                                                               |
|     Parametri restituiti in caso di oggetto non presente nel  |
|     db:                                                       |
|        successo: valore impostato a false                     |
|        carrello_obsoleto: valore impostato a true             |                                   
 ---------------------------------------------------------------*/

exports.acquistaProdottiNelCarrello = function(req,res){
    // Controllo la validità del token e procedo all'acquisto
    jwt.verify(req.body.token, encryption.secret, function(err, decoded){
        if (err) {
            return utilities.handleError(res, err, 'Token non valido o scaduto.');
        } else {
            Utente.findById(decoded.utenteID, function(err, utenteTrovato){
                if(err || utenteTrovato == null){
                    return utilities.handleError(res, err, 'Utente non trovato')   
                } else { // Utente trovato controllo il suo carrello
                    if(utenteTrovato.carrello.prodotti.length == 0 || utenteTrovato.carrello.prodotti == null){
                        // Carrello vuoto, nothing to do here.
                        return utilities.handleError(res, 'EMP_CAR', 'Carrello vuoto')
                    } else {
                        // INIZIO funzione con promessa

                        let acquistoORimozione = new Promise(function(resolve,reject){
                            Prodotto.find({}, function(err, elencoProdotti){
                                console.log(utenteTrovato);
                                if(err){
                                    return utilities.handleError(res, err, 'Server Error');
                                } else {

                                    var i = 0;
                                    var obsoleto = false; // True se sono presenti oggetti sbagliati nel carrello
                                    var prodotti_obsoleti = [];
                                    for(i = 0; i<utenteTrovato.carrello.prodotti.length; i++){
                                        for(var j=0; j<elencoProdotti.length;j++){
                                            if(utenteTrovato.carrello.prodotti[i]._id.equals(elencoProdotti[j]._id)){
                                                break; // Passa all'elemento successivo del carrello
                                            }
                                            if(j == elencoProdotti.length - 1){
                                                obsoleto = true;
                                                prodotti_obsoleti.push(utenteTrovato.carrello.prodotti[i]._id);
                                            }
                                        }
                                    }
                                    if(obsoleto == true){
                                        // Elimino i prodotti uguali e ritorno
                                        for(i = 0; i < prodotti_obsoleti.length;i++){
                                            utenteTrovato.carrello.prodotti =  utenteTrovato.carrello.prodotti.filter(function(prod){
                                                return !(prod._id.equals(prodotti_obsoleti[i]));
                                            });
                                        }
                                        utenteTrovato.save(function(err){
                                            if(err){
                                                return utilities.handleError(res,err,'Server error');
                                            }
                                            reject(true);

                                        })
                                        
                                    } else {
                                        for(i=0; i < utenteTrovato.carrello.prodotti.length; i++){
                                            for(var j = 0; j < elencoProdotti.length;j++){
                                                if(utenteTrovato.carrello.prodotti[i]._id.equals(elencoProdotti[j]._id)){
                                                    elencoProdotti[j].impegnoInCarrelli -= utenteTrovato.carrello.prodotti[i].quantita;
                                                    elencoProdotti[j].giacenza -= utenteTrovato.carrello.prodotti[i].quantita;
                                                    // DEBUG (rimuovere le seguenti 2 righe se si vuole)
                                                    console.log(i + ' ' + elencoProdotti[j].impegnoInCarrelli);
                                                    console.log(i + ' ' + elencoProdotti[j].giacenza);
                                                }
                                            }
                                            if(i == (utenteTrovato.carrello.prodotti.length - 1)){
                                                var total = elencoProdotti.length
                                                , result = [];
                                                
                                                //Funzione che salva i nuovi prodotti uno ad uno
                                                function saveAll(){
                                                    var doc = elencoProdotti.pop();
                                                    doc.save(function(err,saved){
                                                        if(err){return utilities.handleError(res,err,'Server error');}
                                                        result.push(saved[0]);

                                                        if(--total){ saveAll();}
                                                        else{
                                                            lastSave();
                                                        }
                                                    });
                                                }
                                                
                                                // Funzione che salva l'utente rimuovendo il carrello e aggiungendolo alla lista degli acquisti precedenti
                                                function lastSave(){
                                                    
                                                                                                        

                                                    var backup_carrello = JSON.parse(JSON.stringify(utenteTrovato.carrello.prodotti)); // Hack per clonare un oggetto
                                                    utenteTrovato.carrello.prodotti = []; // Rimuovo i prodotti dal carrello

                                                    // Salvo i cambiamenti all'utente
                                                    utenteTrovato.save(function(err){
                                                        if(err){
                                                            return utilities.handleError(res,err,'Server error');
                                                        }
                                                        
                                                        // Aggiungo la storia dell'acquisto all'utente
                                                        Utente.findByIdAndUpdate(decoded.utenteID,{$push : {"storia_acquisti.acquisti": {
                                                                data_acquisto: Date.now(),
                                                                prodotti: backup_carrello
                                                            }}},{upsert:true})
                                                            .then(function(){
                                                                resolve(false); // carrello non obsoleto, quindi acquisto effettuato
                                                            })
                                                            .catch(function(err){
                                                                return utilities.handleError(res,err,'Server error');
                                                            });
                                                            
                                                        
                                                    });
                                                }

                                                saveAll();  // Chiamo la funzione (sopra sono soltanto dichiarate)

                                                
                                            }

                                            
                                        }
                                                
                                    }
                                }
                            });                 
                        });

                        //FINE funzione con promessa

                        acquistoORimozione.then(function(fromResolve){
                            res.status(201).json({'successo':true,'carrello_obsoleto':fromResolve});
                        }).catch(function(fromReject){
                            res.status(500).json({'successo':false,'carrello_obsoleto':fromReject});
                        });
                    }
                }
            });
        }
    });
}

