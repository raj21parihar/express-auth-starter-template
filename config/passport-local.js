const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
var validator = require('validator');
var axios = require('axios');

//auth using passport
passport.use(
    'local',
    new localStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true,
        },
        async function (req, email, password, done) {
            try {
                if (!validator.isEmail(email)) {
                    req.flash('error', 'Invalid email. ');
                    return done(null, false);
                }

                //verify reCaptcha - start ---
                let captchaURL =
                    'https://www.google.com/recaptcha/api/siteverify?secret=' +
                    process.env.RECAPTCHA_VERIFICATION_SEC_KEY +
                    '&response=' +
                    req.body['g-recaptcha-response'] +
                    '&remoteip=' +
                    req.connection.remoteAddress;

                let isCaptchaVerified = await axios.post(captchaURL);

                //if reCaptch verification failed return and exit.
                if (!isCaptchaVerified.data.success) {
                    req.flash(
                        'error',
                        'Captcha verification failed, please try again after sometime.'
                    );
                    return res.redirect('back');
                }

                //verify reCaptcha - end ---

                let user = await User.findOne({
                    email: email,
                })
                    .select('+password')
                    .exec();

                if (!user) {
                    req.flash('error', 'Invalid Username or Password!');
                    return done(null, false);
                }

                let matchPassword = await bcrypt.compare(
                    password,
                    user.password
                );
                if (!matchPassword) {
                    req.flash('error', 'Invalid Username or Password!');
                    return done(null, false);
                }

                return done(null, user);
            } catch (err) {
                console.log('Error in passport : ', err);
                return done(err);
            }
        }
    )
);

//serilizing user to decide whcih key to be kept in cookies
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

//serilizing user to decide whcih key to be kept in cookies
passport.deserializeUser(async function (id, done) {
    try {
        let user = await User.findById(id).exec();
        return done(null, user);
    } catch (err) {
        console.log('Error in passport : ', err);
        return done(err);
    }
});

passport.checkAuthentication = function (req, res, next) {
    //if user signed in, call the nexyt function
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/sign-in');
};

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();
};

module.exports = passport;
