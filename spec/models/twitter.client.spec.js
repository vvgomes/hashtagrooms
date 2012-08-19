var expect = require('expect.js');
var twitterClient = require('../../app/models/twitter.client');

describe('twitter client', function() {
  var client;

  beforeEach(function() {
    client = twitterClient.create('foo.com:3000', fakeOauthClient);
  });

  it('should request user`s authorization', function(done) {
    client.requestAuthorization(function(error, data, url) {
      expect(error).to.be(null);
      expect(data.token).to.be.ok;
      expect(data.secret).to.be.ok;
      expect(url).to.be('https://twitter.com/oauth/authenticate?oauth_token='+data.token);
      done();
    });
  });

    
  it('should get access token from twitter', function(done) {
    client.requestAccess({}, function(error, data) {
      expect(error).to.be(null);
      expect(data.token).to.be.ok;
      expect(data.secret).to.be.ok;
      done();
    });
  });

  function fakeOauthClient() {
    this.getOAuthRequestToken = function(cb) {
      cb(null, 'token', 'secret');
    };

    this.getOAuthAccessToken = function(t, s, v, cb) {
      cb(null, 'token', 'secret');
    };
  }
});