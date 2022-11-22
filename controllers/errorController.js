const AppError = require("../utils/appError");

const devError = (res, err) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    nessage: err.message,
    stack: err.stack,
  });
};
const handleDBcastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDBduplicateFieldsError = (err) =>
  new AppError(
    `Duplicate field value: ${err.message.match(
      /(["'])(\\?.)*?\1/
    )}. Please use another value`, 400
  );
const handleDBValidationError = (err) =>
  new AppError(
    `Invalid input data :  ${Object.values(err.errors).map(
      (el) => el.message
    )}`,
    400
  );

const handleJWTError = (err) =>
  new AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = (err) =>
  new AppError("Your Token has expired Please log in again!", 401);

const prodError = (res, err) => {
  console.log(err);
  console.log(err.code);

  if (err.name == "CastError") err = handleDBcastError(err);
  if (err.code == '11000') err = handleDBduplicateFieldsError(err);
  if (err.name == "ValidatorError") err = handleDBValidationError(err);
  if (err.name == "JsonWebTokenError") err = handleJWTError(err);
  if (err.name == "TokenExpiredError") err = handleJWTExpiredError(err);
  if (err.isOperational == false) {
    return res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV == "dev") {
    devError(res, err);
  } else {
    prodError(res, err);
  }
};
