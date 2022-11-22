const fs = require('fs')
const Tour = require('../models/tourModel');
const dotenv= require('dotenv')
dotenv.config({
    path: '../config.env'
})
require('../db');

const data = JSON.parse(fs.readFileSync('../dev/devData.json', {encoding: 'utf-8'}));
Tour.create(data).then(() => console.log('ho gaya')).catch(err => console.log(err));