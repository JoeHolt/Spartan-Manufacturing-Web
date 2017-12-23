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
