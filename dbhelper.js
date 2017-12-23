// Variables ===================================================================
var mongo = require('mongodb');
var client = mongo.MongoClient;

// Functions ===================================================================

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

exports.addOrder = function (url, name, number) {
  client.connect(url + "SpartanMan", function(err, db) {
    if (err) {
      console.error('Error connection to database: ' + err.stack);
      callback(err);
      return;
    }
    db.collection('orders').insert({ "name": name, "number": number, completed: 'no' });
    db.close;
  })
}

exports.deleteOrder = function (url, number) {
  client.connect(url + "SpartanMan", function(err, db) {
    if (err) {
      console.error("Error connecting to database");
      callback(err);
      return;
    }
    var result = db.collection("orders").deleteMany({ "number": number })
    db.close;
  });
};
