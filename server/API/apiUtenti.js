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
                                username: req.body.username,
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
                    res.status(201).json({'token':token,'successo':true});

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

