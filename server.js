var express = require('express');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
var os = require('os');
var oauth = require('oauth').OAuth;

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('host', os.hostname());
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
  }));
  app.use(stylus.middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// factory
var factory = {
  http: require(__dirname+'/app/controllers/http'),
  twitter: require(__dirname+'/app/models/twitter.client')
};

// controller setup:
var domain = app.get('host') + ':' + app.get('port');
var client = factory.twitter.create(domain, oauth);
var controller = factory.http.create(client);

// routes:
app.get('/', controller.index);
app.get('/login', controller.login);
app.get('/error', controller.error);
app.get('/auth/twitter', controller.auth);
app.get('/auth/twitter/callback', controller.afterAuth);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
