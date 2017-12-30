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
exports.addOrder = function (name, number, date, notes, id, q) {
  db.collection('orders').insert({ "name": name, "number": Number(number), "status": "Pending start", "date": date, "notes": notes, id: id, "quantity": q });
  updatePendingProducts()
}

// addproduct: adds a new products
exports.addProduct = function (name, stock) {
  let n = 0;
  if (!isNaN(stock)) {
    n = Number(stock)
  }
  db.collection('products').insert({ "name":name, "stock": n})
  updatePendingProducts()
}

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

// deleteObject: Deletes an object from a given collection that matches a specific case
exports.deleteObject = function (collection, matchCase) {
  db.collection(collection).deleteMany(matchCase);
}

// modifyObject: modifies an object
exports.modifyObject = function (collection, matchCase, changeCase) {
  db.collection(collection).update(matchCase, { $set: changeCase })
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
          //Pending is the order that have that name
          if (pending > 0) {
            var n = 0;
            for (var j = 0; j<pending;j++) {
              if (res[j].status != "Completed") {
                n += Number(res[j].quantity);
              }
            }
            db.collection('products').update({"name": res[0].name}, { $set: { "pending": n }})
          }
        })
      }
    });
}
