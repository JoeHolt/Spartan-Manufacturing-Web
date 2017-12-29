// Variables ===================================================================
var display = angular.module('SpartanManApp', []);
var orders;

// Controller ==================================================================
var dataController = function mainController($scope, $http){

  $http({
    method: 'GET',
    url: '/api/getorders'
  }).then(function(result) {
    $scope.orders = result.data
    orders = result.data
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
    $scope.statusCodes = result.data
  }, function(error) {
    console.error(error);
  });

  $scope.delete = function(index) {
    let id = orders[index].id
    console.log(id);

    $http({
      method: 'POST',
      url: '/api/deleteorder',
      data: $.param({ 'id': id }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(result) {
      location.reload();
    }, function(error) {
      console.error(error);
    });

  }

}

display.controller('dataController', dataController);
