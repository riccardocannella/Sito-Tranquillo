// Definizione del modulo 'dettaglio'
angular.module('dettaglio', [
    'ngRoute'
]);

// Registra il componente 'dettaglio' sul modulo 'dettaglio'
angular.module('dettaglio').component('dettaglio', {
    templateUrl: 'layout/frontend/dettaglio/dettaglio.template.html',
    controller: function($http, $routeParams) {
        var dettaglio = this;
        dettaglio.id = $routeParams.id;
        $http.get('api/v1.0/prodotti/' + dettaglio.id).then(function(response) {
            dettaglio.prodotto = response.data;
        });
    }
});