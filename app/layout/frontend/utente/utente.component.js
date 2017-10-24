// Definizione del modulo 'utente'
angular.module('utente', [
    'ui.router',
    'ngMessages'
]);

// Registra il componente 'home' sul modulo 'home
angular.module('utente').component('utente', {
    templateUrl: 'layout/frontend/utente/utente.template.html',
    controller: function($scope, $http) {
        var ctrl = this;

    }
});