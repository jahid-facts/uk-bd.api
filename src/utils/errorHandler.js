class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
  }
}

const handleErrors = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong Mongodb Id error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err.message = message;
    err.statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err.message = message;
    err.statusCode = 400;
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Json Web Token is invalid. Try again';
    err.message = message;
    err.statusCode = 400;
  }

  // JWT EXPIRE error
  if (err.name === 'TokenExpiredError') {
    const message = 'Json Web Token is expired. Try again';
    err.message = message;
    err.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    err.message = message;
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};

module.exports = {
  ErrorHandler,
  handleErrors,
};
