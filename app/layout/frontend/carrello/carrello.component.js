'use strict';
// Definizione del modulo 'carello'
angular.module('carrello', [
    'ui.router'
]);

// Registra il componente 'carrello' sul modulo 'carrello'
angular.module('carrello').component('carrello', {
    templateUrl: 'layout/frontend/carrello/carrello.template.html',
    controller: function($http, $stateParams, $window, $scope) {
        var carrelloCtrl = this;

        carrelloCtrl.getCarrello = function(){
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
    
                carrelloCtrl.tasse = Number((carrelloCtrl.totaleImporto * 0.22).toFixed(2));
                carrelloCtrl.spedizione = 15;
                carrelloCtrl.totaleFinale = (carrelloCtrl.totaleImporto + carrelloCtrl.spedizione + carrelloCtrl.tasse).toFixed(2);

                console.log(JSON.stringify(carrelloCtrl.carrello));
            }).catch(function errorCallback(response){
                console.log('Errore: ' + response);
            });
        };
        carrelloCtrl.aggiungiAlCarrello = function(idprodotto){
            $http({
                method: 'POST',
                url: '/api/v1.0/utenti/aggiungialcarrello',
                data: { 'token': $window.localStorage.getItem("jwtToken"), 'prodotto':idprodotto,'quantita':1 }
            }).then(function successCallback(response){
                if(response.data.successo == true){
                    // Aggiorno il carrello
                    carrelloCtrl.getCarrello();
                } else {
                    alert('impossibile aggiungere un altro prodotto');
                    // Aggiorno il carrello
                    carrelloCtrl.getCarrello();
                }
                
            }).catch(function errorCallback(response){
                alert('impossibile aggiungere un altro prodotto')
            });
        };

        carrelloCtrl.rimuoviDalCarrello = function(idprodotto,quantitaPresente){
            console.log(quantitaPresente);
            if(quantitaPresente == 1){
                alert('Impossibile scendere sotto ad 1 di quantità, per rimuovere il prodotto selezionare il tasto apposito');
                return;
            }
            
            $http({
                method: 'POST',
                url: '/api/v1.0/utenti/rimuovidalcarrello',
                data: { 'token': $window.localStorage.getItem("jwtToken"), 'prodotto':idprodotto,'quantita':1 }
            }).then(function successCallback(response){
                if(response.data.successo == true){
                    // Aggiorno il carrello
                    carrelloCtrl.getCarrello();
                } else {
                    alert("non è stato possibile rimuovere il prodotto, ci scusiamo per il disagio");
                    // Aggiorno il carrello
                    carrelloCtrl.getCarrello();
                }
            }).catch(function errorCallback(response){
                console.log('not ok');
            });
        };

        carrelloCtrl.rimuoviProdotto = function(idprodotto,quantitaPresente){
            console.log(quantitaPresente);
            
            $http({
                method: 'POST',
                url: '/api/v1.0/utenti/rimuovidalcarrello',
                data: { 'token': $window.localStorage.getItem("jwtToken"), 'prodotto':idprodotto,'quantita':quantitaPresente }
            }).then(function successCallback(response){
                if(response.data.successo == true){
                    // Aggiorno il carrello
                    carrelloCtrl.getCarrello();
                } else {
                    alert("non è stato possibile rimuovere i prodotti, ci scusiamo per il disagio");
                    // Aggiorno il carrello
                    carrelloCtrl.getCarrello();
                }
            }).catch(function errorCallback(response){
                console.log('not ok');
            });
        }

        carrelloCtrl.acquistaTutto = function(){
            
            $http({
                method: 'POST',
                url: '/api/v1.0/utenti/acquistaProdottiNelCarrello',
                data: { 'token': $window.localStorage.getItem("jwtToken")}
            }).then(function successCallback(response){
                if(response.data.successo == true){
                    if(response.data.carrello_aggiornato == false){
                        alert('Grazie per aver acquistato da noi.');
                        carrelloCtrl.getCarrello();
                    } else {
                        alert('Carrello sincronizzato col database, perfavore riesegui acquisto');
                        carrelloCtrl.getCarrello();
                    }
                } else {
                    alert('errore acquisto');
                }
            }).catch(function errorCallback(response){
                alert('errore acquisto');
            });
        };

        // Eseguo al caricamento della pagina
        carrelloCtrl.getCarrello();

    }
});