const { Router } = require("express");
const { signup, login, forgotPassword, resetPassword, updatePassword, protect} = require("../controllers/authController");

const userRouter = Router();


userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);
userRouter.route('/update-password').patch(protect, updatePassword);

userRouter.route('/forgot-password').get(forgotPassword);
userRouter.route('/reset-password/:token').get(resetPassword)


userRouter.get('/', (req, res, next) => res.status(200).json({data: "teri ma ki chumt"}))

module.exports = userRouter;