const catchAsync = require("../utils/catchAsync")
const jwt = require("jsonwebtoken")
const crypto = require('crypto')
const User = require("../models/userModel")
const { promisify } = require("util")
const AppError = require("../utils/appError")
const sendEmail = require("../utils/email")

const getToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	})

const createSendToken = (user, statusCode, res) => {
	const token = getToken(user._id);
	let cookieOptions = {
		expires: new Date(Date.now() + 90*24*60*60*1000),
		httpOnly: true
	}
	
	if (process.env.NODE_ENV == 'prod')
		cookieOptions.secure = true;
	
	res.cookie('jwt', token, cookieOptions)
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user
		}
	})
}

// Login
exports.login = catchAsync(async (req, res, next) => {
	if (!(req.body.email && req.body.password))
		next(new AppError("Please provide email and password", 400))
	const user = await User.findOne({ email: req.body.email }).select(
		"+password"
	)

	if (!user || !(await user.checkPassword(req.body.password)))
		return next(
			new AppError("Please provide correct email and password", 401)
		)
	createSendToken(user, 200, res);
})

// Sign-up
exports.signup = catchAsync(async (req, res, next) => {
	const newUser = await User.create(req.body)
	createSendToken(newUser, 200, res);
})

// Authentication Protection
exports.protect = catchAsync(async (req, res, next) => {
	if (
		!req.headers.authorization ||
		!req.headers.authorization.startsWith("Bearer")
	)
		return next(new AppError("Please login first", 403))
	const token = req.headers.authorization.split(" ")[1]
	const JWTdata = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

	const user = await User.findById(JWTdata.id)
	if (!user)
		next(
			new AppError(
				"Could not find the user associated with this request please login or signup again",
				401
			)
		)
	if (user.passwordChangedAfter(JWTdata.iat))
		return next(
			new AppError("User changed password! Please login again", 401)
		)
	req.user = user
	next()
})

// Authorization Protection Restriction
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (roles.includes(req.user.role)) return next()
		next(new AppError("Unauthorized user action", 401))
	}
}

// Forgot password reset token
exports.forgotPassword = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email })
	if (!user) return next(new AppError("Please provide a valid Email", 404))

	const token = await user.createPasswordResetToken()
	await user.save({ validateBeforeSave: false })
	try {
		await sendEmail({
			email: req.body.email,
			subject: "Password reset link | Valid for 10 minutes",
			message: `${req.protocol}://${req.hostname}/api/v1/users/reset-password/${token}`,
		})
		res.status(200).json({
			status: "success",
			message: "Password reset link sent to " + req.body.email,
		})
	} catch (err) {
		user.passwordResetToken = undefined
		user.passwordResetExpires = undefined
		await user.save()
		next(
			new AppError(
				"These was an error sending the email. Try again later."
			)
		)
	}
}

// Forgot password reset link
exports.resetPassword = catchAsync(async (req, res, next) => {
	if (!req.params.token) {
		return next(new AppError('Invalid request reset token needs to be appended at the end of the query string', 400));
	}

	const token = crypto.createHash('sha256').update(req.params.token).digest('hex').toString();
	
	const user = await User.findOne({
		passwordResetToken: token
	}).select('+passwordResetExpires')
	if (!user) return next(new AppError('No user associated with given token found, Please check the reset URL again', 400));
	if (user.passwordResetExpires < Date.now()) {
		user.passwordResetExpires = undefined;
		user.passwordResetToken = undefined;
		await user.save();
		return next(new AppError('Password reset token expired please generate new password reset link'))
	}
	
	res.status(200).json({
		status: 'success',
		message: 'ruko zara sabra karo'
	})
})

// Update Password
exports.updatePassword = catchAsync(async (req, res, next) => {
	const user = User.findOne({ email: req.body.email })
	if (!user)
		next(
			new AppError(
				"No account found associated with the given email id",
				404
			)
		)
	if (!req.body.oldPassword || !req.body.newPassword)
		next(new AppError("Please provide old password and newpassword"))
	if (!(await user.checkPassword(req.body.oldPassword)))
		return next(new AppError("Please provide correct old password", 401))
	user.password = req.body.newPassword
	await req.user.save({ validateBeforeSave: false })
	createSendToken(user, 200, res);
})
