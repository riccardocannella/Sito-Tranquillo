'use strict';
// tabelle del DB
var PRODOTTI = 'prodotti';
var UTENTI = 'utenti';
var ADMINS = 'admins';

var mongoose = require('mongoose'),
    Prodotto = mongoose.model('Prodotto');
var db;
exports.setDb = function(extdb) {
    db = extdb;
}

function handleError(res, ragione, messaggio, codice) {
    console.log("ERRORE: " + ragione);
    res.status(codice || 500).json({ "errore": messaggio });
}
exports.listaProdotti = function(req, res) {
    console.log("GET prodotti");
    db.collection(PRODOTTI).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Operazione di recupero dei prodotti fallita.");
        } else {
            res.status(200).json(docs);
        }
    });
}

exports.creaProdotto = function(req, res) {
    console.log("POST prodotti");

    //var nuovoProdotto = req.body;
    var nuovoProdotto = new Prodotto({
        nome: req.body.nome,
        prezzo: req.body.prezzo,
        giacenza: req.body.giacenza,
        impegnoInCarrelli: req.body.impegnoInCarrelli,
        impegnoInPagamento: req.body.impegnoInPagamento,
        descrizioneBreve: req.body.descrizioneBreve,
        descrizioneLunga: req.body.descrizioneLunga
    });

    nuovoProdotto.save(function(err) {
        if (err) return handleError(res, err, '');
        // saved!
        else {
            res.status(201).json(nuovoProdotto);
        }
    });
}

exports.dettagliProdotto = function(req, res) {
    console.log("GET prodotto con id", req.params.id);
    db.collection(PRODOTTI).findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Operazione di recupero del prodotto fallita, id prodotto " + req.params.id);
        } else {
            res.status(200).json(doc);
        }
    });
};


exports.aggiornaProdotto = function(req, res) {
    console.log("PUT prodotto con id", req.params.id);
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(PRODOTTI).updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, updateDoc, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Operazione di aggiornamento del prodotto fallita, id prodotto " + req.params.id);
        } else {
            updateDoc._id = req.params.id;
            res.status(200).json(updateDoc);
        }
    });
};


exports.eliminaProdotto = function(req, res) {
    console.log("DELETE prodotto con id", req.params.id);
    db.collection(PRODOTTI).deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function(err, result) {
        if (err) {
            handleError(res, err.message, "Operazione di rimozione del prodotto fallita, id prodotto " + req.params.id);
        } else {
            res.status(200).json(req.params.id);
        }
    });
};