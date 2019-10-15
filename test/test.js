var assert = require('assert');
var sequelize = require('sequelize');
var db = require("../models");
// hello world test
describe('Array', function() { // name of test
    describe('#indexOf()', function() { // name of function being tested
      it('should return -1 when the value is not present', function() { // describe what should happen
        assert.equal([1, 2, 3].indexOf(4), -1); // do an assertion for something to happen with specified function
      });
    });
  });

describe('User', function() {
  describe('#validPassword()', function() {
    it('should return True when password is valid, False otherwise', function() {
      
      db.User.findOne({
        where: {
          email: 'test@user.com'
        }
      }).then(function(user) {
        // True case
        assert.equal(user.validPassword('password'), true);

        // False case
        assert.equal(user.validPassword('asdf'), false);
      }).catch(function(err) {
        console.log(err);
      });
      
    });
  });
});
