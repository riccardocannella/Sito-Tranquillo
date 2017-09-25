'use strict';
/**
 * Collezione dei prodotti
 */
var PRODOTTI = 'prodotti';


var mongoose = require('mongoose');

/**
 * Modello mongoose del prodotto
 */
var Prodotto = mongoose.model('Prodotto');

// Importo funzioni utili in generale
var utilities = require('../utilities/utilities');

/**
 * Fa riferimento al Database
 */
var db;
exports.setDb = function(extdb) {
    db = extdb;
};


/*
    Restituisce tutta la lista dei prodotti dal database
    se c'è un errore richiama la funzione utilities.handleError(...)
    altrimenti invia il risultato tramite JSON
*/
exports.listaProdotti = function(req, res) {
    console.log("GET prodotti");
    db.collection(PRODOTTI).find({}).toArray(function(err, docs) {
        if (err) {
            utilities.handleError(res, err.message, "Operazione di recupero dei prodotti fallita.");
        } else {
            res.status(200).json(docs);
        }
    });
};

/*
    Crea un nuovo prodotto prendendo le informazioni dal Body
    e salvalo nel DB
*/
exports.creaProdotto = function(req, res) {
    console.log("POST prodotti");
    console.log(req.body);
    //var nuovoProdotto = req.body;
    var nuovoProdotto = new Prodotto({
        nome: req.body.nome,
        prezzo: req.body.prezzo,
        giacenza: req.body.giacenza,
        impegnoInCarrelli: req.body.impegnoInCarrelli,
        impegnoInPagamento: req.body.impegnoInPagamento,
        descrizioneBreve: req.body.descrizioneBreve,
        descrizioneLunga: req.body.descrizioneLunga,
        urlImmagine: req.body.urlImmagine,
        specifiche: req.body.specifiche
    });

    nuovoProdotto.save(function(err) {
        if (err) return utilities.handleError(res, err, '');
        // saved!
        else {
            res.status(201).json(nuovoProdotto);
        }
    });
};

/*
    Informazioni del prodotto
    Restituisci un determinato prodotto avente un determinato "id"
*/
exports.dettagliProdotto = function(req, res) {
    console.log("GET prodotto con id", req.params.id);
    db.collection(PRODOTTI).findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function(err, doc) {
        if (err) {
            utilities.handleError(res, err.message, "Operazione di recupero del prodotto fallita, id prodotto " + req.params.id);
        } else {
            res.status(200).json(doc);
        }
    });
};

/*
    Aggiorna il prodotto (trovato attraverso il suo ID) con
    nuove informazioni
*/
exports.aggiornaProdotto = function(req, res) {
    console.log("PUT prodotto con id", req.params.id);
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(PRODOTTI).updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, updateDoc, function(err, doc) {
        if (err) {
            utilities.handleError(res, err.message, "Operazione di aggiornamento del prodotto fallita, id prodotto " + req.params.id);
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    });
};

/*
    Elimina un prodotto trovato attraverso il suo ID
*/
exports.eliminaProdotto = function(req, res) {
    console.log("DELETE prodotto con id", req.params.id);
    db.collection(PRODOTTI).deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function(err, result) {
        if (err) {
            utilities.handleError(res, err.message, "Operazione di rimozione del prodotto fallita, id prodotto " + req.params.id);
        } else {
            res.status(200).json(req.params.id);
        }
    });
};