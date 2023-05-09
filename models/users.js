const mongoose = require("mongoose");
const { Passport } = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");



// Create a new mongoose schema for USERS document model
const userSchema = new mongoose.Schema({
    secret: String,
    active: Boolean,
});


const options = {
    usernameField: "email",
    usernameUnique: false,
    findByUsername: function (model, queryParameters) {
      // Add additional query parameter - AND condition - active: true
      queryParameters.active = true;
      return model.findOne(queryParameters, "_id email");
    },
    errorMessages: {
      MissingPasswordError: "Password required!",
      AttemptTooSoonError: "Account is currently locked. Try again later",
      TooManyAttemptsError:
        "Account locked due to too many failed login attempts",
      NoSaltValueStoredError: "Authentication not possible. No salt value stored",
      IncorrectPasswordError: "Incorrect password",
      IncorrectUsernameError: "No user with the provided email exist",
      MissingUsernameError: "No username was given",
      UserExistsError: "Email has already being registered!",
    },
  };
  
// Add passport methods (authentication and strategy) directly to the mongoose Schema
userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("user", userSchema);

