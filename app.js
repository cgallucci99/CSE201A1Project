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
    var sql = "INSERT INTO books (title, author, publicationYear, synopsis, isbn) VALUES ('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 1997, 'Rescued from the outrageous neglect of his aunt and uncle, a young boy with a great destiny proves his worth while attending Hogwarts School for Witchcraft and Wizardry.', 9780439708180)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
*/
/*
con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM books", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
*/
// web stuff

app.set("view engine","ejs");

app.get("/", function(req, res) {
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM books", function (err, result, fields) {
          if (err) throw err;
          res.render("index", {books: result});
        });
      });
});

var port = process.env.PORT || 3000;

app.listen(port, process.env.IP, function() {
	console.log("app is running on " + port);
});