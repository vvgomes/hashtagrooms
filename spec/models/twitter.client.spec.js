var expect = require('expect.js');
var twitterClient = require('../../app/models/twitter.client');

describe('twitter client', function() {
  var client;

  beforeEach(function() {
    client = twitterClient.create('foo.com:3000');
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

  it('should access token from twitter', function(done) {
    client.requestAccess(function(error, data) {
      expect(error).to.be(null);
      expect(data.token).to.be.ok;
      expect(data.secret).to.be.ok;
      done();
    });
  });
});