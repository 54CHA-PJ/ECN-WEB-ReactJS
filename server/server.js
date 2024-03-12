require('dotenv').config();

const express = require('express');
const pg = require("pg");
const app = express();

var conString = process.env.DB_CONNECTION;

// DB FUNCTIONS

const getSQLResult = (req, res, sqlRequest, values) => {
  var client = new pg.Client(conString);
  client.connect(function(err) {
    if (err) {
      // Cannot connect
      console.error('cannot connect to postgres', err);
      res.status(500).end('Database connection error!');
    } else {
      // Connection is OK
      client.query(sqlRequest, values, function(err, result) {
        if (err) {
          // Request fails
          console.error('bad request', err);
          res.status(500).end('Bad request error!');
        } else {
          // Build result array from SQL result rows
          var results = [];
          for (var ind in result.rows) {
            results.push(result.rows[ind]);
          }
          // Convert object to a JSON string and send it back
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(results));
        }
        client.end();
      });
    }
  });
}

// APP FUNCTIONS

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
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

// Get all users
app.get('/users', (req, res) => {
  var sqlRequest = 'SELECT * FROM person ORDER BY person_lastname, person_firstname';
  var values = [];
  getSQLResult(req, res, sqlRequest, values);
});

// Get a user by ID
app.get('/user/:id', (req, res) => {
  var sqlRequest = 'SELECT * FROM person WHERE person_id = $1';
  var values = [req.params.id];
  getSQLResult(req, res, sqlRequest, values);
});

// Must be LAST instruction of the file
// Listen to port 8000
app.listen(8000, () => {
  console.log('Server started!')
});

