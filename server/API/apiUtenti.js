'use strict';

// Importo le librerie che andrò ad utilizzare 
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); 


// Modello mongoose dell'utente
var mongoose = require('mongoose'),
    Utente = mongoose.model('Utente'),
    Prodotto = mongoose.model('Prodotto');

// Importo funzioni utili in generale e i file di configurazione
var utilities = require('../utilities/utilities');
var encryption = require('../config/encryption');
var mailer = require('../utilities/mailer');

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
exports.registraUtente = function(req,res) {
    console.log("POST Utenti registrazione");
    
    // Controllo se l'utente esiste già
    Utente.findOne({username:req.body.username})
    .then(function(user){ // Connessione al database riuscita
        if(user){
            
            /* 
                L'utente esiste già
                allora restituisco un errore 409 'Conflict'
            */
            res.status(409).json({'errore': "Esiste già un utente con questo username",
                                  'username': req.body.username,
                                  'successo':false
                                 });

        } else { // Utente non trovato quindi controllo l'email
            Utente.findOne({email:req.body.email})
            .then(function(user){
                if(user){
                /* 
                Esiste un utente con la stessa e-mail
                allora restituisco un errore 409 'Conflict'
                */
                res.status(409).json({'errore': "Esiste già un utente con questa e-mail",
                                      'email': req.body.email,
                                      'successo':false
                                     });
                } else { // Email disponibile
                    
                    // Creo quindi l'utente
                    var password_hash;
                    var risposta_segreta_hash;
            
                    bcrypt.hash(req.body.password, encryption.saltrounds)
                    .then(function(pass_hash){ // Creo l'hash della password
                        password_hash = pass_hash;
                        bcrypt.hash(req.body.risposta_segreta, encryption.saltrounds)
                        .then(function(risp_hash){ // Creo l'hash della risposta
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
                                domanda_segreta:req.body.domanda_segreta,
                                risposta_segreta_hash: risposta_segreta_hash
                            });
            
                            // salvo l'utente nel database
                            nuovoUtente.save(function(err){
                                if(err)
                                    return utilities.handleError(res, err, "I valori non hanno superato la validazione del server"); 
                                else{
                                    res.status(201).json({'utenteID':nuovoUtente._id,'successo':true});
                                }
                            });
                        })
                        .catch(function(err){
                            return utilities.handleError(res,err,"Errore riscontrato durante l'hashing della risposta segreta");
                        });
                    }).catch(function(err){
                        return utilities.handleError(res,err,"Errore riscontrato durante l'hashing della password dell'utente");
                    });
                }
            })
            .catch(function(err){ // Connessione al database non riuscita
                return utilities.handleError(res,err,'Errore riscontrato durante la connessione al database');
            })
            

            
        }
        
    
    })
    .catch(function(err){ // Connessione al database non riuscita
        return utilities.handleError(res,err,'Errore riscontrato durante la connessione al database');
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
exports.loginUtente = function(req,res){
    console.log("POST login utente");
    Utente.findOne({username: req.body.username})
    .then(function(utente){
        if(utente){
            // Utente trovato, passo a controllare la password
            bcrypt.compare(req.body.password, utente.password_hash)
            .then(function(esito){
                if(esito){ // password corretta
                    // Creo il token
                    var token = jwt.sign({utenteID : utente._id}, encryption.secret,{expiresIn:1440});
                    
                    // Restituisco il token
                    res.status(201).json({'token':token,'successo':true,'username':utente.username});

                } else {
                        return utilities.handleError(res,'ReferenceError','Tentativo di login fallito, credenziali non valide');
                }
                 
            })
            .catch(function(){ // Password errata
                return utilities.handleError(res,'ERR_WRONG_PW',"Problemi durante la creazione del token");
            });
        } else { // Utente non trovato
            return utilities.handleError(res,err,'Tentativo di login fallito, credenziali non valide');
        }
    })
    .catch(function(err){
        return utilities.handleError(res,err,'Tentativo di login fallito, credenziali non valide');
    });

};

/*--------------------------------------------------------------
|    Funzione: recuperoPassword()                               |
|    Tipo richiesta: POST                                       |
|                                                               |
|    Parametri accettati:                                       |
|        [x-www-form-urlencoded]                                |
|        username : username dell'utente                        |
|        risposta_segreta : risposta alla domanda segreta       |
|        nuova_password : nuova password da impostare           |
|                                                               |
|     Parametri restituiti in caso di successo:                 |
|        successo: valore impostato a true                      |
|        messaggio : messaggio di successo                      |
 ---------------------------------------------------------------*/

 exports.recuperoPassword = function(req,res){
    console.log("POST Recupero password");

    var utente_trovato;

    Utente.findOne({username: req.body.username})
    .then(function(utente){

        utente_trovato = utente;

        // Utente trovato, passo a controllare la risposta segreta
        bcrypt.compare(req.body.risposta_segreta, utente.risposta_segreta_hash)
        .then(function(esito){
            if(esito){ // risposta segreta corretta
                // Creo l'hash della nuova password
                bcrypt.hash(req.body.nuova_password, encryption.saltrounds)
                .then(function(hash_nuova_password){
                    // Cambio la password dell'utente
                    utente_trovato.password_hash = hash_nuova_password;
                    utente.save(function(err){
                        if(err)
                            return utilities.handleError(res, err, "La nuova password non ha superato la validazione del server"); 
                        else{
                            // Restituisco un messaggio di successo
                            res.status(201).json({'messaggio':"Operazione riuscita",'successo':true});
                        }
                    });
                    

                })
                .catch(function(err){
                    return utilities.handleError(res,err,"Errore riscontrato durante l'hashing della password dell'utente");
                });
                
                

            } else {
                    return utilities.handleError(res,'ReferenceError','Tentativo di recupero password fallito, risposta sbagliata');
            }

        })
        .catch(function(err){
            return utilities.handleError(res,'ERR_SEC_ANS',"La risposta segreta non è pervenuta al server o è sbagliata");
        });
         
    })
    .catch(function(err){
        return utilities.handleError(res,err,'Tentativo di recupero password fallito, non esiste lo utente scelto o richiesta malformata');
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

exports.richiestaRecuperoPassword = function(req,res){
    console.log("POST richiesta recupero pw");

    Utente.findOne({username: req.body.username})
    .then(function(utente){
        var corpoInHtml = "<p> Puoi reimpostare la password fornendo la giusta risposta segreta al seguente link : </p>" + 
                         " <p>http:// <----- Qui va il sito per recupero password </p>" + 
                         " <hr /> Cordiali Saluti, Il Team Sito Tranquillo";

        // Utente trovato, invio il link per email alla richiesta
        mailer.inviaEmail('dummy', 'dummy', utente.email, "Recupero password", corpoInHtml);
        res.status(201).json({'successo':true});
    })
    .catch(function(err){
        return utilities.handleError(res,err,'Tentativo di recupero password fallito, non esiste lo utente scelto o richiesta malformata');
    });
};

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

exports.aggiungiAlCarrello = function(req, res){
    console.log("POST aggiungi al carrello");

    // Verifico e spacchetto il token dell'utente
    jwt.verify(req.body.token, encryption.secret,function(err,decoded){
        if(err){
            return utilities.handleError(res,err,'Token non valido o scaduto.');   
        } else {

            // Token valido
            console.log('Token valido');
            var quantitaRichiesta;

            if(!req.body.quantita || req.body.quantita <= 0){ // Controllo se la richiesta ha un campo quantita, altrimenti restituisco errore
                return utilities.handleError(res,err,'Devi inserire una quantità ( maggiore di 0 ) per il prodotto richiesto');
            } else {
                quantitaRichiesta = parseInt(req.body.quantita); // CONVERTIRE SEMPRE IN INT LE RICHIESTE DESIDERATE IN FORMA NUMERICA
            }

            if(!req.body.prodotto){ // Controllo se la richiesta ha un prodotto
                return utilities.handleError(res,err,'Devi inserire un codice prodotto');
            }
        
            
            var utenteID = decoded.utenteID;

            Utente.findById(utenteID, function(err, utenteTrovato){
                if(!err){ // Trovato
                    Prodotto.findById(req.body.prodotto, function(err, prodottoTrovato){
                        
                        if(!err){ // Codice plausibile 

                            if(prodottoTrovato == null){ // Richiesta funzionante ma prodotto non trovato (il codice è conforme alle regole mongoDB)
                                return utilities.handleError(res,err,'Prodotto non trovato');
                            }
                            
                            var found_index = -1; // -1 indica non trovato, valore di default
                            for(var i = 0; i < utenteTrovato.carrello.prodotti.length; i++){
                                 if(utenteTrovato.carrello.prodotti[i]._id.equals(prodottoTrovato._id)){ // Java sei tu?
                                    found_index = i;
                                    break;
                                };
                            }
                            if(found_index == -1){
                                
                                // Aggiungo il nuovo prodotto al carrello
                                if(prodottoTrovato.giacenza < prodottoTrovato.impegnoInCarrelli + quantitaRichiesta + prodottoTrovato.impegnoInPagamento){ // Giacenza minore della richiesta
                                    return utilities.handleError(res,err,'Hai richiesto più prodotti di quanto disponibile');
                                } else {// Quantità ok
                                    Utente.findByIdAndUpdate(utenteID, // Aggiungo al carrello
                                        { $push : {"carrello.prodotti":{
                                            
                                            nome: prodottoTrovato.nome,
                                            prezzo: prodottoTrovato.prezzo,
                                            descrizioneBreve: prodottoTrovato.descrizioneBreve,
                                            quantita: quantitaRichiesta,
                                            urlImmagine : prodottoTrovato.urlImmagine,
                                            _id: prodottoTrovato._id
                                        }} 
                                    },{upsert:true}, function(err){
                                        if(!err){ // Aggiungo il prodotto
                                            // Aggiorno l'impegno in carrello del prodotto
                                            prodottoTrovato.impegnoInCarrelli += quantitaRichiesta;

                                            prodottoTrovato.save(function(err){
                                                if(!err){
                                                    res.status(201).json({'successo':true});
                                                } else {
                                                    return utilities.handleError(res,err,'Errore durante il salvataggio del database');
                                                    
                                                }
                                            });
                                        } else { // Errore nell'aggiungere il prodotto al carrello
                                            return utilities.handleError(res,err,'Impossibile aggiungere il prodotto richiesto al carrello');
                                        }
                                    });
                                    
                                }
                            } else { // Trovato un indice quindi modifico la quantità già presente nel carrello
                                if(prodottoTrovato.giacenza < prodottoTrovato.impegnoInCarrelli + quantitaRichiesta + prodottoTrovato.impegnoInPagamento){ // Giacenza minore della richiesta
                                    return utilities.handleError(res,err,'Hai richiesto più prodotti di quanto disponibile');
                                } else { // Aggiorno carrello e impegnoincarrello
                                    
                                    // Aggiorno l'impegno in carrello del prodotto
                                    prodottoTrovato.impegnoInCarrelli += quantitaRichiesta;
                                    
                                    // Salvo nel db
                                    prodottoTrovato.save(function(err){
                                        if(!err){
                                            // Aggiorno la quantità nel carrello
                                            utenteTrovato.carrello.prodotti[found_index].quantita += quantitaRichiesta;

                                            // Salvo nel db
                                            utenteTrovato.save(function(err){
                                                if(!err){
                                                    res.status(201).json({'successo':true});
                                                } else {
                                                    return utilities.handleError(res,err,'Errore durante il salvataggio del database');
                                                }
                                            });
                                        } else {
                                            return utilities.handleError(res,err,'Errore durante il salvataggio del database');
                                            
                                        }
                                    });
                                    
                                }
                                
                            }

                                                        
                        } else { // Prodotto non trovato
                            return utilities.handleError(res,err,'Errore durante il ritrovamento del prodotto'); 
                        }
                    });
                } else { // Utente non trovato
                    return utilities.handleError(res,err,'Errore durante il ritrovamento dello utente');
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

 exports.rimuoviDalCarrello = function(req,res){
    console.log("POST rimuovi dal carrello");

    // Controllo il token della richiesta
    jwt.verify(req.body.token, encryption.secret,function(err,decoded){
        if(err){
            return utilities.handleError(res,err,'Token non valido o scaduto.');
        } else {

            var quantitaRichiesta;
            var utenteID = decoded.utenteID; // Salvo l'id dell'utente

            if(!req.body.quantita || req.body.quantita <= 0){ // Controllo se la richiesta ha un campo quantita, altrimenti restituisco errore
                return utilities.handleError(res,err,'Devi inserire una quantità ( maggiore di 0 ) per il prodotto richiesto');
            } else {
                quantitaRichiesta = parseInt(req.body.quantita); // CONVERTIRE SEMPRE IN INT LE RICHIESTE DESIDERATE IN FORMA NUMERICA
            }

            if(!req.body.prodotto){ // Controllo se la richiesta ha un prodotto
                return utilities.handleError(res,err,'Devi inserire un codice prodotto');
            }

            // Superati i controlli procedo con la funzione
            Utente.findById(utenteID, function(err, utenteTrovato){
                if(!err) { // Trovato
                    var found_index = -1;
                    for(var i = 0; i < utenteTrovato.carrello.prodotti.length; i++){
                        if(utenteTrovato.carrello.prodotti[i]._id.equals(req.body.prodotto)){
                            found_index = i;
                            break;
                        }
                    }

                    if(found_index != -1){ // Prodotto trovato nel carrello dell'utente
                        Prodotto.findById(req.body.prodotto, function(err, prodottoTrovato){
                            if(!err){ // Codice plausibile 
                                if(prodottoTrovato == null){ // Richiesta funzionante ma prodotto non trovato (il codice è conforme alle regole mongoDB)
                                    // Quindi rimuovo l'oggetto dal carrello che non esiste più
                                    Utente.findByIdAndUpdate(utenteID,{
                                        $pull:{"carrello.prodotti":{ _id: utenteTrovato.carrello.prodotti[found_index]._id}}
                                    }, function(err){
                                        if(!err){
                                             res.status(201).json({'successo':true,'messaggio':'Oggetto non più esistente nel database, quindi eliminato'});
                                        } else {
                                             return utilities.handleError(res,err,'Errore durante la rimozione dello oggetto nel carrello');
                                        }
                                    });
                                } else {
                                    // Prodotto trovato
                
                                    // Controllo la quantità da togliere e a seconda dei casi mi comporto di conseguenza
                                    if(utenteTrovato.carrello.prodotti[found_index].quantita > quantitaRichiesta){
                                        
                                        //Tolgo l'impegno dal carrello
                                        prodottoTrovato.impegnoInCarrelli -= quantitaRichiesta;
                                        
                                        prodottoTrovato.save(function(err){
                                            if(!err){
                                                utenteTrovato.carrello.prodotti[found_index].quantita -= quantitaRichiesta;

                                                utenteTrovato.save(function(err){
                                                    if(!err){
                                                        res.status(201).json({'successo':true});
                                                    } else {
                                                        return utilities.handleError(res,err,'Errore durante il salvataggio del database');
                                                    }
                                                });
                                            } else {
                                                return utilities.handleError(res,err,'Errore durante il salvataggio del database');
                                            }
                                        });
                                    } else if(utenteTrovato.carrello.prodotti[found_index].quantita == quantitaRichiesta) { // Rimossi tutte le unità
                                        prodottoTrovato.impegnoInCarrelli -= quantitaRichiesta;


                                        prodottoTrovato.save(function(err){
                                            if(!err){
                                               // Elimino il prodotto dal carrello
                                               Utente.findByIdAndUpdate(utenteID,{
                                                   $pull:{"carrello.prodotti":{ _id: prodottoTrovato._id}}
                                               }, function(err){
                                                   if(!err){
                                                        res.status(201).json({'successo':true});
                                                   } else {
                                                        return utilities.handleError(res,err,'Errore durante la rimozione dello oggetto nel carrello');
                                                   }
                                               });
                                            } else {
                                                return utilities.handleError(res,err,'Errore durante il salvataggio del database');
                                            }
                                        });
                                    } else { // Si è cercato di rimuovere più di quanto ci fosse nel carrello
                                        return utilities.handleError(res,err,'Quantità richiesta superiore al numero di oggetti nel carrello');
                                    }
                                    
                                }
                            } else {
                                // Quindi rimuovo l'oggetto dal carrello che non esiste più
                                Utente.findByIdAndUpdate(utenteID,{
                                    $pull:{"carrello.prodotti":{ _id: utenteTrovato.carrello.prodotti[found_index]._id}}
                                }, function(err){
                                    if(!err){
                                         res.status(201).json({'successo':true,'messaggio':'Oggetto non più esistente nel database, quindi eliminato'});
                                    } else {
                                         return utilities.handleError(res,err,'Errore durante la rimozione dello oggetto nel carrello');
                                    }
                                });
                                return utilities.handleError(res,err,'Errore durante il ritrovamento del prodotto');
                            }
                        });

                    } else { // prodotto non trovato nel carrello
                        return utilities.handleError(res,err,'Lo utente non ha questo prodotto');
                    }
                } else {
                    return utilities.handleError(res,err,'Errore durante il ritrovamento dello utente');
                }
            });
        } 
    });

 }