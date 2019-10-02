var express = require("express");
var app = express();
// mysql stuff
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "muowdopceqgxjn2b.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "nrx5dsvyg9fs4zmu",
    password: "t3pwyf6nng31h2wv",
    database: "fu4kgguc9oe481fn",
    multipleStatements: true
});

con.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + con.threadId);
});

// var sql = "DROP TABLE books; CREATE TABLE books(title VARCHAR(255), author VARCHAR(50), publicationYear INT, synopsis VARCHAR(500), genre1 INT, genre2 INT, pageCount INT, isbn BIGINT PRIMARY KEY);"
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//     console.log("Table created");
// });

// var sql = "INSERT INTO books (title, author, publicationYear, synopsis, pageCount, isbn) VALUES "
//   + "('The Catcher In The Rye', 'J.D. Salinger', 1951, 'The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school. Confused and disillusioned, Holden searches for truth and rails against the “phoniness” of the adult world.', 288,  9780316769532),"
//   + "('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 1997, 'Harry Potter has no idea how famous he is. That''s because he''s being raised by his miserable aunt and uncle who are terrified Harry will learn that he''s really a wizard, just as his parents were. But everything changes when Harry is summoned to attend an infamous school for wizards, and he begins to discover some clues about his illustrious birthright. From the surprising way he is greeted by a lovable giant, to the unique curriculum and colorful faculty at his unusual school, Harry finds himself drawn deep inside a mystical world he never knew existed and closer to his own noble destiny.', 309, 9780439708180),"
//   + "('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'The Great Gatsby, F. Scott Fitzgerald''s third book, stands as the supreme achievement of his career. First published in 1925, this quintessential novel of the Jazz Age has been acclaimed by generations of readers. The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted “gin was the national drink and sex the national obsession,” it is an exquisitely crafted tale of America in the 1920s.' , 180, 9780743273565);";
// con.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log("records inserted");
// });

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