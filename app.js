var express = require("express");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

var db = require("./models");

app.use(session({ 
  secret: "BookBotReadmeInc", 
  resave: true, 
  saveUninitialized: true,
  cookie: {
      maxAge: 3600000 // max login session is 1 hour
  }
}));
// web stuff

app.set("view engine","ejs");

require("./routes/html-routes.js")(app);

var port = process.env.PORT || 3000;

db.sequelize.sync().then(function() {
  app.listen(port, function() {
    console.log("==> 🌎  Listening on port %s.", port);
  });
});