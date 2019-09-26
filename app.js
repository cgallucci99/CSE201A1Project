var express = require("express");
var app = express();

app.set("view engine","ejs");

app.get("/", function(req, res) {
    res.render("index")
});

var port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function() {
	console.log("app is running on " + port);
});