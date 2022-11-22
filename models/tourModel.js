const { default: mongoose } = require("mongoose");

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'must tour name have'],
    },
    description: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type:Number,
        required: [true, 'A tour must have a maximum group size']
    },
    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'hard'],
            message: 'A difficulty can either be easy medium or hard'
        }
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be greater than 1'],
        max: [5, 'Rating must be less than 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    printDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return val > 0 && val < this.price;
            },
            message: 'provide a valid discount'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have some summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: {
        type: [Date]
    },
    secretTour: {
        type: Boolean,
        default: false,
        select: false
    }
}, {
    toJSON: {virtuals : true},
    toObject: {virtuals : true}
})

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration/7
})

tourSchema.pre(/^find/, function(next) {
    this.find({
        secretTour: {$ne: true}
    })
    next();
})
tourSchema.pre(/aggregate/, function(next) {
    this.pipeline().unshift({$match : {secretTour : {$ne : true}}})
    next();
})
module.exports = mongoose.model('Tour', tourSchema);