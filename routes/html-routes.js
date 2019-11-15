var db = require('../models');
var sequelize = require('sequelize');
var op = sequelize.Op;
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
    // default GET route, redirects to the home page, sorting by ISBN
    app.get("/", function (req, res) {
        res.redirect("/home/isbn");
    });
    // GET route to show the user's catalogue
    app.get("/mycatalogue", isAuthenticated, function (req, res) {
        // find the user
        db.Book.findAll({
            include: [{
                model: db.User,
                as: 'User',
                where: {
                    id: req.user.id
                }
            }]
        }).then(function (books) { // if found, show the myCatalogue page
            res.render('mycatalogue', { books: books, user: req.user, successMessage: req.flash('success'), errorMessage: req.flash('error') });
        }).catch(function (err) { // should never be not found, but just in case
            console.log(err);
        });
    });
    // GET route for showing a book's details
    app.get("/book/:isbn", function (req, res) {
        // find the book
        db.Book.findOne({
            where: {
                isbn: req.params.isbn
            }
        }).then(function (book) { // if found, show its details page
            // find the book's genres
            db.sequelize.query("SELECT DISTINCT Genres.genreName FROM Genres, Books WHERE Genres.genreID = ? OR Genres.genreID = ?;", { replacements: [book.genre1, book.genre2], type: sequelize.QueryTypes.SELECT }).then(genres => {
                res.render('book', { user: req.user, book: book, genres: genres, successMessage: req.flash('success'), errorMessage: req.flash('error') });
            }).catch(function (error) { // if the genres can't be found, print an error message
                req.flash('error', error.message);
                res.redirect('back');
            });
        }).catch(err => { // if the book is not found, show the not found page
            res.status(404).render("not-found", { user: req.user });
        });
    });
    // GET route for the home page, sorted by :order
    app.get("/home/:order", function (req, res) {
        // searching ##################
        // Default to wildcard for search
        var where = {
            title: {
                [op.like]: '%'
            }
        };

        // If we are searching: filter by search
        if (req.query.search) {
            var search = decodeURI(req.query.search);
            where['title'] = {
                [op.like]: '%' + search + '%'
            }
        }
        // end search stuff ############
        // find the book
        db.Book.findAll({
            where,
            order: sequelize.col(req.params.order)
        }).then(books => { // show the books if any are found
            res.render('index', { books: books, user: req.user, successMessage: req.flash('success'), errorMessage: req.flash('error') })
        }).catch(function (err) { // otherwise show the not found page
            console.log(err);
            res.status(404).render('not-found', { user: req.user });
        });
    });
    // GET route for logging in
    app.get("/login", function (req, res) {
        // make sure the user isn't already logged in
        if (req.user) {
            res.redirect("/");
        } else {
            // show login page
            res.render("login", { user: req.user, successMessage: req.flash('success'), errorMessage: req.flash('error') });
        }
    });
    // GET route for signing up
    app.get("/signup", function (req, res) {
        // make sure the user isn't already logged in
        if (req.user) {
            res.redirect("/");
        } else {
            // show sign up page
            res.render("signup", { user: req.user, successMessage: req.flash('success'), errorMessage: req.flash('error') });
        }
    });
    // GET route for adding a book to the database
    app.get("/addBook", isAuthenticated, function (req, res) {
        // find the genres to display for selection
        db.sequelize.query("SELECT * FROM Genres", { type: sequelize.QueryTypes.SELECT }).then(results => {
            res.render('addBook', { user: req.user, successMessage: req.flash('success'), errorMessage: req.flash('error'), genres: results });
        })
    });

}
