// Variables ===================================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./dbhelper');
var url = "mongodb://localhost:27017/";         // Database url

// Set up ======================================================================
app.use(express.static('public'));
app.use(bodyParser.json({ type: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));

// GET/POST requests ===========================================================

// api/getorders: returns all orders in database
app.get('/api/getorders', function(req,res) {
  db.getAllObjects(url, "orders", function(err, result) {
    if (err) {
      console.error("Error recieving parts from database");
      return;
    }
    result.sort(function(a,b){return a.number - b.number});
    res.send(JSON.stringify(result));
  });
})

// api/getproducts: returns all products in database
app.get('/api/getproducts', function(req,res) {
  db.getAllObjects(url, "products", function(err, result) {
    if (err) {
      console.error("Error recieving parts from database");
      return;
    }
    result.sort(function(a,b){return a.name - b.name});
    res.send(JSON.stringify(result));
  })
})

// api/addorder: adds an order to the database
app.post('/api/addorder', function(req,res) {
  db.maxOrderNumber(url, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    var date = (new Date()).toString();
    var num = Number(req.body.number);
    if (req.body.number == "") {
      num = Number(result) + 1
    }
    var notes = req.body.notes;
    if (req.body.notes == "") {
      notes = "none";
    }
    db.addOrder(url, req.body.name, num, date, notes);
    console.log('Added order: ' + req.body.name);
    res.sendFile(__dirname + '/public/orders.html');
  });
});

// api/deleteorder: deletes an order from the database
app.post('/api/deleteorder', function(req,res) {
  db.deleteOrder(url, req.body.number);
  console.log('Deleting order number: ' + req.body.number);
  res.sendFile(__dirname + '/public/orders.html');
})

// Server ======================================================================
var server = app.listen(8081, function() {
  var address = server.address().address
	var port = server.address().port
	console.log("Spartan test site listening at http://%s:%s", address, port);
});
