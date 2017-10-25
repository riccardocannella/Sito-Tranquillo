// Definizione del modulo 'listaProdotti'
angular.module('listaProdotti', [
    'ui.router'
]);

// Registra il componente 'listaProdotti' sul modulo 'listaProdotti'
angular.module('listaProdotti').component('listaProdotti', {
    templateUrl: 'layout/backend/listaProdotti/listaProdotti.template.html'
});