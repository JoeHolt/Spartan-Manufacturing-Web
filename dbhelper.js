// Variables ===================================================================
var mongo = require('mongodb');
var client = mongo.MongoClient;
var url = "mongodb://localhost:27017/"
var db;

client.connect(url + "SpartanMan", function (err, datab){
  if (err) {
    console.error("Error connecting to database");
  }
  db = datab
})

// Functions ===================================================================

// getAllObjects: Returns all objects in a certain collection
exports.getAllObjects = function (collection, callback) {
  db.collection(collection).find({}).sort({ name: 1}).toArray(function(err, result) {
    if (err) {
      console.error("Error finding orders: " + err.stack);
      callback(err);
      return;
    }
    callback(0, result);
    updatePendingProducts()
  });
};

// addOrder: Adds an order with a certain name and number
exports.addOrder = function (name, number, date, notes) {
  db.collection('orders').insert({ "name": name, "number": number, "completed": 'no', "date": date, "notes": notes });
  updatePendingProducts()
}

// deleteOrder: Deletes an order with a certain number
exports.deleteOrder = function (num) {
  db.collection('orders').deleteMany({ "number": Number(num) })
  updatePendingProducts()
};

// modifyInventory: Modifies the inventory
exports.modifyInventory = function (name, num) {
  db.collection('products').update({"name":name}, { $set: {stock:Number(num)}})
};

// maxAttribute: returns the maximum attribute from a collection
exports.maxOrderNumber = function (callback) {
  var max = 0;
  db.collection('orders').find({}).sort({number:-1}).limit(1).toArray(function(err,result) {
    if (err) {
      console.error("Error finding ID");
      callback(err)
      return;
    }
    if (result.length == 0) {
      callback(0, 0);
    } else {
      callback(0, result[0].number)
    }
  });
};

// markCompleted: marks data Completed
exports.markCompleted = function (number, completed) {
    db.collection('orders').update({'number': Number(number)}, {$set: {'completed': completed}});
}

// Other functions =============================================================

// updateProducts: updates the products with how many pending orders there address
var updatePendingProducts = function() {
    db.collection('products').find({}).toArray(function(err, result) {
      if (err) {
        console.error("Error reading from database");
      }
      for (var i = 0; i < result.length; i++) {
        var product_name = result[i].name;
        db.collection('products').update({"name": product_name}, { $set: { "pending": 0 }})
        db.collection('orders').find({"name": product_name}).toArray(function(err,res) {
          if (err) {
            console.error("Error reading orders from database");
          }
          if (typeof res === "undefined") {
            return;
          }
          var pending = res.length;
          if (pending > 0) {
            var n = 0;
            for (var j = 0; j<res.length; j++) {
              if (res[j].completed == 'no') {
                n++;
              }
            }
            db.collection('products').update({"name": res[0].name}, { $set: { "pending": n }})
          }
        })
      }
    });
}
