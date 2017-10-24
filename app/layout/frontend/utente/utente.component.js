// Definizione del modulo 'utente'
angular.module('utente', [
    'ui.router',
    'ngMessages'
]);

// Registra il componente 'utente' sul modulo 'utente'
angular.module('utente').component('utente', {
    templateUrl: 'layout/frontend/utente/utente.template.html',
    controller: function($scope, $http, $window, $location) {
        var ctrl = this;
        var utenteOrig;
        $scope.richiestaEliminazione = 0;
        $scope.utenteEliminato = 0;
        if ($window.localStorage.getItem("jwtToken") == undefined || $window.localStorage.getItem("jwtToken") == '')
            $location.path('/autenticazione');
        else {
            $http.post('api/v1.0/utenti/get', { token: $window.localStorage.getItem("jwtToken") }).then(function(response) {
                console.log(response);
                ctrl.utente = response.data;
                delete ctrl.utente._id;
                utenteOrig = angular.copy(ctrl.utente);
            });
        }
        ctrl.reset = function() {
            ctrl.utente = angular.copy(utenteOrig);
        };
        ctrl.aggiornaUtente = function() {
            ctrl.utente.token = $window.localStorage.getItem("jwtToken");
            $http.put('api/v1.0/utenti/aggiorna', ctrl.utente).then(
                function(res) {
                    $window.location.reload();
                },
                function(err) {
                    console.log('errore!\n', err.data);
                }
            )
        };
        ctrl.chiediConferma = function() {
            $scope.richiestaEliminazione = 1;
        };
        ctrl.tornaIndietro = function() {
            $scope.richiestaEliminazione = 0;
        };
        ctrl.eliminaUtente = function() {
            $http.post('api/v1.0/utenti/elimina', { token: $window.localStorage.getItem("jwtToken") })
                .then(function(res) {
                    $window.localStorage.setItem("jwtToken", "");
                    $window.localStorage.setItem("username", "");
                    alert('Il tuo account utente è stato eliminato. Clicca su Ok per tornare alla home.')
                    $location.path('/');
                })
        }
    }
});