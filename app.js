'use strict';

let IO_GETIP = require('./io_getip.js'),
    app = new IO_GETIP( require( './config.json' ) );


app.getip()
	.then( ( ipaddr ) => {
		return app.publish( "io_getip", ipaddr );
	})
	.catch( ( err ) => {
		console.log(err);
	});
