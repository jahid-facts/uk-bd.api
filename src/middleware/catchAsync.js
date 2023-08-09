module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch((err) => {
    next(err); // Pass the error to the next middleware
  });
};
