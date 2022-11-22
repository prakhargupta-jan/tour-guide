const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
// Middlewares
app.use(express.json());
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