const nodemailer = require("nodemailer");
const path = require('path');
const rootDirectory = path.join(__dirname, '../..');

const sendInfoByEmail = async (email, htmlContent, subject) => {
  // Set up a nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure your email service settings here
    // Example for Gmail:
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Send the Info email
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        filename: "invoice.pdf",
        path: path.join(rootDirectory, 'invoice.pdf'),
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendInfoByEmail;
