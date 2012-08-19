var expect = require('expect.js');
var sinon = require('sinon');
var factory = require(__dirname+'/../app/controller');

describe('controller', function() {
  var controller;

  beforeEach(function() {
    controller = factory.create();
  });

  describe('#index', function() {
    var req;
    var res;

    beforeEach(function() {
      req = { session: {} };
      res = { render: sinon.spy(), redirect: sinon.spy() };
    });

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

  describe('#login', function() {});

  describe('#error', function() {});

  describe('#auth', function() {});

  describe('#afterAuth', function() {});
});