var assert = require('assert');
// hello world test
describe('Array', function() { // name of test
    describe('#indexOf()', function() { // name of function being tested
      it('should return -1 when the value is not present', function() { // describe what should happen
        assert.equal([1, 2, 3].indexOf(4), -1); // do an assertion for something to happen with specified function
      });
    });
  });