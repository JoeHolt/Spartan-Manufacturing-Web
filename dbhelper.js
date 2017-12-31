// Variables ===================================================================
var mongo = require('mongodb');
var client = mongo.MongoClient;
var url = "mongodb://localhost:27017/"
var db;

client.connect(url + "SpartanMan", function (err, datab){
  if (err) {
    console.error("Error connecting to database");
  }
  console.log("Connected to database...");
  db = datab
})

// Functions ===================================================================

// getMaxOrderIntAtribute: returns the max integer attribute from order
exports.getMaxOrderIntAtribute = function (atribute, callback) {
  var max = 0;
  var a = {}
  a[atribute] = -1;
  db.collection('orders').find({}).sort(a).limit(1).toArray(function(err,result) {
    if (err) {
      console.error("Error finding " + atribute);
      callback(err)
      return;
    }
    if (result.length == 0) {
      callback(0, 0);
    } else {
      callback(0, result[0][atribute])
    }
  });
}

// getAllObjects: Returns all objects in a certain collection
exports.getAllObjects = function (collection, callback) {
  db.collection(collection).find({}).sort({ name: 1}).toArray(function(err, result) {
    if (err) {
      console.error("Error finding orders: " + err.stack);
      callback(err);
      return;
    }
    callback(0, result);
  });
};

// addObject: Adds the given object to a given collection
exports.addObject = function (collection, object) {
  db.collection(collection).insert(object);
  updatePendingProducts()
}

// deleteObject: Deletes an object from a given collection that matches a specific case
exports.deleteObject = function (collection, matchCase) {
  db.collection(collection).deleteMany(matchCase);
  updatePendingProducts()
}

// modifyObject: modifies an object
exports.modifyObject = function (collection, matchCase, changeCase) {
  db.collection(collection).update(matchCase, { $set: changeCase })
  updatePendingProducts()
}


// Other functions =============================================================

// updateProducts: updates the products with how many pending orders there address
var updatePendingProducts = function() {
    //Gets all prodcuts - loop over these and see how many pending there are
    db.collection('products').find({}).toArray(function(err, products) {
      if (err) {
        console.error("Error reading from database");
      }
      // Loop over all of the products for a given product to get given values
      for (var i = 0; i < products.length; i++) {
        var product_name = products[i].name;
        db.collection('products').update({"name": product_name}, { $set: { "pending": 0 }})
        db.collection('orders').find({"name": product_name}).toArray(function(err,orders) {
          if (err) {
            console.error("Error reading orders from database");
          }
          //Check if there are any orders with name, loop over
          if (orders.length > 0) {
            var pending = 0;
            // Loop over orders
            exports.getAllObjects('statusCodes', function(err, statusCodes) {
              for (var j = 0; j<orders.length;j++) {
                let status = orders[j].status;
                let index = findIndexOfNameInArray(status, statusCodes);
                if (statusCodes[index].finished == false) {
                  pending += Number(orders[j].quantity);
                }
              }
              db.collection('products').update({"name": orders[0].name}, { $set: { "pending": Number(pending) }})
              return;
            })
            db.collection('products').update({"name": orders[0].name}, { $set: { "pending": Number(pending) }})
          }
        })
      }
    });
}

// findIndexOfValueInArray
var findIndexOfNameInArray = function(value, arr) {
  for (i = 0; i < arr.length; i++) {
    if (arr[i].name == value) {
      return i;
    }
  }
}
