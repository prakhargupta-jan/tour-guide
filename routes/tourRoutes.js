const { Router } = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {getAllTours, getTour, postTour, deleteTour, updateTour, top5tours, tourStats, getMonthlyPlans} = require('../controllers/tourController');
const AppError = require("../utils/appError");
const tourRouter = Router()

// top 5 tours
tourRouter.get('/top-5-tours', top5tours, getAllTours);

// tourStats
tourRouter.get('/tour-stats', protect, restrictTo('admin'), tourStats)

// monthly plans
tourRouter.get('/monthly-plans/:year', getMonthlyPlans) 


tourRouter.route('/').get(protect, getAllTours).post(protect, restrictTo('guide', 'lead-guide', 'admin'), postTour);

tourRouter.route('/:id').get(protect, getTour).delete(protect, restrictTo('admin'), deleteTour).put(protect, restrictTo('admin'), updateTour);


tourRouter.all('*', (req, res, next) => next(AppError('Page not found', 404)))
module.exports = tourRouter;