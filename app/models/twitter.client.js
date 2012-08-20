exports.create = function(domain, OAuth) {
  var client = {};

  var paths = {
    auth: 'https://twitter.com/oauth/authenticate?oauth_token=',
    requestToken: 'https://api.twitter.com/oauth/request_token',
    accessToken: 'https://api.twitter.com/oauth/access_token',
    callback: 'http://'+domain+'/callback'
  };

  var twitterApp = {
    key: process.env.HASHTAGROOMS_KEY,
    secret: process.env.HASHTAGROOMS_SECRET
  };

  var oauthClient = new OAuth(
    paths.requestToken, paths.accessToken, 
    twitterApp.key, twitterApp.secret, '1.0', 
    paths.callback, 'HMAC-SHA1'
  );

  function authUrl(token) {
    return paths.auth + token;
  }

  client.requestAuthorization = function(callback) {
    oauthClient.getOAuthRequestToken(onResponse);
    function onResponse(error, token, secret) {
      callback(error, { token: token, secret: secret }, authUrl(token));
    }
  };

  client.requestAccess = function(oauth, callback) {
    oauthClient.getOAuthAccessToken(oauth.token, oauth.secret, oauth.verifier, onResponse);  
    function onResponse(error, token, secret) {
      callback(error, { token: token, secret: secret });
    }
  };

  return client;
};