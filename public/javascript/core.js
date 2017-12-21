// Variables ===================================================================
var display = angular.module('SpartanManApp', []);

// Controller ==================================================================
var dataController = function mainController($scope, $http){

  $http({
    method: 'GET',
    url: '/api/getorders'
  }).then(function(result) {
    $scope.orders = result.data
  }, function(error) {
    console.log(console.error());
  });

}

display.controller('dataController', dataController);
