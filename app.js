
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , stacker = require('./stacker')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path'),
  bodyParser = require('body-parser');

var app = express(),
    PORT = process.env.PORT || 3000;

// app.configure(function(){
  app.set('port', PORT );
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
//   app.use(express.favicon());
//   app.use(express.logger('dev'));
  app.use( bodyParser({uploadDir:'./tests/temp', limit: '50mb'}));
//   app.use(express.methodOverride());
//   app.use(app.router);
  app.use( express.static( path.join(__dirname, 'public')));
// });

// app.configure('development', function(){
//   app.use(express.errorHandler());
// });


app.get('/', routes.index);

app.post('/video', routes.video, stacker.start, function( req, res ) {
    res.send('ok');
});

app.post('/stack', routes.save, function ( req, res ) {
    res.send('');
});

app.post('/start', stacker.start, function ( req, res ) {
    res.send('ok');
});


var pipe_to_browser = require('pipe-to-browser'),
    spawn = require('child_process').spawn;


http.createServer( app, function( req, res ){
    var stack = spawn('echo hi');

    pipe_to_browser.pipeResponse( {}, res, stack.stdout );
});

app.listen( PORT, function(){
    console.log("Express server listening on port " + PORT );
});




