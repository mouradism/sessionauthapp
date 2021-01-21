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
 * -------------- DATABASE --------------------------------------------------------------------------
 */
{
  /**
   * Connect to MongoDB Server using the connection string in the `.env` file.  To implement this, place the following
   * string into the `.env` file
   *
   * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
   */
}
const connection = mongoose.createConnection(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
});
// Defines the model that we will use in the app
//mongoose.model("User", UserSchema);

/**
 * -------------- SESSION SETUP -------------------------------------------------------------------
 */
{
  /**
   * The MongoStore is used to store session data.  We will learn more about this in the post.
   *
   * Note that the `connection` used for the MongoStore is the same connection that we are using above
   */
}
const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "sessions",
});

{
  /**
   * See the documentation for all possible options - https://www.npmjs.com/package/express-session
   *
   * As a brief overview (we will add more later):
   *
   * secret: This is a random string that will be used to "authenticate" the session.  In a production environment,
   * you would want to set this to a long, randomly generated string
   *
   * resave: when set to true, this will force the session to save even if nothing changed.  If you don't set this,
   * the app will still run but you will get a warning in the terminal
   *
   * saveUninitialized: Similar to resave, when set true, this forces the session to be saved even if it is unitialized
   */
}
const port = 3000;
app
  .use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      store: sessionStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  )
  /**
   * -------------- ROUTES --------------------------------------------------------------------------
   */
  // When you visit http://localhost:3000/login, you will see "Login Page"
  .get(
    "/login",
    (req, res, next) => {
      console.log(req.session);
      //res.send("<h1>Login Page</h1>");
      next();
    },
    (req, res) => {
      res.send("<h1>Login Page</h1>");
    }
  )
  .post("/login", (req, res, next) => {
    res.send("<h1>post Login Page</h1>");
  })
  // When you visit http://localhost:3000/register, you will see "Register Page"
  .get("/register", (req, res, next) => {
    res.send("<h1>Register Page</h1>");
  })
  .post("/register", (req, res, next) => {})
  /**
   * -------------- SERVER --------------------------------------------------------------------------
   */
  // Server listens on http://localhost:3000
  .listen(port, () => {
    console.log(`lisning on port ${port}`);
  });
