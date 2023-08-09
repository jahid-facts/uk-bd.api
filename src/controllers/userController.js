const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); 
const sendToken = require('../utils/jwtToken');

// Register a User
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: {
        public_id: 'avatar/1',
        url: 'Image name',  
      },
    });

    sendToken(user, 201, res); // Use sendToken to send the JWT token
  } catch (error) {
    next(error); 
  }
};
