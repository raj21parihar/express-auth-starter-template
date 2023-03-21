const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');

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
                let user = await User.findOne({
                    email: email,
                    password: password,
                }).exec();
                if (!user) {
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
