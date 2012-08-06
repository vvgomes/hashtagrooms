var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var nib = require('nib');
var stylus = require('stylus');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + '/../public',
    compile: compile
  }));
  app.use(stylus.middleware(__dirname + '/../public'));
  app.use(express.static(path.join(__dirname, '..', 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/auth/twitter', routes.twitterAuth);
app.get('/auth/twitter/callback', routes.twitterCallback);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
