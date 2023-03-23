const nodeMailer = require('../config/nodemailer');
require('dotenv').config();

exports.passwordChangeAlertMail = (user) => {
    let mailContent = nodeMailer.renderTemplate(
        { user: user },
        '/auth/password_change_alert.ejs'
    );
    nodeMailer.transporter.sendMail(
        {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Password Change Alert',
            html: mailContent,
        },
        function (err, info) {
            if (err) {
                console.log('Error : ', err);
            }
            return;
        }
    );
};

exports.passwordResetLinkMail = (user) => {
    let mailContent = nodeMailer.renderTemplate(
        { user: user },
        '/auth/password_reset_link.ejs'
    );
    nodeMailer.transporter.sendMail(
        {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: mailContent,
        },
        function (err, info) {
            if (err) {
                console.log('Error : ', err);
            }
            return;
        }
    );
};
