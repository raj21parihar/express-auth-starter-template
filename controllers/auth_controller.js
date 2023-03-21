const User = require('../models/user');
const authMailer = require('../mailers/auth_mailer');

// to render the home page
module.exports.home = function (req, res) {
    return res.render('home');
};

// to render the sign-in page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('sign_in');
};

// to render the sign-up page
module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('sign_up');
};

// to get the sign up data and create user
module.exports.createUser = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            req.flash('error', 'Password not matching.');
            return res.redirect('back');
        }
        let user = await User.findOne({ email: req.body.email }).exec();
        if (user) {
            req.flash('error', 'Email already exist.');
            return res.redirect('back');
        }
        let newUser = await User.create(req.body).exec();
        req.flash('success', 'User created.');
        return res.redirect('/sign-in');
    } catch (err) {
        console.log('Error : ', err);
        return res.render('back');
    }
};

// to get the user crdentials and create user session
module.exports.createSession = function (req, res) {
    req.flash('success', 'Signed in successfully.');
    return res.redirect('/');
};

module.exports.destroySession = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Signed out successfully.');
        res.redirect('/');
    });
};

module.exports.resetPassword = function (req, res) {
    return res.render('reset_password');
};

module.exports.updatePassword = async function (req, res) {
    try {
        if (req.body.new_password != req.body.confirm_new_password) {
            req.flash('error', 'Confirm password should be same.');
            return res.redirect('back');
        }
        let user = await User.findOne({ _id: req.user.id })
            .select('+password')
            .exec();
        if (user.password != req.body.current_password) {
            req.flash('error', 'Invalid password.');
            return res.redirect('back');
        }
        let updatedUser = await User.findOneAndUpdate(
            { _id: user.id },
            { password: req.body.new_password }
        ).exec();
        if (updatedUser) {
            req.flash('success', 'Password updated.');
            authMailer.updatePasswordEmail(user);
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error : ', err);
        return res.render('back');
    }
};
