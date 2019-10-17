var db = require('../models');
var sequelize = require('sequelize');

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.redirect("/home/isbn");
    });

    app.get("/home/:order", function (req, res) {
        db.Book.findAll({
            order: sequelize.col(req.params.order)
        }).then(books => res.render('index', {books: books, user: req.user})).catch(function(err) {
            res.render('not-found');
        });
        // con.query("SELECT * FROM books ORDER BY ??", req.params.order, function (err, result, fields) {
        //     if (err)
        //         res.send("Error 404: Page Not Found");
        //     else
        //         res.render("index", { books: result });
        // });
    });

    app.get("/login", function (req, res) {
        if (req.user) {
            res.redirect("/");
        } else {
            res.render("login", {user: req.user, message: req.flash('error')});
        }
    });

    app.get("/signup", function (req, res) {
        if (req.user) {
            res.redirect("/");
        } else {
            res.render("signup", {user: req.user});
        } 
    });

}