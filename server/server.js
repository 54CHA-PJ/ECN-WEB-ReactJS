require('dotenv').config();

const express = require('express');
const pg = require("pg");
const app = express();

var conString = process.env.DB_CONNECTION;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/authenticate', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const isAuthenticated = login === "admin" && password === "admin";
  const response = isAuthenticated ? {ok:'SUCCESS'} : {ok:'INVALID'};
  res.send(response);
});

// Must be LAST instruction of the file
// Listen to port 8000
app.listen(8000, () => {
  console.log('Server started!')
});

