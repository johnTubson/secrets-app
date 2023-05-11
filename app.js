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
      Connect-mongo
 */

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const User = require("./models/users"); // require the mongoose model
const routes = require("./routes/routes");
const dbConnection = require("./db-connection");
const sessionStore = require("./models/session-store");



/**
 * Dependencies settings
 */
const port = process.env.PORT || 3000;
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


/**
 *  * MAIN APP
*/



// Database connection and Server initialization
var mongoInstance;
dbConnection()
.then( () => {
  return app.listen(port, () => console.log(`Server successfully running on ${port}`));
})
.catch(err => { 
  //close the express application
  process.nextTick(() => { throw err; }) 
})






// Create a session
app.use(session ({
  secret: process.env.SECRET.split(","),
  resave: false,
  saveUninitialized: false,
  store: sessionStore(mongoose.connection.getClient()),
}));




// Allow passport to create a new session or modify a session based on authentication
app.use(passport.initialize());
app.use(passport.session());




// Create a local authentication strategy for the mongoose model
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




  

// Global Handlers
app.use(function(req, res, next) {
  const userSession = req.isAuthenticated();
  app.locals.loggedIn = userSession ? true : false;
  app.locals.errors = null;
  app.locals.authenticationErrors = [];
  next();
}); 



// Routes Definition
app.use("/", routes);



// Invalid Route Handler
app.use(function(req, res, next) {
  res.render("error", {errorMsg: "Page not found!"});
});



// Error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(500).send("Some error occurred");
})



