const User = require('../models/user');

// to render the home page
module.exports.home = function (req, res) {
    return res.render('home');
};

// to render the sign-in page
module.exports.signin = function (req, res) {
    return res.render('sign_in');
};

// to render the sign-up page
module.exports.signup = function (req, res) {
    return res.render('sign_up');
};

// to get the sign up data and create user
// module.exports.createUser = function (req, res) {
// return res.render('sign_in');
// };

// to get the user crdentials and stablish session
// module.exports.createSession = function (req, res) {
//     return res.render('sign_up');
// };
