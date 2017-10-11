'use strict';
module.exports = function(app, db) {
    var apiProdotti = require('../API/apiProdotti.js');
    apiProdotti.setDb(db);
    // Api del db
    app.route('/api/v1.0/prodotti')
        .get(apiProdotti.listaProdotti);
        //.post(apiProdotti.creaProdotto);


    app.route('/api/v1.0/prodotti/:id')
        .get(apiProdotti.dettagliProdotto);
        //.put(apiProdotti.aggiornaProdotto)
        //.delete(apiProdotti.eliminaProdotto);
};