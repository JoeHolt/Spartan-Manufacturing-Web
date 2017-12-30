// Variables ===================================================================
var display = angular.module('SpartanManApp', []);
var orders;

// Controller ==================================================================
var dataController = function mainController($scope, $http){

  //Get all orders
  $http({
    method: 'GET',
    url: '/api/getorders'
  }).then(function(result) {
    $scope.orders = result.data
    orders = result.data
  }, function(error) {
    console.log(error);
  });

  //Get all products
  $http({
    method: 'GET',
    url: '/api/getproducts'
  }).then(function(result) {
    // console.log(result.data);
    $scope.products = result.data
  }, function(error) {
    console.log(error);
  });

  //Get all status codes
  $http({
    method: 'GET',
    url: '/api/getstatuscodes'
  }).then(function(result) {
    $scope.statusCodes = result.data
  }, function(error) {
    console.error(error);
  });

  //Max order Number
  $http({
    method: 'GET',
    url: '/api/getmaxid'
  }).then(function(result) {
    $scope.maxID = Number(result.data)
  }, function(error) {
    console.error(error);
  });

  //Current date
  $http({
    method: 'GET',
    url: '/api/getcurrentdate'
  }).then(function(result) {
    $scope.date = result.data.replace(/['"]+/g, '')
  }, function(error) {
    console.error(error);
  });

  //Delete object
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

  //Add orders
  $scope.addOrder = function(index) {
    let values = GetCellValues();
    let name = values[0];
    let num = values[1];
    let notes = values[2];
    $http({
      method: 'POST',
      url: '/api/addorder',
      data: $.param({"name": name, "number": num, "notes": notes }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(result) {
      location.reload();
    }, function(error) {
      console.error(error);
    });
  }

  function GetCellValues() {
    var table = document.getElementById('orderTable');
    var values = [];
    for (var c = 0, r = table.rows.length - 1, m = table.rows[r].cells.length; c < m; c++) {
      var v = table.rows[table.rows.length-1].cells[c].childNodes[0].value
      if (v == null) {
        v = table.rows[table.rows.length-1].cells[c].innerHTML;
      }
      if (c != table.rows[r].cells.length-1) {
        values.push(v);
      }
    }
    return values;
  }

}

display.controller('dataController', dataController);
