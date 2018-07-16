/*
 * Entry point for the api.
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const morgan = require('morgan');
const passport = require('passport');
const dbconfig = require('./config/database');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-config.json');

const port = process.env.port || 4000;

const GenerateRoute = require('./routes/GenerateRoute');

app.use(bodyParser.json());

// mongoose.connect(dbConfig.path).then(
//    () => { console.log("db connection successful") },
//    err => { console.log("db connection failed, "+err) }
// );

mongoose.connect(dbconfig.database, { useNewUrlParser: true });

var api = require('./routes/api');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(passport.initialize());
app.use(express.static('assets'));


app.use('/api', api);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/generate', GenerateRoute);

app.listen(process.env.PORT || 4000, function(){
	console.log("Running");
})
