var express = require('express');
var app = express();
var server = require('http').createServer(app);  

var PORT = process.env.PORT || 3000;
var ENV = process.env.NODE_ENV || 'development';

// CORS handling
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.listen(PORT);
console.log('Node environment:', ENV)
console.log('Server listening on port', PORT);
app.use(express.static(__dirname + '/../client/dist'));