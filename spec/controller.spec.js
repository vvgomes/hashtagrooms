var factory = require(__dirname+'/../app/controller');

describe('controller', function() {
  var controller;

  beforeEach(function() {
    controller = factory.create();
  });

  describe('#index', function() {});

  describe('#login', function() {});

  describe('#error', function() {});

  describe('#auth', function() {});

  describe('#afterAuth', function() {});
});