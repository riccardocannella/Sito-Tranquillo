'use strict';
module.exports = function(app) {
    var apiUpload = require('../API/apiUpload.js');
    // Api del caricamento delle immagini
    app.route('/api/v1.0/upload')
        .post(apiUpload.caricaImmagine);
    app.route('/api/v1.0/upload/:nome')
        .get(apiUpload.getImmagine)
        .delete(apiUpload.eliminaImmagine);
};