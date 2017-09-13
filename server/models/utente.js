'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema per gli utenti
var UtenteSchema = new Schema({
    nome: {
        type: String,
        Required: 'Inserisci un nome utente'
    },
    email: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: 'Email non valida'
        },
        Required: 'Inserisci un\'email valida'
    },
    password_hash: {
        type: String,
        Required: 'Inserisci una password'
    },
    domanda_segreta: {
        type: String,
        Required: 'Inserisci una domanda segreta'
    },
    risposta_segreta_hash: {
        type: String,
        Required: 'Inserisci una risposta alla domanda segreta'
    }
});
module.exports = mongoose.model('Utente', UtenteSchema, 'utenti');