module.exports = (function(app) {  
  var appAdress = app.get('host') + ':' + app.get('port');
  var client = require('./models/twitter.client').create(appAdress);

  app.get('/', function(req, res) {
    req.session.oauth ? res.render('index') : res.redirect('/login');
  });

  app.get('/login', function(req, res) {
    res.render('login')
  });

  app.get('/error', function(req, res) {
    res.render('error');
  });

  app.get('/auth/twitter', function(req, res) {
    client.requestAuthorization(function(error, oauth, url) {
      req.session.oauth = oauth;
      res.redirect( error ? '/error' : url );
    });
  });

   app.get('/auth/twitter/callback', function(req, res, next){
    req.session.oauth.verifier = req.query.oauth_verifier
    client.requestAccess(req.session.oauth, function(error, access) {
      req.session.oauth.access = access;
      res.redirect( error ? '/error' : '/' );
    });
  });
});
