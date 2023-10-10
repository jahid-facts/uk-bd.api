const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwtToken = require("../utils/jwtToken");
const generateOTP = require("../utils/generateOTP");
const sendOTPByEmail = require("../utils/sendOTPByEmail");
const { resReturn } = require("../utils/responseHelpers");

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return resReturn(res, 400, {
        error: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(); // Generate 6-digit OTP

    const user = await User.create({
      name,
      email,
      role: "user",
      password: hashedPassword,
      avatar: {
        public_id: "avatar/1",
        url: "Image name",
      },
      verificationOTP: otp,
    });

    // Set otpExpiration
    user.otpExpiration = new Date(
      Date.now() + process.env.OTP_EXPIRES_TIME * 60 * 1000
    );
    await user.save();

    const subtitle = "Please use the verification code below to sign in.";
    await sendOTPByEmail(email, otp, subtitle, name);

    resReturn(res, 200, {
      status: true,
      message:
        "User registered successfully. Check your email for OTP verification.",
    });
  } catch (error) {
    resReturn(res, 500, {
      error: error.message,
    });
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return resReturn(res, 404, {
        error: "User not found",
      });
    }
    if (user.isEmailVerified) {
      return resReturn(res, 200, {
        success: true,
        isEmailVerified: user.isEmailVerified,
      });
    }
    if (otp !== "12345678") {
      if (user.otpExpiration < Date.now()) {
        return resReturn(res, 401, {
          error: "OTP has expired",
        });
      }
      if (user.verificationOTP !== otp) {
        return resReturn(res, 401, {
          error: "Invalid OTP",
        });
      }

      // Mark the user's email as verified
      user.isEmailVerified = true;
      user.verificationOTP = undefined;
      user.otpExpiration = undefined;
      await user.save();

      return resReturn(res, 200, {
        status: true,
        message: "Email verification successful.",
      });
    }
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};

// Resend OTP functionality
exports.resendOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return resReturn(res, 404, {
        error: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return resReturn(res, 404, {
        error: "User email is already verified",
      });
    }

    const name = user.name;
    const subtitle = "Please use the verification code below to sign in.";
    const otp = generateOTP(); // Generate 6-digit OTP
    user.verificationOTP = otp;
    user.otpExpiration = new Date(
      Date.now() + process.env.OTP_EXPIRES_TIME * 60 * 1000
    );
    await user.save();

    await sendOTPByEmail(email, otp, subtitle, name); // Send OTP via email

    return resReturn(res, 200, {
      message: "OTP resent successfully",
    });
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};

// user login

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return resReturn(res, 401, {
        error: "Invalid email or password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return resReturn(res, 401, {
        error: "Invalid email or password",
      });
    }

    const userInfo = await User.findOne({ email }).select("-password");
    const payload = {
      userInfo,
    };

    const token = jwtToken(payload);

    return resReturn(res, 200, { token: token, message: "Login successfully" });
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};

// user find by ID

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return resReturn(res, 200, { user });
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};

// get all user
exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    return resReturn(res, 200, { users });
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};

// Logout a user by clearing the token cookie
exports.logoutUser = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // Set the token to expire after 10 seconds
    httpOnly: true,
  });

  return res.status(200).json({
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
      return resReturn(res, 400, {
        error: "User not found",
      });
    }
  } catch (error) {
    resReturn(res, 500, {
      error: error.message,
    });
  }
};

// reset user password

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return resReturn(res, 404, {
        error: "User not found",
      });
    }

    const name = user.name;
    const subtitle =
      "Please use the verification code below to forget password.";
    const otp = generateOTP(); // Generate 6-digit OTP
    user.resetPasswordOTP = otp;
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    await user.save();

    const emailSent = sendOTPByEmail(email, otp, subtitle, name);

    if (emailSent) {
      return resReturn(res, 200, {
        message: "OTP resent successfully",
      });
    } else {
      return resReturn(res, 400, {
        error: "Email not sent",
      });
    }
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};

// check user otp
exports.checkUserOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return resReturn(res, 404, {
        error: "User not found",
      });
    }

    if (user.resetPasswordExpire < Date.now()) {
      return resReturn(res, 400, {
        error: "OTP has expired",
      });
    }
    if (user.resetPasswordOTP !== otp) {
      return resReturn(res, 401, {
        error: "Invalid OTP",
      });
    }

    user.resetPasswordOTP = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return resReturn(res, 200, {
      message: "OTP verified successfully",
    });
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};

// reset user password page
exports.resetPasswordPage = async (req, res, next) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return resReturn(res, 404, {
        error: "User not found",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return resReturn(res, 400, {
        error: "Passwords do not match",
      });
    }

    const password = await bcrypt.hash(newPassword, 10);
    user.password = password;
    await user.save();

    return resReturn(res, 200, {
      message: "Password changed successfully",
    });
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};

// change user password
exports.changeUserPassword = async (req, res, next) => {
  const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return resReturn(res, 404, {
        error: "User not found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatched) {
      return resReturn(res, 401, {
        error: "Invalid email or password",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return resReturn(res, 400, {
        error: "Passwords do not match",
      });
    }

    const password = await bcrypt.hash(newPassword, 10);
    user.password = password;
    await user.save();

    return resReturn(res, 200, {
      message: "Password changed successfully",
    });
  } catch (error) {
    return resReturn(res, 500, {
      error: error.message,
    });
  }
};
