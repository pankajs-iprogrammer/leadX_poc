// server.ts
const db = import('./app/config/db.config');
import router from './routes';
import { CONSTANTS }  from './app/config/constants';
// const Constants = require('./app/config/constants').constants;
// modules =================================================
import * as express from 'express';
const app            = express();
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';

// configuration ===========================================

// config files
// var db = require('./app/config/db.config');

// set our port
const port = process.env.PORT || CONSTANTS.STATICPORT; 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// routes ==================================================
//require('./app/routes')(app); // configure our routes
app.use('/api', router);

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;                         
