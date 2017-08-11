// Principalmente questo file conterrà le route
angular.module('sitotranquillo').
config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        // imposto il carattere che mi farà capire che sono in una route
        $locationProvider.hashPrefix('!');

        // aggiungo le route
        $routeProvider.
        when('/', {
            template: '<home></home>'
        }).
        otherwise('/');
    }
]);