var express = require("express");
var app = express();
// mysql stuff
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "muowdopceqgxjn2b.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "nrx5dsvyg9fs4zmu",
    password: "t3pwyf6nng31h2wv",
    database: "fu4kgguc9oe481fn"
});
/*
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE books(title VARCHAR(255), author VARCHAR(75), publicationYear INT, synopsis VARCHAR(500), isbn BIGINT PRIMARY KEY);";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
});
*/
/*
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO books (title, author, publicationYear, synopsis, isbn) VALUES ('The Catcher In The Rye', 'J.D. Salinger', 1951, 'The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school. Confused and disillusioned, Holden searches for truth and rails against the “phoniness” of the adult world.', 9780316769532)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
*/

// web stuff

app.set("view engine","ejs");

con.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + con.threadId);
});

// var query = con.query("SELECT * FROM books", function (err, result, fields) {
//     if (err) throw err;
// });

// console.log("query values: \n" + query.values);

app.get("/", function(req, res) {
  con.query("SELECT * FROM books", function (err, result, fields) {
    if (err) throw err;
    res.render("index", {books: result});
  });
});

var port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function() {
	console.log("app is running on " + port);
});