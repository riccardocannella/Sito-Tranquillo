var express = require('express');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

// istruisco il server su quale cartella usare come radice
var wwwRoot = __dirname + '/app/';
app.use(express.static(wwwRoot));

var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log('Server in ascolto sulla porta', port);
});