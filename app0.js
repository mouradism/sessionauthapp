const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// Package documentation - https://www.npmjs.com/package/connect-mongo
/**
 * -------------- GENERAL SETUP --------------------------------------------------------------------
 */
{
  // Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
  require("dotenv").config();
  // Create the Express application
  var app = express();
  // Middleware that allows Express to parse through both JSON and x-www-form-urlencoded request bodies
  // These are the same as `bodyParser` - you probably would see bodyParser put here in most apps
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
/**
 ** -------------- DATABASE --------------------------------------------------------------------------
 */
mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
  })
);

/**
 * -------------- SESSION SETUP -------------------------------------------------------------------
 */
/* secret  resave  saveUninitialized  store{MongoStore{mongooseConnection,collection}}  cookie{maxAge} */
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.createConnection(process.env.DB_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      collection: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
{
  /**
   * -------------- ROUTES --------------------------------------------------------------------------
   */
  //
  // When you visit http://localhost:3000/login, you will see "Login Page"
  app.get("/login", (req, res, next) => {
    res.send("<h1>Login Page</h1>");
  });

  app.post("/login", (req, res, next) => {});

  // When you visit http://localhost:3000/register, you will see "Register Page"
  app.get("/register", (req, res, next) => {
    res.send("<h1>Register Page</h1>");
  });

  app.post("/register", (req, res, next) => {});

  /**
   * -------------- SERVER --------------------------------------------------------------------------
   */

  // Server listens on http://localhost:3000
  const port = 3000;
  app.listen(port, () => {
    console.log(`lisning on port ${port}`);
  });
}
