var db = require('../models');
var passport = require('../config/passport');
var Sequelize = require('sequelize');
var isAuthenticated = require('../config/middleware/isAuthenticated');
var isAdmin = require("../config/middleware/isAdmin");


module.exports = function (app) {
    // POST route for adding a book
    app.post('/api/addBook', function (req, res) {
        db.Book.create({
            title: req.body.title,
            author: req.body.author,
            publicationYear: req.body.publicationYear,
            synopsis: req.body.synopsis,
            genre1: req.body.genre1,
            genre2: req.body.genre2,
            pageCount: req.body.pageCount,
            isbn: req.body.isbn,
            cover: req.body.cover
        }).then(function (book) {
            req.flash('success', 'Successfully suggested "' + book.title + '" to add to database');
            res.redirect('/');
        }).catch(function (error) {
            req.flash('error', 'Error suggesting book: ' + error);
            res.redirect('back');
        });
    });
    // POST route for rating a book
    app.post('/api/rate/:isbn/:user', isAuthenticated, function (req, res) {
        // make sure the correct user is logged in, i.e. someone isn't tring to write a review as someone else
        if (req.params.user != req.user.id) {
            res.redirect('/book/'+req.params.isbn);
        } else {
            if (db.Book.rateBook(req.params.isbn, req.params.user, req.body.rating, req.body.review, req, res) === true) {
                req.flash('success', 'Successfully rated the book');
            } else {
                req.flash('error', 'Could not add review');
            }
            res.redirect('/book/' + req.params.isbn);
        }
    });
    // POST route for search
    app.post('/api/search', function (req, res) {
        try {
            var search = req.body.search;
            res.redirect('/home/isbn?search=' + encodeURI(search));
        }
        catch {
            console.log('error parsing query param');
        }
    });
    // POST route for login
    app.post("/api/login", passport.authenticate('local', {
        // successRedirect: '/',
        failureRedirect: '/login',
        successFlash: true,
        failureFlash: true
    }), function (req, res) {
        res.redirect('back');
    });
    // POST route to add a book to a user's catalogue
    app.post("/api/addToCatalogue/:userid/:isbn", isAuthenticated, async function (req, res) {
        // make sure the correct user is logged in and adding to catalogue
        if (req.params.userid != req.user.id) {
            res.redirect('back');
        } else {
            try {
                // find the user
                var user = await db.User.findOne({
                    where: {
                        id: req.params.userid
                    }
                });
                // find the book
                var book = await db.Book.findOne({
                    where: {
                        isbn: req.params.isbn
                    }
                });
                user.addBook(book);
                req.flash('success', 'Successfully added "' + book.title + '" to MyCatalogue');
                res.redirect('back');
            } catch {
                req.flash('error', 'Cound not add book to MyCatalogue');
            }
        }
    });
    // POST route for to remove a book from a user's catalogue
    app.post("/api/removeFromCatalogue/:userid/:isbn", isAuthenticated, async function (req, res) {
        // make sure the correct user is logged in and removing from catalogue
        if (req.params.userid != req.user.id) {
            res.redirect('back');
        } else {
            try {
                // find the user
                var user = await db.User.findOne({
                    where: {
                        id: req.params.userid
                    }
                });
                // find the book
                var book = await db.Book.findOne({
                    where: {
                        isbn: req.params.isbn
                    }
                });
                // find the user's book list
                var usersBooks = await db.Book.findAll({
                    include: [{
                        model: db.User,
                        as: 'User',
                        where: {
                            id: req.user.id
                        }
                    }]
                });
                user.removeBook(book);
                req.flash('success', 'Successfully removed book');
                res.redirect('/mycatalogue');
            } catch {
                req.flash('error', 'Book could not be removed');
                res.redirect('/');
            }
        }
    });
    // POST route for signing up for an account
    app.post("/api/signup", function (req, res) {
        // make sure the password is at least 8 characters
        if (req.body.password.length <= 8) {
            req.flash('error', 'Must have password at least 8 characters');
            res.redirect('/signup');
        } else {
            // create the user
            db.User.create({
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }).then(function () { // if successful, redirect to login POST route to log the user in
                res.redirect(307, "/api/login");
            }).catch(Sequelize.ValidationError, function (err) { // The email is either invalid or already in the database
                req.flash('error', 'Invalid email or user already exists');
                res.redirect('/signup');
            }).catch(function (error) { // somethingn else went wrong
                req.flash('error', error);
                res.redirect('/signup');
            });
        }
    });
    // GET route for logout
    app.get("/api/logout", function (req, res) {
        req.logout();
        req.flash('success', 'Successfully logged out');
        res.redirect("/");
    });

    // ########################### ADMIN ##################################
    app.post('/api/approveBook/:isbn', isAuthenticated, isAdmin, function (req, res) {
        db.Book.update({
            title: req.body.title,
            author: req.body.author,
            publicationYear: req.body.publicationYear,
            synopsis: req.body.synopsis,
            genre1: req.body.genre1,
            genre2: req.body.genre2,
            pageCount: req.body.pageCount,
            isbn: req.body.isbn,
            cover: req.body.cover,
            approved: true
            },
            {where: {isbn: req.params.isbn}
        }).then(function (book) {
            req.flash('success', 'Successfully approved book to be added to database');
            res.redirect('/');
        }).catch(function (error) {
            req.flash('error', 'Error approving book: ' + error);
            res.redirect('back');
        });
    });

    // GET route for anything other than what is specified in this file (api-routes.js) and html-routes.js
    app.get("*", function (req, res) {
        res.status(404).render("not-found", { user: req.user });
    });
}