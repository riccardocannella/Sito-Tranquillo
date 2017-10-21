// Definizione del modulo 'navbar'
var navbar = angular.module('navbar', [
    'ui.router'
]);

navbar.controller('navbarCtrl', ['$scope', '$location', '$window', function($scope, $location, $window) {
    $scope.nome_utente = "";
    $scope.$on('$locationChangeSuccess', function() {
        if ($window.localStorage.getItem("jwtToken") == "" || $window.localStorage.getItem("jwtToken") == undefined) {
            $scope.navbarTemplate = 'layout/frontend/navbar/navbar.noautenticazione.template.html';
        } else {
            $scope.navbarTemplate = 'layout/frontend/navbar/navbar.siautenticazione.template.html';
            $scope.nome_utente = $window.localStorage.getItem("username");
        }
    });

    //Logout function
    $scope.logout = function() {
        $window.localStorage.setItem("jwtToken", "");
        $window.localStorage.setItem("username", "");

        if (window.location.pathname == "/") {
            $window.location.reload();
        } else {
            $location.path("/");
        }
    };

}]);