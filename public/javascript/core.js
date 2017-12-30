// Variables ===================================================================
var display = angular.module('SpartanManApp', []);
var orders;
var products;

// Controller ==================================================================
var dataController = function mainController($scope, $http){

  // ANGULAR METHODS ===========================================================

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
    products = result.data
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

  // Scope Functions ===========================================================

  //Delete object
  $scope.deleteOrder = function(index) {
    let id = orders[index].id;
    deleteOrder(id);
  }

  $scope.updateOrder = function(index) {
    let values = getOrderCellValues(index + 1); // 0: name, 1: number, 2: notes, 4: quantity, 5: id
    $http({
      method: 'POST',
      url: '/api/modifyfullorder',
      data: $.param({"name": values[0], "id": values[5], "number": values[1], "notes": values[2], "quantity": values[4] }),
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

  //Add orders
  $scope.addOrder = function() {
    let table = document.getElementById('orderTable');
    let values = getOrderCellValues(table.rows.length - 1); // 0: name, 1: number, 2: notes, 3: quantity
    let name = values[0];
    if (name == "") return;
    addOrder(name, values[1], values[2], values[4]);
  }

  $scope.addProduct = function(index) {
    let values = getProductCellValues()
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

  $scope.clearNewOrder = function() {
    location.reload();
  }

  // User functions ============================================================

  // deletes order
  function deleteOrder(id) {
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

  // adds order
  function addOrder(name, num, notes, quantity) {
    $http({
      method: 'POST',
      url: '/api/addorder',
      data: $.param({"name": name, "number": num, "notes": notes, "quantity": quantity }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(result) {
      location.reload();
    }, function(error) {
      console.error(error);
    });
  }

  // Gets the value for a all cells in the add product row
  function getProductCellValues() {
    var table = document.getElementById('productTable');
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

  // Get the value for all cells in the index row
  function getOrderCellValues(index) {
    var table = document.getElementById('orderTable');
    var values = [];
    for (var c = 0, m = table.rows[index].cells.length; c < m; c++) {
      var v = table.rows[index].cells[c].childNodes[0].value
      if (v == null) {
        v = table.rows[index].cells[c].innerHTML;
      }
      if (c == 0 && index == table.rows.length-1) {
        var e = document.getElementById("nameDropdown");
        values.push(e.options[e.selectedIndex].value)
      } else if (c != table.rows[index].cells.length-1) {
        values.push(v);
      }
    }
    return values;
  }

}

display.controller('dataController', dataController);
