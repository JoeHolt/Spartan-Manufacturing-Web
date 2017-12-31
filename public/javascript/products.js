// Variables ===================================================================
var display = angular.module('SpartanManApp', []);
var orders;
var products;
var addOrderIndex = 1;

// Controller ==================================================================
var dataController = function mainController($scope, $http){

  // ANGULAR METHODS ===========================================================

  //Get all orders
  $http({
    method: 'GET',
    url: '/api/getorders'
  }).then(function(result) {
    let sorted = result.data.sort(function(a,b) {return b.number-a.number})
    $scope.orders = sorted;
    orders = sorted;
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
    products = result.data
  }, function(error) {
    console.log(error);
  });

  // Scope Functions ===========================================================

  $scope.updateProduct = function(index) {
    let values = getProductCellValues(index + 1); // 0: name, 1: inventory
    $http({
      method: 'POST',
      url: '/api/modifyfullproduct',
      data: $.param({"name": values[0], "stock": values[1]}),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(result) {
      location.reload();
    }, function(error) {
      console.error(error);
    });
  }

  //Delete product
  $scope.deleteProduct = function(index) {
    let name = products[index].name;
    $http({
      method: 'POST',
      url: '/api/deleteProduct',
      data: $.param({ 'name': name }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(result) {
      location.reload();
    }, function(error) {
      console.error(error);
    });
  }

  $scope.addProduct = function(index) {
    let table = document.getElementById('productTable');
    let values = getProductCellValues(table.rows.length - 1); // 0: name, 1: inventory
    let name = values[0]
    let stock = values[1]
    $http({
      method: 'POST',
      url: '/api/addproduct',
      data: $.param({"name": name, "stock": stock }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(result) {
      location.reload();
    }, function(error) {
      console.error(error);
    });
  }

  // User functions ============================================================

  // Gets the value for a all cells in the add product row
  function getProductCellValues(index) {
    var table = document.getElementById('productTable');
    var values = [];
    for (var c = 0, m = table.rows[index].cells.length; c < m; c++) {
      var v = table.rows[index].cells[c].childNodes[0].value
      if (v == null) {
        v = table.rows[index].cells[c].innerHTML;
      }
      if (c != table.rows[index].cells.length-1) {
        values.push(v);
      }
    }
    return values;
  }

}

display.controller('dataController', dataController);
