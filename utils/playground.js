const sendEmail = require("./email");
const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/../config.env`});

sendEmail({email: 'jignesh@email.com',
message: 'Hello Jignesh',
subject: 'Namaste'}).then(() => console.log('everything is fine')).then(err => console.log(err))