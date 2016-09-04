var util = require('util'),
    spawn = require('child_process').spawn;

exports.start = function ( req, res, next ) {

	console.log('Start stacking...')

	stack = spawn('bash', ['stacker/stack.sh']);

	stack.stdout.on('data', function( data ){    // register one or more handlers
	  console.log('stdout: ' + data );
	});

	stack.stderr.on('data', function( data ){
	  console.log('stderr: ' + data );
	});

	stack.on('exit', function( code ){
	  console.log('child process exited with code ' + code );
	  next();
	});

};