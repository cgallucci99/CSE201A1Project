var db = require('../models');
var passport = require('../config/passport');
var Sequelize = require('sequelize');

module.exports = function (app) {
    app.post("/api/login", passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        successFlash: true,
        failureFlash: true
    }));

    app.post("/api/addToCatalogue/:userid/:isbn", async function(req, res) {
        var user = await db.User.findOne({
            where: {
                id : req.params.userid
            }
        });
        var book = await db.Book.findOne({
            where: {
                isbn: req.params.isbn
            }
        });
        try {
            user.addBook(book);
            req.flash('success', 'Successfully added "' + book.title + '" to MyCatalogue');
            res.redirect('back');
        } catch {
            req.flash('error', 'Cound not add "' + book.title + '" to MyCatalogue');
        }

        // db.User.findOne({
        //     where: {
        //         id: req.params.userid
        //     }
        // }).then(function(user) {
        //     db.Book.findOne({
        //         where: {
        //             isbn: req.params.isbn
        //         }
        //     }).then(function (book) {
        //         user.addBook(book);
        //     }).catch(function (error) {
        //         console.log(error);
        //     });
        // }).then(function () {
        //     req.flash('success', 'Successfully added to MyCatalogue')
        //     res.redirect('back');
        // }).catch(function (err) {
        //     console.log(err);
        // })
    });

    app.post("/api/removeFromCatalogue/:userid/:isbn", async function(req,res) {
        var user = await db.User.findOne({
            where: {
                id : req.params.userid
            }
        });
        var book = await db.Book.findOne({
            where: {
                isbn: req.params.isbn
            }
        });
        var usersBooks = await db.Book.findAll({
            include: [{
                model: db.User,
                as: 'User',
                where: {
                    id: req.user.id 
                }
            }]
        });
        try {
            user.removeBook(book);
            req.flash('success', 'Successfully removed book');
            res.redirect('/mycatalogue');
        } catch {
            req.flash('error', 'Book could not be removed');
            res.redirect('/');
        }
    });

    app.post("/api/signup", function (req, res) {
        console.log(req.body);
        if (req.body.password.length == 8) {
            req.flash('error', 'Must have password longer than 8 characters');
            res.redirect('/signup');
        }
        db.User.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }).then(function () {
            res.redirect(307, "/api/login");
        }).catch(Sequelize.ValidationError, function(err) {
            req.flash('error', 'Invalid email or user already exists');
            res.redirect('/signup');
        }).catch(function (error) {
            req.flash('error', error);
            res.redirect('/signup');
            // res.status(422).json(err.errors[0].message);
        });
    });

    app.get("/api/logout", function (req, res) {
        req.logout();
        req.flash('success', 'Successfully logged out');
        res.redirect("/");
    });

    app.get("*", function (req, res) {
        res.render("not-found", {user: req.user});
        // res.status(404).render("not-found", {user: req.user});
    });
}