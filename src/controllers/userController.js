const User = require('../models/userModel'); 
const sendToken = require('../utils/jwtToken');

// Register a User
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: 'avatar/1', // Change this to your desired value
        url: 'Image name',   // Change this to your desired value
      },
    });

    sendToken(user, 201, res); // Use sendToken to send the JWT token
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};
