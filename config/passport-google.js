const passport = require('passport');
// const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const googleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8000/auth/google/callback',
        },
        async function (accessToken, refreshToken, profile, cb) {
            try {
                let user = await User.findOne({
                    email: profile.emails[0].value,
                }).exec();
                if (user) {
                    return cb(false, user);
                } else {
                    let newUser = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex'),
                    });
                    if (newUser) {
                        return cb(false, newUser);
                    }
                }
            } catch (err) {
                console.log('Error : ', err);
                return cb(err, null);
            }
        }
    )
);

module.exports = passport;

// function (accessToken, refreshToken, profile, cb) {
//     try {
//         let user = User.findOrCreate({
//             email: profile.emails[0].value,
//         }).exec();
//         console.log(profile);
//         //return cb(err, user);
//     } catch (err) {
//         console.log('Error : ', err);
//         //return cb(err, null);
//     }
// }
