const { Router } = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const { createReview, getReviews } = require('../controllers/reviewController')
const reviewRouter = Router();

reviewRouter.route('/').get(protect, getReviews).post(protect, restrictTo('User', 'Admin'), createReview);

module.exports = reviewRouter;