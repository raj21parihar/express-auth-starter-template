// require  the env file
require('dotenv').config();

//require the library
const mongoose = require('mongoose');

//connect to database
mongoose.connect(process.env.DB_CONNECTION);

//aquire the connection
const db = mongoose.connection;

//in case of error
db.on('error', console.error.bind(console, 'Error connecting to Database'));

//if db up and running print this msg (once)
db.once('open', function () {
    console.log('Connected to database!');
});
