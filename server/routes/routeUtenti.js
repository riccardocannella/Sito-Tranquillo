'use strict';
module.exports = function(app, db) {
    var apiUtenti = require('../API/apiUtenti.js');
    
    // Api degli utenti
    app.route('/api/v1.0/utenti/registrazione')
        .post(apiUtenti.registraUtente);

    app.route('/api/v1.0/utenti/login')
        .post(apiUtenti.loginUtente);

    app.route('/api/v1.0/utenti/recuperopw')
        .post(apiUtenti.recuperoPassword);

    app.route('/api/v1.0/utenti/richiestarecuperopw')
        .post(apiUtenti.richiestaRecuperoPassword);
    
    app.route('/api/v1.0/utenti/aggiungialcarrello')
        .post(apiUtenti.aggiungiAlCarrello);
};