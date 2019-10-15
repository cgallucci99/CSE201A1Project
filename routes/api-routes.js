var db = require('../models');
var passport = require('../config/passport');
var Sequelize = require('sequelize');

module.exports = function (app) {
    app.post("/api/login", passport.authenticate('local'), function (req, res) {
        res.redirect('/');
    });

    app.post("/api/signup", function (req, res) {
        console.log(req.body);
        db.User.create({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }).then(function () {
            res.redirect(307, "/api/login");
        }).catch(Sequelize.ValidationError, function(err) {
            res.send('must be valid email');
        }).catch(function (err) {
            console.log(err);
            res.json(err);
            // res.status(422).json(err.errors[0].message);
        });
    });

    app.get("/api/logout", function (req, res) {
        req.logout();
        res.redirect("/");
    });

    app.get("*", function (req, res) {
        res.status(404).render("not-found", {user: req.user});
    });
}