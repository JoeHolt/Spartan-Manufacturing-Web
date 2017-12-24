// Variables ===================================================================
var mongo = require('mongodb');
var client = mongo.MongoClient;

// Functions ===================================================================

// getAllObjects: Returns all objects in a certain collection
exports.getAllObjects = function (url, collection, callback) {
  client.connect(url + "SpartanMan", function(err, db) {
    if (err) {
      console.error("Error connecting to database: " + err.stack);
      callback(err);
      return;
    }
    db.collection(collection).find({}).sort({ name: 1}).toArray(function(err, result) {
      if (err) {
        console.error("Error finding orders: " + err.stack);
        callback(err);
        return;
      }
      console.log(result.length + " objects found in " + collection);
      callback(0, result);
      updatePendingProducts(url)
      db.close;
    });
  });
};

// addOrder: Adds an order with a certain name and number
exports.addOrder = function (url, name, number, date, notes) {
  client.connect(url + "SpartanMan", function(err, db) {
    if (err) {
      console.error('Error connection to database: ' + err.stack);
      return;
    }
    db.collection('orders').insert({ "name": name, "number": number, "completed": 'no', "date": date, "notes": notes });
    updatePendingProducts(url)
    db.close;
  })
}

// deleteOrder: Deletes an order with a certain number
exports.deleteOrder = function (url, num) {
  client.connect(url + "SpartanMan", function(err, db) {
    if (err) {
      console.error("Error connecting to database");
      return;
    }
    db.collection('orders').deleteMany({ "number": Number(num) })
    updatePendingProducts(url)
    db.close;
  });
};

// modifyInventory: Modifies the inventory
exports.modifyInventory = function (url, name, num) {
  client.connect(url + "SpartanMan", function(err, db) {
    if (err) {
      console.error('Error connecting to database');
      return;
    }
    db.collection('products').update({"name":name}, { $set: {stock:num}})
    db.close;
  });
};

// maxAttribute: returns the maximum attribute from a collection
exports.maxOrderNumber = function (url, callback) {
  var max = 0;
  client.connect(url + "SpartanMan", function(err, db) {
    if (err) {
      console.error("Error connecting to database");
      callback(err);
      return;
    }
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
  });
};

// markCompleted: marks data Completed
exports.markCompleted = function (url, number, completed) {
  client.connect(url + "SpartanMan", function(err, db) {
    if (err) {
      console.error("Error connecting to database");
      return;
    }
    db.collection('orders').update({'number': Number(number)}, {$set: {'completed': completed}});
    db.close;
  });

}

// Other functions =============================================================

// updateProducts: updates the products with how many pending orders there address
var updatePendingProducts = function(url) {
  client.connect(url + 'SpartanMan', function(err, db) {
    if (err) {
      console.error('Error connecting to databse');
      return;
    }
    db.collection('products').find({}).toArray(function(err, result) {
      if (err) {
        console.error("Error reading from database");
      }
      console.log("Length: " + result.length);
      for (var i = 0; i < result.length; i++) {
        var product_name = result[i].name;
        db.collection('products').update({"name": product_name}, { $set: { "pending": 0 }})
        db.collection('orders').find({"name": product_name}).toArray(function(err,res) {
          if (err) {
            console.error("Error reading orders from database");
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
      db.close;
    });
  });
}
