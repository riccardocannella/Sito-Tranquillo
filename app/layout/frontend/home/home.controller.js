var home = angular.module('home');

autenticazione.controller('homeCtrl', function($scope){

//This will hide the DIV by default.
$scope.IsVisible = true;
$scope.ShowHide = function () {
    //If DIV is visible it will be hidden and vice versa.
    $scope.IsVisible = $scope.IsVisible ? false : true;
}

}]);