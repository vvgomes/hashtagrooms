exports.index = function(req, res) {
  return (req.session.oauth) ? (res.render('index', { title: '#hashtagRooms' })) : res.redirect('/login');
};

exports.login = function(req, res) {
  res.render('login', { title: '#hashtagRooms' })
};

var oa = new (require('oauth').OAuth)(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  'AOeHCB0lbqWnUMNoZbDnA',
  'dx3dCASsxNevdHJXr1p8HUES8JSjZrInYVp0q22wfNU',
  '1.0',
  'http://localhost:3000/auth/twitter/callback',
  'HMAC-SHA1'
);

exports.twitterAuth = function(req, res) {
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    if(error) {
      console.log(error);
      res.send('<o> ERROR!!!');
    }
    else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = oauth_token_secret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
    }
  });
};

exports.twitterCallback = function(req, res, next){
  if (req.session.oauth) {
    console.log('GOT HERE');
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
    function(error, oauth_access_token, oauth_access_token_secret, results){
      if (error){
        console.log(error);
        res.send("yeah something broke.");
      } else {
        req.session.oauth.access_token = oauth_access_token;
        req.session.oauth,access_token_secret = oauth_access_token_secret;
        console.log(results);
        res.redirect('/');
      }
    }
    );
  } else
    next(new Error("you're not supposed to be here."))
};