const passport = require("passport");
const User = require("../models/users");
const {
  authenticateController,
  logoutController,
  registerController,
  loginController,
} = require("../controllers/users-authentication");
const {
  secretsController,
  submitController,
} = require("../controllers/secrets-controller");
const { ensureLoggedIn } = require("connect-ensure-login");
const express = require("express");
const router = express.Router();
const {
  registrationValidation,
  loginValidation,
  validationCheckHandler,
} = require("../validation");







// configure HOME route
router.get("/", function (req, res) {
  res.render("home");
});



// configure LOGIN routes
router
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(loginValidation(), validationCheckHandler(), loginController());




// configure REGISTER routes
router
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(registrationValidation(), validationCheckHandler(), registerController, authenticateController("/register", "/secrets"));





// configure SECRETS route
router
  .get("/secrets", ensureLoggedIn("/login"), secretsController);




// configure SUBMIT routes
router
  .route("/submit")
  .get(ensureLoggedIn("/login"), function (req, res) {
    res.render("submit");
  })
  .post(submitController);





// configure LOGOUT route
router.post("/logout", logoutController);



module.exports = router;
