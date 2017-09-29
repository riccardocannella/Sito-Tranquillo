angular.module('reset').component('reset', {
    templateUrl: 'layout/frontend/reset/reset.template.html',
    controller: function($http, $routeParams, $scope) {
        var resetCtrl = this;
        resetCtrl.validaRisposta = function() {
            $http.post('/api/v1.0/utenti/validaRisposta', { username: resetCtrl.nome_utente, risposta_segreta: resetCtrl.risposta })
                .then(function(response) {
                    if (response.data.successo === true)
                        $scope.rispostaGiusta = 1;
                }, function(err) {
                    resetCtrl.risposta = '';
                    $scope.rispostaGiusta = 0;
                });
        };
        resetCtrl.resetPwd = function() {
            $http.post('/api/v1.0/utenti/resetPw', { username: resetCtrl.nome_utente, nuova_password: resetCtrl.password })
                .then(function(resp2) {
                    if (resp2.data.successo === true)
                        $scope.pwResettata = 1;
                }, function(err) {
                    console.log(err);
                })
        };
        $http.post('/api/v1.0/utenti/validaToken', { token: $routeParams.token }).then(function(res) {
            if (res.data.successo === true) {
                resetCtrl.nome_utente = res.data.username;
                resetCtrl.utente = null;
                $http.get('/api/v1.0/utenti/get/' + resetCtrl.nome_utente).then(function(resp) {
                    resetCtrl.utente = resp.data.utente;
                });
                $scope.tokenValido = true;

            } else $scope.tokenValido = false;
        }).catch(function(err) {
            console.log(err);
            $scope.tokenValido = false;
        });
        $scope.rispostaGiusta = -1;
        $scope.pwResettata = -1
    }
});