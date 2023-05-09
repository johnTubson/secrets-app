const { body, validationResult } = require('express-validator');

function emailValidation () {
    return body('email', 'Email Must Be a Valid Email Address').isEmail().trim().escape().normalizeEmail();
}

function passwordValidation() {
    return body('password').isLength({ min: 8 })
    .withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]').withMessage('Password Must Contain a Number')
    .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
    .trim().escape();
}

function registrationValidation () {
    return [emailValidation(), passwordValidation()];
}

function loginValidation () {
    return [emailValidation(), passwordValidation()];
}

function validationCheckHandler () {
    return function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.app.locals.authenticationErrors = errors.array();
            return res.render("login");
        }
        
        next();
    }
}

module.exports = {
    registrationValidation,
    loginValidation,
    validationCheckHandler,
}



