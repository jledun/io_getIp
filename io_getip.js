'use strict';

class io_getip {

	constructor( config ) {
		this.conf = config || {};
	};

	getip() {
		//~ GET IP ADDRESS WITH JSON IP SERVER
		let http = require('http');
		let ipAddr = '';

		return new Promise( ( resolve, reject ) => {

			if ( Object.keys( this.conf ).length <= 0 ) return reject( new Error("No configuration file given") );
			if ( typeof this.conf.getip === "undefined" ) return reject( new Error("No getip settings in config.json") );
			if ( typeof this.conf.getip.options === "undefined" ) return reject( new Error("No http request options set in config.json") );

			let req = http.request(this.conf.getip.options, ( res ) => {

				res.setEncoding('utf8');
				res.on('data', ( chunk ) => {
					ipAddr += chunk;
				});

				res.on('end', () => {
					return resolve( JSON.parse( ipAddr ).ip );
				});
			});

			req.on('error', ( e ) => {
				return reject( e );
			});

			req.end();
		});
	};

	publish( topic, ipAddr ) {
		// PUBLISH TO MQTT BROKER

		return new Promise( ( resolve, reject ) => {

			if ( Object.keys( this.conf ).length <= 0 ) return reject( new Error("No configuration file given") );
			if ( typeof this.conf.mqtt === "undefined" ) return reject( new Error("No mqtt settings in config.json") );
			if ( typeof this.conf.mqtt.url === "undefined" ) return reject( new Error("No url given for mqtt broker") );

			let mqtt = require( 'mqtt' );
			let client = mqtt.connect( "mqtt://" + this.conf.mqtt.url );

			client.on('connect', () => {
				client.publish( topic, ipAddr, {
					qos: 0,
					retain: true
				}, (err, result) => {
					client.end();
					if ( err ) return reject( err );
					return resolve('published ' + ipAddr + " to io_getip topic.");
				});
			});

			client.on('error', ( e ) => {
				return reject( e );
			});

		});
	};
};

module.exports = io_getip;
