// Definizione del modulo 'dettaglio'
angular.module('dettaglio', [
    'ui.router'
]);

// Registra il componente 'dettaglio' sul modulo 'dettaglio'
angular.module('dettaglio').component('dettaglio', {
    templateUrl: 'layout/frontend/dettaglio/dettaglio.template.html',
    controller: function($http, $stateParams) {
        var dettaglio = this;
        dettaglio.id = $stateParams.id;
        $http.get('api/v1.0/prodotti/' + dettaglio.id).then(function(response) {
            dettaglio.prodotto = response.data;
        });
    }
});