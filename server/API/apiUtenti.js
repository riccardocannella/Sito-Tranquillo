'use strict';
var UTENTI = 'utenti';

var bcrypt = require('bcrypt');
var q = require('q');
var encryption = require('../config/encryption');

var mongoose = require('mongoose'),
    Utente = mongoose.model('Utente');

var db;
exports.setDb = function(extdb) {
    db = extdb;
};


function handleError(res, ragione, messaggio, codice) {
    console.log("ERRORE: " + ragione);
    res.status(codice || 500).json({ "errore": messaggio });
}

exports.registraUtente = function(req,res) {
    console.log("POST Utenti");
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
                email: req.body.email,
                password_hash: password_hash,
                domanda_segreta:req.body.domanda_segreta,
                risposta_segreta_hash: risposta_segreta_hash 
            });

            // salvo l'utente nel database
            nuovoUtente.save(function(err){
                if(err)
                    return handleError(res, err, ''); 
                else{
                    res.status(201).json(nuovoUtente);
                }
            });
        })
        .catch(function(err){
            return handleError(res,err,'');
        });
    }).catch(function(err){
        return handleError(res,err,'');
    });

    
};