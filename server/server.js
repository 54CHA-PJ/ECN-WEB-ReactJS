require('dotenv').config();

const express = require('express');
const pg = require("pg");
const app = express();

var conString = process.env.DB_CONNECTION;

// DB FUNCTIONS

function getSQLResult(req,res,sqlRequest,values){
  var client = new pg.Client(conString);
  client.connect(function(err){
    if(err){
      console.log("Failled to connect to postgres");
      res.status(500).end('Database Connection Error!'); 
    } else{
      client.query(sqlRequest,values, function(err,result){
        if(err){
          console.log("Bad request", err);
          res.status(500).end('Bad Request Error!');  
        } else{
          var results = [];
          for (let index in result.rows) {
            results.push(result.rows[index]);
          }
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(results));
        }
        client.end();
      })
    }
  })
}

const postSQLResult = (req, res, sqlRequest, values) => {
  var client = new pg.Client(conString);
  client.connect(function(err){
    if(err){
      console.log("Failled to connect to postgres");
      res.status(500).end('Database Connection Error!'); 
    } else{
      client.query(sqlRequest,values, function(err,result){
        if(err){
          console.log("Bad request", err);
          res.status(500).end('Bad Request Error!');  
        } else{
          const results = {ok:'SUCCESS', data:result.rows};
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(results));
        }
        client.end();
      })
    }
  })
}

// APP FUNCTIONS

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.options('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Authentication
app.post('/authenticate', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const isAuthenticated = login === "admin" && password === "admin";
  const response = isAuthenticated ? {ok:'SUCCESS'} : {ok:'INVALID'};
  res.send(response);
});

// ----- USERS -----

// GET all users
app.post('/users', (req, res) => {
  var sqlRequest = 'SELECT * FROM person ORDER BY person_id ASC';
  var values = [];
  getSQLResult(req, res, sqlRequest, values);
});

// GET an user by ID
app.post('/user/:id', (req, res) => {
  var sqlRequest = 'SELECT * FROM person WHERE person_id = $1';
  var values = [req.params.id];
  getSQLResult(req, res, sqlRequest, values);
});

// UPDATE an user
app.post("/updateUser", function (req,res){
  var sqlRequest = `UPDATE person SET person_firstname = $1, person_lastname = $2, person_birthdate = $3 WHERE person_id = $4; `;
  var values = [];
  values.push(req.body.person_firstname);
  values.push(req.body.person_lastname);
  values.push(req.body.person_birthdate);
  values.push(req.body.person_id);
  postSQLResult(req,res,sqlRequest,values)
});

// CREATE an user
app.post("/createUser", function (req,res){
  var sqlRequest = "INSERT INTO person(person_firstname, person_lastname, person_birthdate) VALUES($1,$2,$3) RETURNING person_id;";
  var values = [];
  values.push(req.body.person_firstname);
  values.push(req.body.person_lastname);
  values.push(req.body.person_birthdate);
  postSQLResult(req,res,sqlRequest,values)
});

// DELETE an user
app.post("/deleteUser", function (req,res){
  var sqlRequest = `DELETE FROM person WHERE person_id = $1; `;
  var values = [];
  values.push(req.body.person_id);
  postSQLResult(req,res,sqlRequest,values)
});

// ----- BOOKS -----

// GET all books
app.post('/books', (req, res) => {
  var sqlRequest = 'SELECT * FROM book ORDER BY book_id ASC';
  var values = [];
  getSQLResult(req, res, sqlRequest, values);
});

// GET a book by ID
app.post('/book/:id', (req, res) => {
  var sqlRequest = 'SELECT * FROM book WHERE book_id = $1';
  var values = [req.params.id];
  getSQLResult(req, res, sqlRequest, values);
});

// UPDATE a book
app.post("/updateBook", function (req,res){
  var sqlRequest = `UPDATE book SET book_title = $1, book_authors = $2 WHERE book_id = $3; `;
  var values = [];
  values.push(req.body.book_title);
  values.push(req.body.book_authors);
  values.push(req.body.book_id);
  postSQLResult(req,res,sqlRequest,values)
});

// CREATE a book
app.post("/createBook", function (req,res){
  var sqlRequest = "INSERT INTO book(book_title, book_authors) VALUES($1,$2) RETURNING book_id;";
  var values = [];
  values.push(req.body.book_title);
  values.push(req.body.book_authors);
  postSQLResult(req,res,sqlRequest,values)
});

// DELETE a book
app.post("/deleteBook", function (req,res){
  var sqlRequest = `DELETE FROM book WHERE book_id = $1; `;
  var values = [];
  values.push(req.body.book_id);
  postSQLResult(req,res,sqlRequest,values)
});

// ----- BORROWS -----

// GET all borrows
app.post('/borrows', (req, res) => {
  var sqlRequest = 'SELECT * FROM borrow ORDER BY borrow_date DESC';
  var values = [];
  getSQLResult(req, res, sqlRequest, values);
});

// GET a borrow by person_id, book_id, and borrow_date
app.post('/borrow/:person_id/:book_id/:borrow_date', (req, res) => {
  var sqlRequest = 'SELECT * FROM borrow WHERE person_id = $1 AND book_id = $2 AND borrow_date = $3';
  var values = [req.params.person_id, req.params.book_id, req.params.borrow_date];
  getSQLResult(req, res, sqlRequest, values);
});

// UPDATE a borrow
app.post("/updateBorrow", function (req,res){
  var sqlRequest = `UPDATE borrow SET return_date = $1 WHERE person_id = $2 AND book_id = $3 AND borrow_date = $4; `;
  var values = [];
  values.push(req.body.return_date);
  values.push(req.body.person_id);
  values.push(req.body.book_id);
  values.push(req.body.borrow_date);
  postSQLResult(req,res,sqlRequest,values)
});

// CREATE a borrow
app.post("/createBorrow", function (req,res){
  var sqlRequest = "INSERT INTO borrow(person_id, book_id, borrow_date, return_date) VALUES($1,$2,$3,$4);";
  var values = [];
  values.push(req.body.person_id);
  values.push(req.body.book_id);
  values.push(req.body.borrow_date);
  values.push(req.body.return_date);
  postSQLResult(req,res,sqlRequest,values)
});

// DELETE a borrow
app.post("/deleteBorrow", function (req,res){
  var sqlRequest = `DELETE FROM borrow WHERE person_id = $1 AND book_id = $2 AND borrow_date = $3; `;
  var values = [];
  values.push(req.body.person_id);
  values.push(req.body.book_id);
  values.push(req.body.borrow_date);
  postSQLResult(req,res,sqlRequest,values)
});

// Must be LAST instruction of the file
// Listen to port 8000
app.listen(8000, () => {
  console.log('Server started!')
});