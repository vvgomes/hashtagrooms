var expect = require('expect.js');
var sinon = require('sinon');
var factory = require(__dirname+'/../app/controller');

describe('controller', function() {
  var controller;
  var req;
  var res;

  beforeEach(function() {
    controller = factory.create();
    req = { session: {} };
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
      it('should persist the authorization in the session');
      it('should redirect to the twitter login url');
    });

    describe('for a failed connection', function() {
      it('should redirect to /error');
    });
  });

  describe('#afterAuth', function() {
    describe('when authorized', function() {
      it('should persist the access token in the session');
      it('should redirect to /');
    });

    describe('when not authorized', function() {
      it('should redirect to /error');
    });
  });
});