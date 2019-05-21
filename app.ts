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
var MySQLStore = require("express-mysql-session")(session);

// set our port
const port = process.env.PORT || CONSTANTS.STATICPORT;

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json());

var options = {
    // Host name for database connection:
    host: process.env.DB_HOST,
    // Port number for database connection:
    port: 3306,
    // Database user:
    user: process.env.DB_USERNAME,
    // Password for the above database user:
    password: process.env.DB_PASSWORD,
    // Database name:
    database: process.env.DB_DATABASE,
    // Whether or not to automatically check for and clear expired sessions:
    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 900000,
    // The maximum age of a valid session; milliseconds:
    expiration: 86400000,
    // Whether or not to create the sessions database table, if one does not already exist:
    createDatabaseTable: true,
    // Number of connections when creating a connection pool:
    connectionLimit: 1,
    // Whether or not to end the database connection when the store is closed.
    // The default value of this option depends on whether or not a connection was passed to the constructor.
    // If a connection object is passed to the constructor, the default value for this option is false.
    endConnectionOnClose: true,
    charset: "utf8mb4_bin",
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data"
        }
    }
};

var sessionStore = new MySQLStore(options);

app.use(
    session({
        key: "session_cookie_name",
        secret: "session_cookie_secret",
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect("/dashboard");
    } else {
        next();
    }
};

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride("X-HTTP-Method-Override"));

// routes ==================================================
app.use("/api", sessionChecker, router);

// start app ===============================================
app.listen(port);

// shoutout to the user
console.log("Magic happens on port " + port);

// expose app
exports = module.exports = app;
