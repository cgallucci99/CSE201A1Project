var express = require("express");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");
var db = require("./models");
var passport = require('./config/passport');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(session({ 
  secret: "BookBotReadmeInc", 
  resave: true, 
  saveUninitialized: true,
  cookie: {
      maxAge: 3600000 // max login session is 1 hour
  }
}));
// web stuff
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine","ejs");

require("./routes/html-routes.js")(app);
require("./routes/api-routes")(app);

var port = process.env.PORT || 3000;

db.sequelize.sync().then(function() {
  app.listen(port, function() {
    console.log("==> 🌎  Listening on port %s.", port);
  });
});