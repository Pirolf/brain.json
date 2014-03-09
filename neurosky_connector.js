var net = require('net');

var HOST = '127.0.0.1';
var PORT = 13854;


// TODO wrap this in a class with callbacks for handling the specific json events


/* Network Socket to Thinkgear Connector */

var client = new net.Socket();

client.connect(PORT, HOST, function() {

	client.write(JSON.stringify({"enableRawOutput": false, "format": "Json"}));
    client.write(JSON.stringify({"appName": "brain.json", "appKey": "9385e00cb35898fb8f551ae9b2d0d1824aaf481e"}));

	// write session start
});


/* Receive Data */

client.on('data', function(data) {
	// save to database
	
	// For when two results come in the same packet
	var rows = data.toString().split('\r');

	// Remove trailing newline.
	rows.pop();

	// Process Rows
	rows.forEach( function(row) {
		console.log(JSON.parse(row.toString()));
	});

	// * normal event
	// * blink event
	// * lost signal event
});


// Add a 'close' event handler for the client socket
client.on('close', function() {
	// write session end
});
