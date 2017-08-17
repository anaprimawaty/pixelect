var express = require('express');
var app = express();

var users = require('./server/users');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users', users);

app.get('/', function(req, res) {
	res.send("hello world");
});

var server = app.listen(8081, "127.0.0.1", function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log("pixelect listening at http://%s:%s", host, port)
});