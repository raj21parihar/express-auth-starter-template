const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo');
//used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local');
const passportGoogle = require('./config/passport-google');
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
//set session cookies encryption
app.use(
    session({
        name: 'auth-cookies',
        secret: process.env.SESSION_KEY,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 100,
        },
        store: MongoStore.create({
            mongoUrl: process.env.DB_CONNECTION,
            autoRemove: 'disabled',
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMiddleware.setFlash);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', require('./routes'));
app.use(express.static('assets'));

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err, 'Error while running server !');
    }
    console.log('Server running on port ', process.env.PORT);
    return;
});
