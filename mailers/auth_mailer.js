const nodeMailer = require('../config/nodemailer');
require('dotenv').config();

exports.updatePasswordEmail = (user) => {
    console.log('password update mail.');
    nodeMailer.transporter.sendMail(
        {
            from: process.env.SMTP_USER,
            to: 'raj21parihar@gmail.com',
            subject: 'Password change alert.',
            html: '<h2> Your acount password has been changed</h2>',
        },
        function (err, info) {
            if (err) {
                console.log('Error : ', err);
            }
            console.log('Email sent.');
            return;
        }
    );
};
