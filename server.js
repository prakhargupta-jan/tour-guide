const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

require('./db');


const server = app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))


process.on('unhandledRejection', (err) => {
    console.log(err);
    server.close(() => process.exit(1));
})

process.on('uncaughtException', err => {
    console.log(err);
    server.close(() => process.exit(1));
})

