const User = require('../models/user');
const Token = require('../models/token');
const authMailer = require('../mailers/auth_mailer');
const crypto = require('crypto');

// to render the home page
module.exports.home = function (req, res) {
    return res.render('home');
};

// to render the sign-in page, if already logged in goto home page
module.exports.signin = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('sign_in');
};

// to render the sign-up page, if already logged in goto home page
module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('sign_up');
};

// Create a new user from signup page
module.exports.createUser = async function (req, res) {
    try {
        //check if password and confirm password not same
        if (req.body.password != req.body.confirm_password) {
            req.flash('error', 'Password not matching.');
            return res.redirect('back');
        }

        //check if user alrady exist
        let user = await User.findOne({ email: req.body.email }).exec();
        if (user) {
            req.flash('error', 'Email already exist.');
            return res.redirect('back');
        }

        //create new user and redirect to sign in page
        let newUser = await User.create(req.body);
        req.flash('success', 'User created.');
        res.redirect('/sign-in');
    } catch (err) {
        console.log('Error : ', err);
        return res.redirect('back');
    }
};

// to get the user crdentials and create user session
module.exports.createSession = function (req, res) {
    req.flash('success', 'Signed in successfully.');
    return res.redirect('/');
};

// to logout user using passports's logout method
module.exports.destroySession = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Signed out successfully.');
        return res.redirect('/');
    });
};

module.exports.changePassword = function (req, res) {
    return res.render('change_password');
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
            authMailer.passwordChangeAlertMail(user);
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error : ', err);
        return res.redirect('back');
    }
};

module.exports.forgotPassword = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('forgot_password');
};

module.exports.sendPasswordResetLink = async function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    try {
        let user = await User.findOne({ email: req.body.email }).exec();
        console.log(user);
        if (user) {
            let token = await Token.findOne({ userId: user._id });
            if (token) await token.deleteOne();
            let resetToken = crypto.randomBytes(32).toString('hex');
            //const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
            await new Token({
                user: user._id,
                token: resetToken,
                createdAt: Date.now(),
            }).save();
            let baseURL = process.env.BASE_URL;
            user.resetLink = `${baseURL}/reset-password?id=${user._id}&key=${resetToken}`;
            req.flash(
                'success',
                'An email has been sent to mailbox. please follow the instructions to reset your password.'
            );
            authMailer.passwordResetLinkMail(user);
        } else {
            req.flash(
                'error',
                `Email is not registered with us. Please retry will correct email.`
            );
        }
    } catch (err) {
        console.log('Error : ', err);
    }
    return res.redirect('back');
};

module.exports.resetPassword = async function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    try {
        let isTokenValid = await Token.findOne({
            user: req.query.id,
            token: req.query.key,
        }).exec();

        return res.render('reset_password', {
            isTokenValid: isTokenValid,
            id: req.query.id,
            key: req.query.key,
        });
    } catch (err) {
        console.log('Error : ', err);
        return res.redirect('/');
    }
};

module.exports.verifyAndSetNewPassword = async function (req, res) {
    try {
        let isTokenValid = await Token.findOne({
            user: req.body.id,
            token: req.body.key,
        }).exec();

        if (!isTokenValid) {
            req.flash(
                'error',
                'Password reset link expired, please try again.'
            );
            return res.redirect('back');
        }

        if (req.body.new_password != req.body.confirm_new_password) {
            req.flash('error', 'Confirm password should be same.');
            return res.redirect('back');
        }

        let updatedUser = await User.findOneAndUpdate(
            { _id: req.body.id },
            { password: req.body.new_password }
        ).exec();
        await Token.findByIdAndDelete(isTokenValid._id);
        let user = await User.findById(req.body.id);
        req.flash('success', 'Password updated.');
        authMailer.passwordChangeAlertMail(user);
        return res.redirect('/sign-in');
    } catch (err) {
        console.log('Error : ', err);
    }
    return res.redirect('/sign-in');
};
