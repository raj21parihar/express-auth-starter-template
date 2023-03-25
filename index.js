// Import necessary modules
const express = require('express'); // web application framework for Node.js
const path = require('path'); // utility module to work with file and directory paths
const cookieParser = require('cookie-parser'); // middleware to parse cookies
const session = require('express-session'); // middleware for handling sessions
const passport = require('passport'); // authentication middleware for Node.js
const MongoStore = require('connect-mongo'); // MongoDB session store for Express and Connect
const flash = require('connect-flash'); // middleware for displaying flash messages
const expressLayouts = require('express-ejs-layouts'); // layout support for Express.js
const customMiddleware = require('./config/middleware'); // custom middleware for handling flash messages
const db = require('./config/mongoose'); // module for connecting to MongoDB
const passportLocal = require('./config/passport-local'); // Passport Local authentication strategy
const passportGoogle = require('./config/passport-google'); // Passport Google authentication strategy
require('dotenv').config(); // loads environment variables from a .env file

// Create an express application
const app = express();

// Configure the express application
app.set('view engine', 'ejs'); // set the view engine to EJS
app.set('views', path.join(__dirname, 'views')); // set the views directory path
app.set('layout extractStyles', true); // extract styles from layout
app.set('layout extractScripts', true); // extract scripts from layout
app.use(expressLayouts); // use express-ejs-layouts for rendering views

// Configure session middleware
app.use(
    session({
        name: 'auth-cookies', // name of the session cookie
        secret: process.env.SESSION_KEY, // key to encrypt the session cookie
        saveUninitialized: false, // do not save uninitialized sessions
        resave: false, // do not save sessions if not modified
        cookie: {
            maxAge: 1000 * 60 * 100, // session cookie expiry time in milliseconds
        },
        store: MongoStore.create({
            // store session data in MongoDB
            mongoUrl: process.env.DB_CONNECTION,
            autoRemove: 'disabled',
        }),
    })
);

// Initialize passport and set user authentication middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Use flash middleware to display flash messages
app.use(flash());

// Use middleware to parse request body and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use middleware to serve static files
app.use(express.static('assets'));

// Use custom middleware to set flash messages
app.use(customMiddleware.setFlash);

// Use routes
app.use('/', require('./routes'));

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err, 'Error while running server !');
    }
    console.log('Server running on port ', process.env.PORT);
    return;
});
