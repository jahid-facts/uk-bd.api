const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Calculate the expiration date based on JWT_EXPIRES_TIME (in seconds)
  const expiresIn = parseInt(process.env.JWT_EXPIRES_TIME) * 24 * 60 * 60; // Convert days to seconds

  // Set the options for the cookie
  const options = {
    expires: new Date(Date.now() + expiresIn * 1000), // Convert seconds to milliseconds
    httpOnly: true,
  };

  // Set the cookie
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
