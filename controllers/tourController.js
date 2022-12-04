const app = require('../app');
const Tour = require('../models/tourModel')
const APIfeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


exports.getAllTours = catchAsync(async (req, res, next) => {
    const data = await new APIfeatures(Tour.find().select('-guides'), req.query).filter().sort().limit().paginate().findQuery;
    res.status(200).json({
        status: 'success',
        length: data.length,
        data
    })
})

exports.postTour = catchAsync(async (req, res, next) => {
    const data = await Tour.create(req.body)
    res.status(201).json({
        status: 'success',
        data
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    const data = await Tour.findById(req.params.id).populate({path: 'guides', select: '-__v -passwordChangedAt'}).populate('reviews')
    if (!data) {
        return next(new AppError('No tour found for this id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: data
    })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return next(new AppError('No tour found with the given id', 404));
    res.status(204).json({
        status: 'success',
        data: null
    })
})
exports.updateTour = catchAsync(async (req, res, next) => {
    const data = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!data) {
        return next(new AppError('No tour found with the given id', 404));
    }
    res.status(202).json({
        status: 'success',
        data
    })
})

// top 5 tours
exports.top5tours = catchAsync(async (req, res, next) => {
    req.params.sort = 'ratingsAverage -price duration'
    req.params.limit = 5
    next()
})

// aggregation pipeline
exports.tourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match : {ratingsAverage : {$gte: 4.5}}
        }, {
            $group : {
                _id: null,
                numRatings: {$sum: '$ratingsQuantity'},
                avgRating: {$avg : '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
            }
        }, {
            $sort: { avgPrice: 1 }
        }
    ])
    res.status(200).json({
        status: 'success',
        stats
    })
})

exports.getMonthlyPlans = catchAsync(async (req, res, next) => {
    const year = req.params.year*1;
    console.log(year);
    const plan = await Tour.aggregate([
        {
            $unwind: {path: '$startDates'}
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: {$month : '$startDates'},
                numTours: {$sum : 1},
                tours: {$push: '$name'}

            }
        }, {
            $addFields: {
                month: '$_id'
            }
        }, {
            $project: {
                _id : 0
            }
        }, {
            $sort: {
                month: 1
            }
        }, 
        // {
        //     $limit: 6
        // }
    ])
    res.status(200).json({
        status: 'success',
        plan
    })
})