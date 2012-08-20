var expect = require('expect.js');
var sinon = require('sinon');
var factory = require(__dirname+'/../../app/controllers/http');

describe('http controller', function() {
  var controller;
  var req;
  var res;
  var client;

  beforeEach(function() {
    client = fakeClient();
    controller = factory.create(client);
    req = { session: {}, query: {} };
    res = { render: sinon.spy(), redirect: sinon.spy() };
  });

  describe('#index', function() {

    describe('when the user is not logged in', function() {
      it('should redirect to /login', function() {
        controller.index(req, res);
        expect(res.redirect.calledWith('/login')).to.be.ok();
      })
    });

    describe('when the user is logged in', function() {
      beforeEach(function() { req.session.oauth = {}; });

      it('should render index view', function() {
        controller.index(req, res);
        expect(res.render.calledWith('index')).to.be.ok();
      })
    });
  });

  describe('#login', function() {
    it('should render login view', function() {
      controller.login(req, res);
      expect(res.render.calledWith('login')).to.be.ok();
    });
  });

  describe('#error', function() {
    it('should render error view', function() {
      controller.error(req, res);
      expect(res.render.calledWith('error')).to.be.ok();
    });
  });

  describe('#auth', function() {

    describe('for a successful connection', function() {
      beforeEach(function() {
        controller.auth(req, res);
      });

      it('should persist the authorization in the session', function() {
        expect(req.session.oauth).to.be('oauth');
      });
      
      it('should redirect to the twitter login url', function() {
        expect(res.redirect.calledWith('twitter.com/oauth')).to.be.ok();
      });
    });

    describe('for a failed connection', function() {
      beforeEach(function() {
        makeClientTrhowErrorOn('requestAuthorization');
        controller.auth(req, res);
      });

      it('should redirect to /error', function() {
        expect(res.redirect.calledWith('/error')).to.be.ok();
      });
    });
  });

  describe('#afterAuth', function() {
    beforeEach(function() {
      req.session.oauth = {};
      req.query.oauth_verifier = 'verifier';
    });

    describe('when authorized', function() {
      beforeEach(function() {
        controller.afterAuth(req, res);
      });

      it('should persist the verifier in the session', function() {
        expect(req.session.oauth.verifier).to.be('verifier');
      });

      it('should persist the access token in the session', function() {
        expect(req.session.oauth.access).to.be('access');
      });

      it('should redirect to /', function() {
        expect(res.redirect.calledWith('/')).to.be.ok();
      });
    });

    describe('when not authorized', function() {
      beforeEach(function() { 
        makeClientTrhowErrorOn('requestAccess');
        controller.afterAuth(req, res);
      });

      it('should redirect to /error', function() {
        expect(res.redirect.calledWith('/error')).to.be.ok();
      });
    });
    
  });
  
  function fakeClient(error) {
    var client = {};

    client.requestAuthorization = function(cb) {
      cb(error, 'oauth', 'twitter.com/oauth');
    };
    
    client.requestAccess = function(oa, cb) {
      cb(error, 'access');
    };
    
    return client;
  }

  function makeClientTrhowErrorOn(prop) {
    client[prop] = function() {
      for(var key in arguments) {
        var value = arguments[key];
        (typeof(value) === 'function') && (value('error'));
      }
    };
  }
});