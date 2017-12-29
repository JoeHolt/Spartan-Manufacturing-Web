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
    console.log(error);
  });

  $http({
    method: 'GET',
    url: '/api/getproducts'
  }).then(function(result) {
    // console.log(result.data);
    $scope.products = result.data
  }, function(error) {
    console.log(error);
  });

  $http({
    method: 'GET',
    url: '/api/getstatuscodes'
  }).then(function(result) {
    console.log(result.data);
    $scope.statusCodes = result.data
  }, function(error) {
    console.error(error);
  });

}

display.controller('dataController', dataController);
