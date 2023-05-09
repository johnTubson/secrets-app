const passport = require("passport");
const User = require("../models/users");


// configure LOGIN routes
function loginController () {
   return [authenticateController("/login", "/secrets"), ]
}


function authenticateController (failureRedirectURL, successRedirectURL ) {
    return passport.authenticate('local', { successReturnToOrRedirect: successRedirectURL, failureRedirect: failureRedirectURL, failureMessage: true});
}


// configure REGISTER routes
async function registerController (req, res, next) {
    // Checks for existing user, if not, registers new user and save to database
        try {
            await User.register({ email: req.body.email, active: true, }, req.body.password);
            /* Errors
            Database connection error
            Mongoose errors
            User error: Already registered email
            */
            next();
        } catch (err) {
            console.log(err);
            res.app.locals.authenticationErrors.push(err);
            res.render("register");
        }
}

// configure LOGOUT route
async function logoutController (req, res) {

    const logoutPromise = new Promise( (resolve, reject) => {
        req.logout(function(err) {
            if (err) reject (err);
        });
        resolve (res.redirect('/'))
    })

    try {
        return await logoutPromise;
        /* Errors
        Session error
        Passport error
        */
    } catch (err) {
        console.log(err)
        res.status(500).send("error logging out")
    }

}



module.exports = {
    authenticateController,
    logoutController,
    loginController,
    registerController
};


