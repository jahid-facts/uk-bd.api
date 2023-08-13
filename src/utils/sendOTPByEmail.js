const nodemailer = require('nodemailer');
const generateOTPEmailHTML = require('../utils/generateOTPEmailHTML')

const sendOTPByEmail = async (email, otp, name, subtitle) => {
  // Set up a nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure your email service settings here
    // Example for Gmail:
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const htmlContent = generateOTPEmailHTML(otp, name, subtitle);
  
  
  // Send the OTP email
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'OTP for Email Verification',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPByEmail;