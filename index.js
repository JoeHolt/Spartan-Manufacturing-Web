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

// api/getmaxID: returns the max id
app.get('/api/getmaxid', function(req,res) {
  db.getMaxOrderIntAtribute("id", function(err, result) {
    if (err) {
      console.error("Error getting max id");
      return;
    }
    res.send(JSON.stringify(result));
  })
})

// api/getcurrentdate: returns current Date
app.get('/api/getcurrentdate', function(req,res) {
  var date = moment().format('YYYY-MM-DD HH:m:s');
  res.send(JSON.stringify(date));
})

// api/addorder: adds an order to the database
app.post('/api/addorder', function(req,res) {
  db.getMaxOrderIntAtribute("id", function(err,result) {
    if (err) {
      console.log(err);
      return;
    }
    var date = moment().format('YYYY-MM-DD HH:m:s');
    var num = Number(req.body.number);
    if (req.body.number == "") {
      num = 0
    }
    var q = Number(req.body.quantity);
    if (req.body.quantity == "") {
      q = 1;
    }
    var notes = req.body.notes;
    if (req.body.notes == "") {
      notes = "none";
    }
    db.addOrder(req.body.name, num, date, notes, result+1, q);
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
app.post('/api/modifyinventory', function(req,res) {
  if (!isNaN(req.body.inventory)) {
    db.modifyObject("products", { "name":req.body.name }, { "stock": Number(req.body.inventory) })
  }
  res.redirect('/inventory.html');
});

// api/edit notes: Edits the notes of the productTable
app.post('/api/modifynotes', function(req,res) {
  if (!isNaN(req.body.id)) {
      db.modifyObject("orders", { "id":Number(req.body.id) }, {"notes": req.body.notes})
  }
  res.redirect('/orders.html');
});

// api/modifyquantity: Edits the notes of the productTable
app.post('/api/modifyquantity', function(req,res) {
  if (!isNaN(req.body.id) && !isNaN(req.body.quantity)) {
    db.modifyObject("orders", {"id": Number(req.body.id)}, {"quantity": Number(req.body.quantity)});
  }
  res.redirect('/orders.html');
});

// api/completeorder: marks an order as complleted
app.post('/api/modifystatus', function(req,res) {
  if (!isNaN(req.body.id)) {
    db.modifyObject("orders", {"id": Number(req.body.id)}, {"status": req.body.status});
  }
  res.redirect('/orders.html');
});

// Server ======================================================================
var server = app.listen(8081, function() {
  var address = server.address().address
	var port = server.address().port
	console.log("Spartan test site listening at http://%s:%s", address, port);
});
