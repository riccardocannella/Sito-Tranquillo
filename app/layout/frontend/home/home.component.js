// Definizione del modulo 'home'
angular.module('home', [
    'ngRoute'
]);

// Registra il componente 'home' sul modulo 'home
angular.module('home').component('home', {
    templateUrl: 'layout/frontend/home/home.template.html',
    controller: function($scope, $http) {
        var listaProva = this;
        listaProva.ordinamento = 'nome';

        $http.get('api/v1.0/prodotti').then(function(response) {
            listaProva.prodotti = response.data;
        });

        //Funzione per chiudere e riaprire la sidebar nella home page
        $scope.IsVisible = true;
        $scope.ShowHide = function() {
            //Se la sidebar è visibile allora verrà chiusa e viceversa
            if ($scope.IsVisible == true) {
                $scope.IsVisible = false;
            } else {
                $scope.IsVisible = true;
            }
        }
    }
});