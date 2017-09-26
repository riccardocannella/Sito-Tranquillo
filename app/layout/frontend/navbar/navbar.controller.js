var sitotranquillo = angular.module('sitotranquillo');

sitotranquillo.controller('navbarCtrl', ['$scope','$location','$window',function($scope, $location, $window){
    $scope.nome_utente = "corrado";
    
    $scope.$on('$locationChangeSuccess', function() {
        if($window.localStorage.getItem("jwtToken") == "" || $window.localStorage.getItem("jwtToken") == undefined){
            $scope.navbarTemplate = 'layout/frontend/navbar/navbar.noautenticazione.template.html';
        } else {
            $scope.navbarTemplate = 'layout/frontend/navbar/navbar.siautenticazione.template.html';
        }
    });

    //Logout function
    $scope.logout = function(){
        $window.localStorage.setItem("jwtToken", "");
        $location.path("/");
    };

}]);