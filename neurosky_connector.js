var net = require('net');
var express = require('express');
var colors = require('colors');

var HOST = '127.0.0.1';
var PORT = 13854;


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var EegSchema = mongoose.Schema({
	eSense: {
		attention:   Number,
		meditation:  Number
	},
	eegPower: {
		delta:       Number,
		theta:       Number,
		lowAlpha:    Number,
		highAlpha:   Number,
		lowBeta:     Number,
		highBeta:    Number,
		lowGamma:    Number,
		highGamma:   Number
	},
	poorSignalLevel: Number,
	created_at: { type: Date, default: Date.now },
});

var EegEvent = mongoose.model('EegEvent', EegSchema);



// TODO wrap this in a class with callbacks for handling the specific json events


/* Network Socket to Thinkgear Connector */

var client = new net.Socket();

client.connect(PORT, HOST, function() {

	client.write(JSON.stringify({"enableRawOutput": false, "format": "Json"}));
    client.write(JSON.stringify({"appName": "brain.json", "appKey": "9385e00cb35898fb8f551ae9b2d0d1824aaf481e"}));

    console.log('ThinkGear Connector'.magenta +' on '.grey + '%s:%d'.magenta, HOST, PORT);
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
		var json = JSON.parse(row.toString());

		if(json.eSense) {
			var eeg_event = new EegEvent(json);
			eeg_event.save(function (error, model) {
				if (error) {
					return console.error(err.red);
				}
				else {
					// console.log("<", json, model);
				}
			});
		}
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
    console.log('ThinkGear Connector'.magenta + ' closed.'.grey);
});



/* Web Server */

var app = express();


/* Render index.html from public and log requests */
app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
});


/* Return brain data */
app.get('/eeg.json', function(req, res) {

	EegEvent.find({}, function (err, users) {
		res.send(users);
	});
});


/* Start web server */
var server = app.listen(3000, function() {
    console.log('Express.js'.magenta + ' listening on '.grey + '%d'.magenta, server.address().port);
});
