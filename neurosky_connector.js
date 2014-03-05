var net = require('net');

var HOST = '127.0.0.1';
var PORT = 13854;


/* Network Socket to Thinkgear Connector */

var client = new net.Socket();

client.connect(PORT, HOST, function() {

    client.write('{"appName": "brain.json", "appKey": "9f54141b4b4c567c558d3a76cb8d715cbde03096", "format": "Json"}');

	// write session start
});


/* Receive Data */

client.on('data', function(data) {
	// save to database
	
	// * normal event
	// * blink event
	// * lost signal event
});


// Add a 'close' event handler for the client socket
client.on('close', function() {
	// write session end
});
