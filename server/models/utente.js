'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
    Schema per gli utenti con:
        -nome
        -email
        -password criptata con bcryptjs
        -domanda segreta
        -risposta cryptata con bcryptjs
*/
var UtenteSchema = new Schema({
    username: {
        type: String,
        required: [true,'Inserisci un nome utente']
    },
    email: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: 'Email non valida'
        },
        required: [true,'Inserisci una email valida']
    },
    password_hash: {
        type: String,
        required: [true,'Inserisci una password']
    },
    domanda_segreta: {
        type: String,
        required: [true,'Inserisci una domanda segreta']
    },
    risposta_segreta_hash: {
        type: String,
        required: [true,'Inserisci una risposta segreta']
    },
    carrello: {
        prodotti :[{ // Array
            nome : String,
            prezzo : Number,
            descrizioneBreve: String,
            quantita : Number,
            urlImmagine : String
        }]
    }
});
module.exports = mongoose.model('Utente', UtenteSchema, 'utenti');
