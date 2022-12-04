const { default: mongoose, mongo } = require("mongoose");

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a User']
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must be of a Tour']
    },
    rating: {
        type: Number,
        min: [1, 'Review Rating cannot be less than 1'],
        max: [5, 'Review Rating cannot be more than 5']
    },
    review: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'User',
        select: 'name photo'
    }).populate({
        path: 'Tour',
        select: 'name'
    })
    next();
})


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review