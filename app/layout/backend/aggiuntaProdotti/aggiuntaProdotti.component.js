// Registra il componente 'aggiuntaProdotti' sul modulo 'aggiuntaProdotti'
angular.module('aggiuntaProdotti').component('aggiuntaProdotti', {
    templateUrl: 'layout/backend/aggiuntaProdotti/aggiuntaProdotti.template.html',
    controller: function($http, $location) {
        var aggiuntaProdotto = this;
        aggiuntaProdotto.aggiungiProdotto = function() {
            $http.post('api/v1.0/prodotti', aggiuntaProdotto.prodotto).then(
                function(res) {
                    $location.path('');
                }
            )
        };
    }
});