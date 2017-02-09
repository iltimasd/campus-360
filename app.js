var express = require('express'); //require express like adding a script source
var app = express();			  //create instance
var server = require('http').createServer(app); //inside the HTTP library use th ecreate server function via Express
var io = require('socket.io')(server); //point io to the same server as express
var port = process.env.PORT || 8080; //heroku || local
var allClients="";	//list of all clients
var numClients=0;
server.listen(port, function(){
	console.log('Server listening on ' + port);
});

io.on('connection',function(client){
	numClients++;
	console.log('Socket connected...');
	client.emit('messages', {alertBox:'hi there'});

	client.on('idMe',function(){
	console.log("new connection");
	console.log(numClients+ " total connections");
	client.emit('idMe', numClients);
	});

	client.on('setClientName', function(data){
		client.clientName = data;
		//allClients += data + " ";
	});

	client.on('submission', function(data){
		client.broadcast.emit('submission',  data);
		console.log("submission: " + data);
	});

	client.on('getOthersNames', function(){
		client.emit('getOthersNames', {list: allClients});

	});

});

app.get('/', function(req,res){
	console.log('serving index.html');
	res.sendFile(__dirname + '/index.html');

});