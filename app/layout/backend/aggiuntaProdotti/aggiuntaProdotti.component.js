// Registra il componente 'aggiuntaProdotti' sul modulo 'aggiuntaProdotti'
angular.module('aggiuntaProdotti').component('aggiuntaProdotti', {
    templateUrl: 'layout/backend/aggiuntaProdotti/aggiuntaProdotti.template.html',
    controller: function(Upload, $http, $location) {
        var aggiuntaProdotto = this;
        aggiuntaProdotto.aggiungiProdotto = function() {
            // validazione immagine da fare (come?)
            // intanto controllo se c'è
            if (aggiuntaProdotto.immagine) {
                Upload.upload({
                    url: '/api/v1.0/immagini',
                    data: { file: aggiuntaProdotto.immagine }
                }).then(function(resp) {
                    if (resp.data.error_code === 0) {
                        // valida
                        aggiuntaProdotto.prodotto.urlImmagine = resp.data.nomeFile;
                        $http.post('api/v1.0/prodotti', aggiuntaProdotto.prodotto).then(
                            function(res) {
                                $location.path('');
                            }
                        )
                    } else {
                        // errore
                        console.log('errore nell\'invio dell\'immagine');
                    }
                }, function(resp) {
                    console.log('Error status: ' + resp.status);
                });
            }
        };
    }
});