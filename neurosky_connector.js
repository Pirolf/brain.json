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


/* Message types */
/* - Connection { poorSignalLevel: 200 } */
/* - Brain json { eSense: { attention: 35, meditation: 48 },
				  eegPower:
				   { delta: 5913,
					 theta: 20915,
					 lowAlpha: 1085,
					 highAlpha: 3006,
					 lowBeta: 11308,
					 highBeta: 6023,
					 lowGamma: 7044,
					 highGamma: 3128 },
				  poorSignalLevel: 0 } (Signal level drops to 200 when clips are removed)
*/
/* - Blink      { blinkStrength: 45 } */
/* - Raw EEG    { rawEeg: 60 } */

// Add a 'close' event handler for the client socket
client.on('close', function() {
	// write session end
});
