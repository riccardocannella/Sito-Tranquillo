'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema per i prodotti
var ProdottoSchema = new Schema({
    nome: {
        type: String,
        required: [true, 'Inserisci un nome per il prodotto']
    },
    prezzo: {
        type: Number,
        required: [true, 'Inserisci un prezzo per il prodotto']
    },
    giacenza: {
        type: Number,
        default: 0,
        min: 0
    },
    impegnoInCarrelli: {
        type: Number,
        default: 0,
        min: 0
    },
    impegnoInPagamento: {
        type: Number,
        default: 0,
        validate: {
            validator: function(value) {
                return this.giacenza >= value;
            },
            message: 'Si sta cercando di comprare più della disponibilità di questo prodotto'
        },
        min: 0
    },
    descrizioneBreve: {
        type: String,
        required: [true, 'Inserisci una descrizione breve per il prodotto']
    },
    descrizioneLunga: {
        type: String,
        required: [true, 'Inserisci una descrizione lunga']
    }
});

module.exports = mongoose.model('Prodotto', ProdottoSchema, 'prodotti');

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
    password: {
        type: String,
        Required: 'Inserisci una password'
    }
});
module.exports = mongoose.model('Utente', UtenteSchema, 'utenti');