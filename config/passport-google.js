// Import necessary modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// Define a new Google Strategy for Passport
passport.use(
    new GoogleStrategy(
        {
            // Configuration options for the Google Strategy
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                // Find a user with the email associated with the Google profile
                let user = await User.findOne({
                    email: profile.emails[0].value,
                });
                if (user) {
                    // If the user exists, return it
                    return cb(null, user);
                } else {
                    // Otherwise, create a new user
                    let newUser = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex'),
                    });
                    if (newUser) {
                        // If the new user is successfully created, return it
                        return cb(null, newUser);
                    }
                }
            } catch (err) {
                // If there is an error, log it and return it
                console.error('Error:', err);
                return cb(err, null);
            }
        }
    )
);

// Export the Passport module
module.exports = passport;
