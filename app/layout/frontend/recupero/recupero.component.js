// Registra il componente 'recupero' sul modulo 'recupero'
angular.module('recupero').component('recupero', {
    templateUrl: 'layout/frontend/recupero/recupero.template.html',
    controller: function($http, $scope, $location) {
        var recuperoPwd = this;
        $scope.formSubmitted = false;
        $scope.utenteEsistente = true; // per non far vedere il messaggio prima del tempo
        recuperoPwd.checkUtente = function() {
            if (recuperoPwd.utente.nome)
                $http.post('api/v1.0/utenti/richiestarecuperopw', { username: recuperoPwd.utente.nome, indirizzo: $location.protocol() + "://" + $location.host() + ":" + $location.port() + '/recupero/' }).then(function(res) {
                    if (res.data.successo === true) {
                        $scope.utenteEsistente = 1;
                        $scope.formSubmitted = true;
                    } else $scope.utenteEsistente = false;
                });
        };
    }
});