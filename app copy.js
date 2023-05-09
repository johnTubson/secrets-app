//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
const saltRounds = 10;

mongoose.connect("mongodb://127.0.0.1:27017/userDb");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});



const User = mongoose.model("user", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    username = req.body.username;
    password = req.body.password;

    User.findOne({ username: username })
      .then((foundList) => {
        if (foundList) {
          bcrypt.compare(password, foundList.password, function (err, result) {
            if (!err) {
              if (result == true) {
                res.render("secrets");
              } else {
                res.render("login");
              }
            } else {
              console.log(err);
              res.render("login");
            }
          });
        } else {
          console.log("User with the username " + username + " does not exist!");
          res.render("login");
        }
      })
      .catch((err) => {
        console.log(err);
        res.render("login");
      });
    
});


app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (!err) {
        const newUser = new User({
          username: req.body.username,
          password: hash,
        });

        newUser.save()
          .then(() => {
            res.render("secrets");
          })
          .catch((err) => {
            console.log(err);
            res.render("register");
          });
      } else {
        console.log(err);
        res.render("register");
      }
    });
    
    
});

app.listen(3000, function() {
    console.log("Server running on port 3000.")
});