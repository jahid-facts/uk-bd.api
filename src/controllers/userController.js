const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { ErrorHandler } = require("../utils/errorHandler");
const jwtToken = require("../utils/jwtToken");
const generateOTP = require("../utils/generateOTP"); 
const sendOTPByEmail = require("../utils/sendOTPByEmail");

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(); // Generate 6-digit OTP

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: {
        public_id: "avatar/1",
        url: "Image name",
      },
      verificationOTP: otp,
    });

    // Set otpExpiration
    user.otpExpiration = new Date(Date.now() + process.env.OTP_EXPIRES_TIME * 60 * 1000); 
    await user.save();

    const subtitle = 'Please use the verification code below to sign in.';
    await sendOTPByEmail(email, otp, subtitle, name); // Send OTP via email

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Check your email for OTP verification.",
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    if (user.otpExpiration < Date.now()) {
      throw new ErrorHandler("OTP has expired", 400);
    }
    if (user.verificationOTP !== otp) {
      throw new ErrorHandler("Invalid OTP", 400);
    }

    // Mark the user's email as verified
    user.isEmailVerified = true;
    user.verificationOTP = undefined;
    user.otpExpiration = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verification successful. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// Resend OTP functionality
exports.resendOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user.isEmailVerified == true) {
      return next(new ErrorHandler("User email is already verified", 400));
    }

    // if (user.otpExpiration && user.otpExpiration > new Date()) {
    //   return next(new ErrorHandler('OTP is still valid', 400));
    // }
    const name = user.name;
    const subtitle = 'Please use the verification code below to sign in.';
    const otp = generateOTP(); // Generate 6-digit OTP
    user.verificationOTP = otp;
    user.otpExpiration = new Date(Date.now() + process.env.OTP_EXPIRES_TIME * 60 * 1000);
    await user.save();

    await sendOTPByEmail(email, otp, subtitle, name); // Send OTP via email

    res.status(200).json({
      success: true,
      message:
        "OTP resent successfully. Check your email for OTP verification.",
    });
  } catch (error) {
    next(error);
  }
};

// user login

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email ", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid password", 401));
    }


    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwtToken(payload);

    res.status(200).json({
      success: true,
      token,
    });

  } catch (error) {
    next(error);
  }
};

// user find by ID

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// get all user
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Logout a user by clearing the token cookie
exports.logoutUser = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // Set the token to expire after 10 seconds
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Update user profile
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      sendToken(updatedUser, 200, res);
    } else {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

// reset user password

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    const name = user.name;
    const subtitle = 'Please use the verification code below to forget password.';
    const otp = generateOTP(); // Generate 6-digit OTP
    user.resetPasswordOTP = otp;
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    await user.save();

    const emailSent = sendOTPByEmail(email, otp, subtitle, name); 

    if (emailSent) {
      res.status(200).json({
        success: true,
        message: 'Password reset OTP has been sent to your email',
      });
    } else {
      throw new ErrorHandler('Error sending email', 500);
    }
  } catch (error) {
    next(error);
  }
};

// check user otp
exports.checkUserOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }
    
    if (user.resetPasswordExpire < Date.now()) {
      throw new ErrorHandler("OTP has expired", 400);
    }
    if (user.resetPasswordOTP !== otp) {
      throw new ErrorHandler("Invalid OTP", 400); 
    }

    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP has been valid',
    });
  } catch (error) {
    next(error);
  }
};


// reset user password page
exports.resetPasswordPage = async (req, res, next) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler('User not found', 400));
    }

    if( newPassword !== confirmNewPassword){
      throw new ErrorHandler('Passwords do not match', 400);
    }

    const password = await bcrypt.hash(newPassword, 10);
    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};


// change user password
exports.changeUserPassword = async (req, res, next) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = req.body; 

  try {

    const user = await User.findOne({ email }).select('+password');


    if (!user) {
      return next(new ErrorHandler('User not found', 400));
    }

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler('Old password invalid', 400));
    }

    if (newPassword !== confirmNewPassword) {
      throw new ErrorHandler('Passwords do not match', 400);
    }

    const password = await bcrypt.hash(newPassword, 10);
    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
