var assert = require('assert');
var sequelize = require('sequelize');
var db = require("../models");
const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

// ############################ Test User class #####################################
describe('User', function () {
  describe('#validPassword()', function () {
    it('should return True when password is valid, False otherwise', async function () {
      // find the desired test user
      const user = await db.User.findOne({
        where: {
          email: 'test@user.com'
        }
      })
      // True case
      assert.equal(user.validPassword('password'), true);

      // False case
      assert.equal(user.validPassword('asdf'), false);
    });
  });
  describe('#create()', function () {
    it('should have email equal to test@user.com, firstName equal to test, lastName equal to user, password not equal to password', async function () {
      // remove the test user so we can add them again
      await db.User.destroy({
        where: {
          email: 'test@user.com'
        }
      });
      // create the user
      await db.User.create({
        email: 'test@user.com',
        password: 'password',
        firstName: 'test',
        lastName: 'user'
      });
      // make sure the user is in the database
      const user = await db.User.findOne({
        where: {
          email: 'test@user.com'
        }
      });
      // make sure the attributes were correctly inputted into the databas
      assert.equal(user.email, 'test@user.com');
      assert.equal(user.firstName, 'test');
      assert.equal(user.lastName, 'user');
      // password should be hashed
      assert.notEqual(user.password, 'password');
    });
  });
});

// ############################### Tests for Books ################################
describe('Book', function () {
  describe('#createBook()', function () {
    it('should have book with correct attributes', async function () {
      // make a test book
      await db.Book.create({
        title: 'Test Book',
        author: 'Test Author',
        publicationYear: 2006,
        synopsis: 'test',
        isbn: 123456789
      }).catch(function (err) {
        console.log(err);
      });
      // make sure the book was correctly added to the database
      const book = await db.Book.findOne({
        where: {
          synopsis: 'test'
        }
      });
      // make sure the attributes were correctly added to the database
      expect(book.author).to.equal('Test Author');
      assert.equal(book.title, 'Test Book');
      assert.equal(book.publicationYear, 2006);
      assert.equal(book.synopsis, 'test')
      assert.notEqual(book.synopsis, 'test1');
      assert.equal(book.isbn, 123456789);
    });
  });

  describe('#rateBook()', function () {
    it('should rate a book, then return the rating', async function () {
      // locate the test book
      var isbn = 123456789;
      var book = await db.Book.findOne({
        where: {
          isbn: isbn
        }
      });
      var previousRating = Number(book.rating);
      var previousRaters = Number(book.raters);
      var rating = 5;
      var userId = 181; // id for testUser@gmail.com
      // try to rate the book
      await db.Book.rateBook(isbn, userId, rating);
      // locate the book again to check if it was properly updated
      book = await db.Book.findOne({
        where: {
          isbn: isbn
        }
      });
      var updatedRating = Number(book.rating);
      var updatedRaters = Number(book.raters);
      // make sure the rating was properly calculated
      expect(updatedRating).to.equal((previousRating + rating) / (previousRaters + 1));
      expect(updatedRaters).to.equal(previousRaters + 1);
    });
  });
  // This is run after all of the above book tests are run
  after(function () {
    // remove test book and review so it doesn't appear on the database
    db.sequelize.query('DELETE FROM Reviews WHERE isbn = 123456789', sequelize.QueryTypes.DELETE).then(() => {
      console.log('deleted review');
    }).catch(err => {
      console.log('did not delete review');
    });
    db.Book.destroy({
      where: {
        synopsis: 'test'
      }
    }).then(() => {
      console.log('deleted book');
    }).catch(err => {
      console.log('did not delete book');
    });
  });
});

// ################################## Test web pages #####################################

describe('DefaultBrowserTest', function () {
  // set timeout for longer in case PC is running slow
  this.timeout(20000);
  const driver = new Builder().forBrowser('chrome').build();
  describe('#index', function () {
    it('should go to index page and check that the title is BookBot', async function () {
      // make sure window is maximized to test regular display rather than mobile
      await driver.manage().window().maximize();
      await driver.get('localhost:3000');
      const title = await driver.getTitle();
      expect(title).to.equal('BookBot');
    });
  });

  describe('#signup', function () {
    it('should go to sign up page and enter an invalid email format and check that error message appears', async function () {
      await driver.get('localhost:3000/signup');
      await driver.findElement(By.name('email')).sendKeys('invalid@email', Key.ENTER);
      const style = await driver.findElement(By.id('emailHelpBlock')).getAttribute('style');
      expect(style).to.equal('display: block;');
    });
  });
  describe('#loginFail', function () {
    it('should try to login with nonexistent email, fail, try to login with invalid password, fail, try to log in with valid credentials and succeed', async function () {
      await driver.get('localhost:3000/login');
      await driver.findElement(By.name('email')).sendKeys('invalid', Key.ENTER);
      await driver.findElement(By.name('password')).sendKeys('invalid', Key.ENTER);
      var message = await driver.findElement(By.id('message')).getText();
      expect(message).to.equal('Incorrect email.');
      await driver.findElement(By.name('email')).sendKeys('test@user.com', Key.ENTER);
      await driver.findElement(By.name('password')).sendKeys('invalid', Key.ENTER);
      await driver.sleep(50);
      message = await driver.findElement(By.id('message')).getText();
      expect(message).to.equal('Incorrect password.');
    });
  });
  describe('#loginSucceedAndLogout', function () {
    it('should try to login and succeed, then logout', async function () {
      await driver.get('localhost:3000/login');
      await driver.findElement(By.name('email')).sendKeys('test2@user.com', Key.ENTER);
      await driver.findElement(By.name('password')).sendKeys('password', Key.ENTER);
      var flash = await driver.findElement(By.id('message')).getText();
      expect(flash).to.equal('Welcome, test2');
      var button = await driver.findElement(By.id('logout')).isDisplayed();
      expect(button).to.be.true;
      await driver.findElement(By.id('logout')).click();
      button = await driver.findElement(By.id('login')).isDisplayed();
      expect(button).to.be.true;
    });
  });
  // once the commands are finished, quit the browser
  after(async function () {
    driver.quit();
  });
});