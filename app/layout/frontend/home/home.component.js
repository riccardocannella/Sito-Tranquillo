// Registra il componente 'home' sul modulo 'home
angular.module('home').component('home', {
    templateUrl: 'layout/frontend/home/home.template.html',
    controller: function($scope,$http) {
        var listaProva = this;
        listaProva.ordinamento = 'nome';

        $http.get('api/v1.0/prodotti').then(function(response) {
            listaProva.prodotti = response.data;
        });
        $scope.IsVisible = true;
        $scope.ShowHide = function () {
            //If DIV is visible it will be hidden and vice versa.
            $scope.IsVisible = $scope.IsVisible ? false : true;
        }
    }
});