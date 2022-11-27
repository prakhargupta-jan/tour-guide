const { Router } = require("express");
const { signup, login, forgotPassword, resetPassword, updatePassword, protect} = require("../controllers/authController");
const { updateMe, deleteMe } = require("../controllers/userController");

const userRouter = Router();


userRouter.route('/signup').post(signup);
userRouter.route('/login').post(login);
userRouter.route('/update-password').patch(protect, updatePassword);

userRouter.route('/forgot-password').get(forgotPassword);
userRouter.route('/reset-password/:token').get(resetPassword)

userRouter.route('/update-me').patch(protect, updateMe)
userRouter.route('/delete-me', protect, deleteMe)

module.exports = userRouter;