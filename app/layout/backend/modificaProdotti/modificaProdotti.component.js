// Registra il componente 'modificaProdotti' sul modulo 'modificaProdotti'
angular.module('modificaProdotti').component('modificaProdotti', {
    templateUrl: 'layout/backend/modificaProdotti/modificaProdotti.template.html',
    controller: function(Upload, $http, $location, $routeParams) {
        var modificaProdotti = this;
        var id = $routeParams.id;
        var prodottoOrig;
        $http.get('api/v1.0/prodotti/' + id).then(function(response) {
            modificaProdotti.prodotto = response.data;
            delete modificaProdotti.prodotto._id;
            prodottoOrig = angular.copy(modificaProdotti.prodotto);
        });
        modificaProdotti.reset = function() {
            modificaProdotti.prodotto = angular.copy(prodottoOrig);
        }
        modificaProdotti.aggiornaProdotto = function() {
            if (modificaProdotti.immagine) {
                Upload.upload({
                    url: '/api/v1.0/upload',
                    data: { file: modificaProdotti.immagine }
                }).then(function(resp) {
                    if (resp.data.error_code === 0) {
                        // valida
                        // magari dovrei fare in modo che la vecchia immagine venga cancellata?
                        modificaProdotti.prodotto.urlImmagine = resp.data.nomeFile;
                        $http.put('api/v1.0/prodotti/' + id, modificaProdotti.prodotto).then(
                            function(res) {
                                $location.path('');
                            },
                            function(err) {
                                console.log('errore!\n', err.data);
                            }
                        )
                    }
                });
            }
        }
    }
});