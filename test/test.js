var assert = require('assert');
var db = require("../models");
var sequelize = require('sequelize');
// hello world test
// describe('Array', function() { // name of test
//     describe('#indexOf()', function() { // name of function being tested
//       it('should return -1 when the value is not present', function() { // describe what should happen
//         assert.equal([1, 2, 3].indexOf(4), -1); // do an assertion for something to happen with specified function
//       });
//     });
//   });

// Test User class

describe('User', function() {
  describe('#create()', function() {
    it('should have email equal to test@user.com, firstName equal to test, lastName equal to user, password not equal to password', function() {
      db.User.destroy({
        where: {
          email: 'test@user.com'
        }
      });
      db.User.create({
        email: 'test@user.com',
        password: 'password',
        firstName: 'test',
        lastName: 'user'
      }).then(user => {
        assert.equal(user.email, 'test@user.com');
        assert.equal(user.firstName, 'test');
        assert.equal(user.lastName, 'user');
        assert.notEqual(user.password, 'password');
      });
    });
  });
});



// Test Book class