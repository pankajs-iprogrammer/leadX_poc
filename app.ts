const db = import("./app/config/db.config");
import router from "./routes";
import { CONSTANTS } from "./app/config/constants";
import * as express from "express";
const app = express();
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";
var passport = require("passport");
var session = require("express-session");
var Sequelize = require("sequelize");

// set our port
const port = process.env.PORT || CONSTANTS.STATICPORT;

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json());

// parse application/json
var SequelizeStore = require("connect-session-sequelize")(session.Store);

// create database, ensure 'mysql2' in your package.json
var sequelize = new Sequelize("leadx", "root", "password", {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false
});

app.use(
    session({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true
        // store: sequelize
    })
);
app.use(passport.initialize());
app.use(passport.session());

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride("X-HTTP-Method-Override"));

// routes ==================================================
app.use("/api", router);

// start app ===============================================
app.listen(port);

// shoutout to the user
console.log("Magic happens on port " + port);

// expose app
exports = module.exports = app;
