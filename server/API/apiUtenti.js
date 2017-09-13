'use strict';
var UTENTI = 'utenti';

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

//////////// DA CONTINUARE E' SOLO UNO SCHELETRO /////////