
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

var app = express();

// app.configure(function(){
  app.set('port', process.env.PORT || 3000 );
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

app.post('/video', function( req, res, next ){ res.send( req.body.video_id ); next(); }, routes.video, function( req, res ) {
    res.send('ok');
});

app.post('/stack', routes.save, function ( req, res ) {
    res.send('');
});

app.post('/start', stacker.start, function ( req, res ) {
  res.send('ok');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



