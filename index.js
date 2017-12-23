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
app.get('/api/getorders', function(req,res) {

  db.getAllOrders(url, function(err, result) {
    if (err) {
      console.error("Error recieving parts from database");
      return;
    }
    res.send(JSON.stringify(result));
  });
})

app.post('/api/addorder', function(req,res) {
  db.addOrder(url, req.body.name, req.body.number);
  console.log('Added order: ' + req.body.name);
  res.sendFile(__dirname + '/public/orders.html');
});

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
