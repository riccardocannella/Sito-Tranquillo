var home = angular.module('home').controller('homeCtrl',['$scope',function($scope){

//This will hide the DIV by default.
$scope.IsVisible = true;
$scope.ShowHide = function () {
    //If DIV is visible it will be hidden and vice versa.
    $scope.IsVisible = $scope.IsVisible ? false : true;
}

}]);