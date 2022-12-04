const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        reviews
    })
})

exports.createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create(req.body);

    res.status(200).json({
        status: 'success',
        review
    })
})