// Variables ===================================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var orders = [{ 'name': 'Test P1', 'number': 000001, 'completed': 'yes' }];

// Set up ======================================================================
app.use(express.static('public'));
app.use(bodyParser.json({ type: '*' }));
app.use(bodyParser.urlencoded({ extended: false }));

// GET/POST requests ===========================================================
app.get('/api/getorders', function(req,res) {
  res.send(JSON.stringify(orders));
})

app.post('/api/addorder', function(req,res) {
  order = { 'name': req.body.name, 'number': req.body.order, 'completed': 'yes' }
  orders.push(order)
  console.log('Added order: ' + req.body.name);
  res.sendFile(__dirname + '/public/orders.html');
});

// Server ======================================================================
var server = app.listen(8081, function() {
  var address = server.address().address
	var port = server.address().port
	console.log("Spartan test site listening at http://%s:%s", address, port);
});
