'use strict';
module.exports = function(app) {
    var apiImmagini = require('../API/apiImmagini.js');
    // Api del caricamento delle immagini
    app.route('/api/v1.0/immagini')
        .post(apiImmagini.caricaImmagine);
    app.route('/api/v1.0/immagini/:nome')
        .get(apiImmagini.getImmagine)
        .delete(apiImmagini.eliminaImmagine);
};