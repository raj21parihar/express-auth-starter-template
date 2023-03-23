const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

//define transporter
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

//define template rendring setup
let renderTemplate = function (data, relativePath) {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if (err) {
                console.log('Error : ', err);
                return;
            }
            mailHTML = template;
        }
    );
    return mailHTML;
};

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate,
};
