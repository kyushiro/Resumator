/*
 * Entry point for the api.
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
// const dbConfig = require('./db');
const port = process.env.port || 4000;

const GenerateRoute = require('./routes/GenerateRoute');

app.use(bodyParser.json());

// mongoose.connect(dbConfig.path).then(
//    () => { console.log("db connection successful") },
//    err => { console.log("db connection failed, "+err) }
// );
app.use(express.static('assets'));

app.use('/generate', GenerateRoute);
app.listen(process.env.PORT || 4000, function(){
	console.log("Running");
})
