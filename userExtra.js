/* Working page for not yet added features
*/


const { random } = require("lodash");


app.get("/forgotpassword", function (req, res) {
  // forgot password
  // send email
  User.findOne({ email: req.body.email }).then((foundUser) => {
    // generate token and store to user database
    var token = foundUser._id * random(0, 255);
    foundUser.token = token;
    foundUser.tokenTime = Date.now();
    foundUser.save();

    const link = "http://localhost:3000/resetpassword?token=" + token;
    const msg = {
      to: foundUser.email,
      from: process.env["EMAIL"],
      subject: "Sign in to Todos",
      text:
        "Hello! Click the link below to finish signing in to Todos.\r\n\r\n" +
        link,
      html:
        '<h3>Hello!</h3><p>Click the link below to finish signing in to Todos.</p><p><a href="' +
        link +
        '">Sign in</a></p>',
    };
    return sendgrid.send(msg);
  });
});


app.get("/resetpassword/", function (req, res) {
    if(req.query.token) {
        const token = req.query.token;
        User.findOne({ token: token })
        .then((foundUser) => {
        if (foundUser && (Date.now() - foundUser.tokenTime) < (1000*60*60*24) ) {
          res.render("resetpassword");
        } else {
          res.render("linkexpired");
        }
        })
        .catch((err) => {
        console.log(err);
        res.redirect("/");
        });
    } else {
        res.redirect("/home");
    }
    
});


// Reset password
app.post("/resetpassword", function (req, res) {
  const newPassword = req.body.password;
  const token = req.body.token;
  User.findOne({ token: token }).then((foundUser) => {
    if (foundUser) {
      foundUser.setPassword(newPassword)
        .then((foundUser) => {
          foundUser.save()
            .then(() => {
              res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
              res.redirect("/");
            });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
    }
    else {
        res.render("/resetpassword")
    }
  }).catch((err) => {
    console.log(err);
    res.redirect(err);
  });
});

// Change password
app.post("/changepassword", function (req, res) {
  if (req.loggedIn) {
    const user = {
      email: req.user.email,
      oldPassword: req.body.password,
      newPassword: req.body.newPassword,
    };

    // change password code
    User.findOne({ email: user.email, active: true })
      .then((foundUser) => {
        if (foundUser) {
          foundUser.changePassword(user.oldPassword, user.newPassword).then(()=> {
            res.redirect("/secrets");
          }).catch((err) => {
            console.log("Incorrect password");
          });
        } else {
          console.log("User does not exist or Email hasn't being verified");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});






