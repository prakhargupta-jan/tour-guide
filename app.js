const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const rateLimit=  require('express-rate-limit');
const { default: helmet } = require('helmet');
const ExpressMongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean/lib');
const hpp = require('hpp');

limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'Too many requrests from this IP, please try again in an hour!'
})

// Middlewares
//// Security Headers
app.use(helmet());
//// Rate Limiting
app.use('/api', limiter);
//// mongo injection protection
app.use(ExpressMongoSanitize());
//// xss protection
app.use(xssClean())
//// parameter pollution
app.use(hpp({whitelist: ['duratoin', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']}));
app.use(express.json({limit: '10kb'}));
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(req.url, req.hostname, req.originalUrl, req.protocol)
    next();
})

// Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError('Webpage not found', 404))
})


// global Error Handler
app.use(globalErrorHandler)

module.exports = app;