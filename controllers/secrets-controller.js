const User = require("../models/users");
const { body, validationResult } = require('express-validator');



// configure SECRETS route
async function secretsController (req, res) {
    try {
        const foundUsers = await User.find({ secret: { $ne: null } })
            /* Errors
            Database connection error
            Mongoose errors
            */
        return await res.render("secrets", { usersSecrets: foundUsers})
    } catch (err) {
      console.log(err);
    }
}


// configure SUBMIT routes
async function submitController (req, res) {
    // Validate and sanitize user submitted secret
    body("secret").escape().notEmpty();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.locals.errors = errors.array();
        return res.render("submit");
    }
    try {
        const submittedSecret = req.body.secret;
        const foundUser = await User.findById(req.user.id)
        foundUser.secret = submittedSecret;
        await foundUser.save()
            /* Errors
            Database connection error
            Mongoose errors
            User doesn't exist, unprobable
            */
        return res.redirect("/secrets");
    } catch (err) {
        console.log(err);
        res.redirect("/submit");
    }
}

module.exports = {
    secretsController,
    submitController
}