// Definizione del modulo 'carello'
angular.module('carrello', [
    'ui.router'
]);

// Registra il componente 'carrello' sul modulo 'carrello'
angular.module('carrello').component('carrello', {
    templateUrl: 'layout/frontend/carrello/carrello.template.html',
    controller: function($http, $stateParams, $window, $scope) {
        var carrelloCtrl = this;

        console.log('Lisciami le mele');
        $http({
            method: 'POST',
            url: '/api/v1.0/utenti/getCarrello',
            data: { 'token': $window.localStorage.getItem("jwtToken") }
        }).then(function successCallback(response) {
            carrelloCtrl.carrello = response.data.carrello;
            carrelloCtrl.totaleImporto = 0;
            
            // Calcolo del totale 
            carrelloCtrl.carrello.forEach(function(elemento) {
                carrelloCtrl.totaleImporto += elemento.totale;
            }, this);

            carrelloCtrl.tasse = carrelloCtrl.totaleImporto * 0.22;
            carrelloCtrl.spedizione = 15;
            carrelloCtrl.totaleFinale = carrelloCtrl.totaleImporto + carrelloCtrl.tasse + carrelloCtrl.spedizione;
            console.log(JSON.stringify(carrelloCtrl.carrello));
        }).catch(function errorCallback(response){
            console.log('Errore: ' + response);
        });
        
        // Funzione per la visualizzazione dell'alert dopo aver cliccato sul pulsante Acquista
        $scope.acquisto = 'Il tuo ordine è stato inviato correttamente!!';
        $scope.alertAcquistoEffettuato = function(acquisto) {
            $window.alert(acquisto);
          };
    }
});