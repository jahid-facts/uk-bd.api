const jwt = require('jsonwebtoken');

// secret key
const secretKey = process.env.JWT_SECRET;

// Function to generate a JWT token
function jwtToken(payload) {
  const options = {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  };
  return jwt.sign(payload, secretKey, options);
}


module.exports = jwtToken;
