var db = require('../models');
var sequelize = require('sequelize');
var op = sequelize.Op;
var isAuthenticated = require("../config/middleware/isAuthenticated");
var isAdmin = require("../config/middleware/isAdmin");

module.exports = function (app) {
    // default GET route, redirects to the home page, sorting by ISBN
    app.get("/", function (req, res) {
        res.redirect("/home/isbn?page=0");
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
    app.get("/book/:isbn", async function (req, res) {
        // find the book
        try {
            var book = await db.Book.findOne({
                where: {
                    isbn: req.params.isbn
                }
            });
            // if found, show its details page
            // find the book's genres
            var genres = await db.sequelize.query("SELECT DISTINCT Genres.genreName FROM Genres, Books WHERE Genres.genreID = ? OR Genres.genreID = ?;", 
                                    { replacements: [book.genre1, book.genre2], type: sequelize.QueryTypes.SELECT });
            var reviews = await db.sequelize.query("SELECT r.*, u.firstName, u.lastName FROM Reviews r JOIN Users u ON u.id = r.id WHERE isbn = ?;", {replacements: [book.isbn], type: sequelize.QueryTypes.SELECT});
            res.render('book', { user: req.user, book: book, genres: genres, reviews: reviews, successMessage: req.flash('success'), errorMessage: req.flash('error') });
        } catch (err) { // if the book is not found, show the not found page
            res.status(404).render("not-found", { user: req.user });
        }
    });
    // GET route for the home page, sorted by :order
    app.get("/home/:order", function (req, res) {
        var page = 0;
        if (req.query.page) {
            if (req.query.page >= 0)
                page = Number(req.query.page);
        }
        var offset = page * 15;
        // searching ##################
        // Default to wildcard for search
        var where = {
            title: {
                [op.like]: '%'
            },
            approved: true
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
            offset: offset,
            limit: 15,
            order: sequelize.col(req.params.order)
        }).then(books => { // show the books if any are found
            res.render('index', { books: books, user: req.user, page: page, order: req.params.order, search: req.query.search, successMessage: req.flash('success'), errorMessage: req.flash('error') })
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

    app.get("/profile", isAuthenticated, function(req, res) {
        res.render("profile", { user: req.user, successMessage: req.flash('success'), errorMessage: req.flash('error') });
    });
    // ####################### ADMIN ROUTES #########################

    app.get('/unapprovedBooks', isAuthenticated, isAdmin, function (req, res) {
        db.Book.findAll({
            where: {
                approved: false
            }
        }).then((books) => {
            res.render('unapprovedBooks', { user: req.user, books: books, successMessage: req.flash('success'), errorMessage: req.flash('error') })
        }).catch((err) => {
            console.log('couldn\'t find books');
            res.redirect('back');
        })
    });

    app.get('/approveBook/:isbn', isAuthenticated, isAdmin, function (req, res) {
        db.Book.findOne({
            where: {
                isbn: req.params.isbn
            }
        }).then((book) => {
            db.sequelize.query("SELECT * FROM Genres", { type: sequelize.QueryTypes.SELECT }).then(results => {
                res.render('approveBook', { user: req.user, book: book, successMessage: req.flash('success'), errorMessage: req.flash('error'), genres: results });
            })
        })
    });

    app.get('/faq', function(req, res) {
        res.render("faq", { user: req.user, successMessage: req.flash('success'), errorMessage: req.flash('error') });
    });

}
