'use strict';
module.exports = function(app, db) {
    var apiUtenti = require('../API/apiUtenti.js');
    apiUtenti.setDb(db);
    // Api degli utenti
    app.route('/api/v1.0/utenti/registrazione')
        .post(apiUtenti.registraUtente);

    app.route('/api/v1.0/utenti/login')
        .post(apiUtenti.loginUtente);
};