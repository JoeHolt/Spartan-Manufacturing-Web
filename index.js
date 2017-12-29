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

// api/getStatusCodes: gets all status getStatusCodes
app.get('/api/getstatuscodes', function(req,res) {
  db.getAllObjects("statusCodes", function(err,result) {
    if (err) {
      console.error("Error getting codes");
      return;
    }
    res.send(JSON.stringify(result));
  })
})

// api/addorder: adds an order to the database
app.post('/api/addorder', function(req,res) {
  db.maxOrderID(function(err,result) {
    if (err) {
      console.log(err);
      return;
    }
    var date = moment().format('YYYY-MM-DD HH:m:s');
    var num = Number(req.body.number);
    if (req.body.number == "") {
      num = 0
    }
    var notes = req.body.notes;
    if (req.body.notes == "") {
      notes = "none";
    }
    db.addOrder(req.body.name, num, date, notes, result+1);
    res.redirect('/orders.html');
  })
});

// api/addproduct
app.post('/api/addproduct', function(req,res) {
  db.addProduct(req.body.name, req.body.stock)
  res.redirect('/inventory.html')
})

// api/deleteorder: deletes an order from the database
app.post('/api/deleteorder', function(req,res) {
  var n = 0;
  if (Number(req.body.id) === parseInt(req.body.id, 10)) {
    db.deleteOrder(Number(req.body.id));
  }
  res.redirect('/orders.html');
})

// api/deleteproduct: deletes an order from the database
app.post('/api/deleteproduct', function(req,res) {
  db.deleteProduct(req.body.name);
  res.redirect('/inventory.html');
})

// api/changeinventory: modifiys object's Inventory
app.post('/api/changeinventory', function(req,res) {
  db.modifyInventory(req.body.name, req.body.inventory);
  res.redirect('http://localhost:8081/'+'inventory.html');
});

// api/completeorder: marks an order as complleted
app.post('/api/modifystatus', function(req,res) {
  db.modifyStatus(req.body.id, req.body.status);
  res.redirect('/orders.html');
});

// Server ======================================================================
var server = app.listen(8081, function() {
  var address = server.address().address
	var port = server.address().port
	console.log("Spartan test site listening at http://%s:%s", address, port);
});
