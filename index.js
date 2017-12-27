// Variables ===================================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./dbhelper');
var moment = require('moment');

// Set up ======================================================================
app.use(express.static('public'));
app.use(bodyParser.json({ type: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));

// GET/POST requests ===========================================================

// api/getorders: returns all orders in database
app.get('/api/getorders', function(req,res) {
  db.getAllObjects("orders", function(err, result) {
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
  db.getAllObjects("products", function(err, result) {
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
  db.maxOrderNumber(function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    var date = moment().format('YYYY-MM-DD HH:m:s');
    var num = Number(req.body.number);
    if (req.body.number == "") {
      num = Number(result) + 1
    }
    var notes = req.body.notes;
    if (req.body.notes == "") {
      notes = "none";
    }
    db.addOrder(req.body.name, num, date, notes);
    res.redirect('http://localhost:8081/'+'orders.html');
  });
});

// api/deleteorder: deletes an order from the database
app.post('/api/deleteorder', function(req,res) {
  db.deleteOrder(req.body.number);
  res.redirect('http://localhost:8081/'+'orders.html');
})

// api/changeinventory: modifiys object's Inventory
app.post('/api/changeinventory', function(req,res) {
  db.modifyInventory(req.body.name, req.body.inventory);
  res.redirect('http://localhost:8081/'+'inventory.html');
});

// api/completeorder: marks an order as complleted
app.post('/api/completeorder', function(req,res) {
  var c = false;
  if (req.body.completed == 'true' || req.body.completed == true) {
    c = true;
  }
  db.markCompleted(req.body.number, c);
  res.redirect('http://localhost:8081/'+'orders.html');
});

// Server ======================================================================
var server = app.listen(8081, function() {
  var address = server.address().address
	var port = server.address().port
	console.log("Spartan test site listening at http://%s:%s", address, port);
});
