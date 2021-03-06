// Variables ===================================================================
var display = angular.module('SpartanManApp', []);
var orders;
var products;
var statusCodes;
var addOrderIndex = 1;
var shouldIncludeCompleted = true;

// Controller ==================================================================
var dataController = function mainController($scope, $http){

  // ANGULAR METHODS ===========================================================

  $scope.shouldIncludeCompleted = true;

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

  //Get all status codes
  $http({
    method: 'GET',
    url: '/api/getstatuscodes'
  }).then(function(result) {
    $scope.statusCodes = result.data;
    statusCodes = result.data;
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
    // PLus two offests add cell row and header
    let values = getOrderCellValues(index + 2); // 0: name, 1: number, 2: notes, 3: Status, 4: quantity, 5: id
    $http({
      method: 'POST',
      url: '/api/modifyfullorder',
      data: $.param({"name": values[0], "id": values[5], "number": values[1], "notes": values[2], "status": values[3], "quantity": values[4] }),
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
    // Add order cell
    let values = getOrderCellValues(addOrderIndex); // 0: name, 1: number, 2: notes, 3: quantity
    let name = values[0];
    if (name == "") return;
    addOrder(name, values[1], values[2], values[4]);
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

  // cycle ststys with id
  $scope.cycleOrderStatus = function(index) {
    let order = orders[index]
    let status = getOrderCellValues(index+2)[3]  // 3: status
    console.log(index+1);
    //console.log(status);
    var n = 0;
    for (i = 0; i < statusCodes.length; i++) {
      if (statusCodes[i].name == status) {
        n = i;
        break;
      }
    }
    if (n == statusCodes.length - 1 ) {
      n = 0;
    } else {
      n = n + 1;
    }
    document.getElementById(order.id).innerHTML = statusCodes[n].name;
  }

  $scope.clearNewOrder = function() {
    location.reload();
  }

  // Checks if status is complete or not. Resturns true if not complete
  $scope.checkStatusCompleted = function (status) {
    // TODO: Pull from server here
    var completeStatus = "Completed";
    if (status != completeStatus) {
      return true;
    }
    return false;
  }

  // completed button\
  $scope.sortCompleted = function () {
    $scope.shouldIncludeCompleted = !$scope.shouldIncludeCompleted;
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

  // Get the value for all cells in the index row
  function getOrderCellValues(index) {
    var table = document.getElementById('orderTable');
    var values = [];
    for (var c = 0, m = table.rows[index].cells.length; c < m; c++) {
      var v = table.rows[index].cells[c].childNodes[0].value
      if (v == null) {
        v = table.rows[index].cells[c].innerHTML;
      }
      if (c == 0 && index == addOrderIndex) {
        var e = document.getElementById("nameDropdown");
        if (e != null) {
          values.push(e.options[e.selectedIndex].value)
        } else {
          values.push(v);
        }
      } else if (c != table.rows[index].cells.length-1) {
        values.push(v);
      }
    }
    return values;
  }

}

display.controller('dataController', dataController);
