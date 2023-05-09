/**
 * APP Dependencies
      Express.js
      Body-parser
      Mongoose
      Express-session
      Passport
      Passport-local-mongoose
      Lodash
      Dotenv
 */

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const _ = require("lodash");
const User = require("./models/users"); // require the mongoose model
const routes = require("./routes/routes");
const dbConnection = require("./db-connection");

/**
 * Dependencies settings
 */

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


/**
 *  * MAIN APP
*/




// Create a session
app.use(session ({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));


/**
 * PASSPORT CONFIG
 */


// Allow passport to create a new session or modify a session based on authentication
app.use(passport.initialize());
app.use(passport.session());

// Create a new local strategy for the mongoose model


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


dbConnection()
.then( () => {
  return app.listen(3000, () => console.log("Server running on port 3000."));
})
.catch(err => { 
  //close the express application
  process.nextTick(() => { throw err; }) 
})

  


app.use(function(req, res, next) {

  const userSession = req.isAuthenticated();
  app.locals.loggedIn = userSession ? true : false;
  app.locals.err = null;
  app.locals.authenticationErrors = [];


  next();
}); 


app.use("/", routes);

app.use(function(req, res, next) {
  res.render("error", {errorMsg: "Page not found!"});
});

app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500).send("Some error occurred");
})



