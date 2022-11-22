const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: 'chandu',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transport.sendMail(mailOptions);
}

module.exports = sendEmail;