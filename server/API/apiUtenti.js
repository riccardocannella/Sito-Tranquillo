'use strict';
var UTENTI = 'utenti';

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); 
var encryption = require('../config/encryption');

var mongoose = require('mongoose'),
    Utente = mongoose.model('Utente');

// Importo funzioni utili in generale
var utilities = require('../utilities/utilities');

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
                                  'username': req.body.username
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
                                      'email': req.body.email
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
                                    res.status(201).json({'utente':nuovoUtente,'successo':true});
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
                    var token = jwt.sign({utente : utente}, encryption.secret,{expiresIn:1440});
                    
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