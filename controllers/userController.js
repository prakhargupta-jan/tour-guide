const User = require("../models/userModel");
const userRouter = require("../routes/userRoutes");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


// test these routes later


exports.updateMe = catchAsync(async (req, res, next) => {
    ['password', 'passwordConfirm', 'role', 'passwordChangedAt', 'passwordResetToken', 'passwordResetExpires'].map(el => {
        if (req.body[el]){
            return next(new AppError(`${el} field cannot be updated from this route`, 401))
        }
    })
    const newUser = await User.findByIdAndUpdate(req.user.id, req.body, {new: true, runValidators: false});
    res.status(200).json({
        status: 'success',
        newUser
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});
    
    res.status(200).json({
        status: 'success',
        data: null
    })
})