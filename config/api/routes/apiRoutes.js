'use strict';
module.exports = function(app, db) {
    var api = require('../controllers/apiController.js');
    api.setDb(db);
    // Api del db
    app.route('/api/v1.0/prodotti')
        .get(api.listaProdotti)
        .post(api.creaProdotto);


    app.route('/api/v1.0/prodotti/:id')
        .get(api.dettagliProdotto)
        .put(api.aggiornaProdotto)
        .delete(api.eliminaProdotto);
};