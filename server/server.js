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
          const jsonResp = {ok:'SUCCESS'}
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(jsonResp));
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

//User create
app.post("/createUser", function (req,res){
  var sqlRequest = "INSERT INTO person(person_firstname, person_lastname, person_birthdate, person_id) VALUES($1,$2,$3,$4) RETURNING person_id;";
  var values = [];
  values.push(req.body.person_firstname);
  values.push(req.body.person_lastname);
  values.push(req.body.person_birthdate);
  values.push(req.body.person_id);
  postSQLResult(req,res,sqlRequest,values)
});

//User deletes
app.post("/deleteUser", function (req,res){
  var sqlRequest = `DELETE FROM person WHERE person_id = $1; `;
  var values = [];
  values.push(req.body.person_id);
  postSQLResult(req,res,sqlRequest,values)
});

// Must be LAST instruction of the file
// Listen to port 8000
app.listen(8000, () => {
  console.log('Server started!')
});