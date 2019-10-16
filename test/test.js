var assert = require('assert');
var sequelize = require('sequelize');
var db = require("../models");
const {Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

// Test User class

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

// Tests for Books
describe('Book', function() {
  describe('#createBook()', function() {
    it('should have book with correct attributes', function() {
      db.Book.destroy({
        where: {
          synopsis: 'test'
        }
      });
      db.Book.create({
        title: 'Harry Potter And The Goblet Of Fire',
        author: 'J.K. Rowling',
        publicationYear: 2006,
        synopsis: 'test',
        isbn: 123456789
      }).then(book => {
        assert.equal(book.author, 'J.K. Rowling');
        assert.equal(book.title, 'Harry Potter And The Goblet Of Fire');
        assert.equal(book.publicationYear, 2006);
        assert.equal(book.synopsis, 'test')
        assert.notEqual(book.synopsis, 'test1');
        assert.equal(book.isbn, 123456789);
      });
    });
  });
});

// Test web pages

describe('DefaultTest', function() {
  const driver = new Builder().forBrowser('chrome').build();
  describe('#index', function() {
    it('should go to index page and check that the title is BookBot', async function() {
      await driver.get('localhost:3000');
      const title = await driver.getTitle();
  
      expect(title).to.equal('BookBot');
    });
  });

  describe('#signup', function() {
    it('should go to sign up page and enter an invalid email format and check that error message appears', async function() {
      await driver.get('localhost:3000/signup');
      await driver.findElement(By.name('email')).sendKeys('invalid@email', Key.ENTER);
      const style = await driver.findElement(By.id('emailHelpBlock')).getAttribute('style');
      expect(style).to.equal('display: block;');
    })
  })

  after(async function() {
    driver.quit();
  });
});