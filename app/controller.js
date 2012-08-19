exports.create = function(client) {
  var controller = {};

  controller.index = function(req, res) {
    req.session.oauth ? res.render('index') : res.redirect('/login');
  };

  controller.login = function(req, res) {
    res.render('login')
  };

  controller.error = function(req, res) {
    res.render('error');
  };

  controller.auth = function(req, res) {
    client.requestAuthorization(function(error, oauth, url) {
      req.session.oauth = oauth;
      res.redirect( error ? '/error' : url );
    });
  };

  controller.afterAuth = function(req, res, next){
    req.session.oauth.verifier = req.query.oauth_verifier
    client.requestAccess(req.session.oauth, function(error, access) {
      req.session.oauth.access = access;
      res.redirect( error ? '/error' : '/' );
    });
  };

  return controller;
};
