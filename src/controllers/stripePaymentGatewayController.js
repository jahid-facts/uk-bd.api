const pdfTemplate = require("../documents/pdfTemplate");
const Booking = require("../models/bookingModel");
const Payment = require("../models/paymentModel");
const GenerateHtmlPDF = require("../utils/GenerateHtmlPDF");
const { resReturn } = require("../utils/responseHelpers");
const sendInfoByEmail = require("../utils/sendInfoByEmail");
const pdf = require("html-pdf");
const path = require("path");
const nodemailer = require("nodemailer");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const rootDirectory = path.join(__dirname, '../..');

exports.stripePaymentGateway = async (req, res) => {
  const propertyInfo = req.body.propertyInfo;
  try {
    // Calculate the amount in cents
    const amountInCents = Math.round(
      propertyInfo.actualPrice > 1 ? propertyInfo.actualPrice * 100 : 2 * 100
    );

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
      description: `Payment for ${propertyInfo.name} ( ${propertyInfo.email} )`,
      metadata: propertyInfo,
    });

    // Send the client secret back to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // Handle any errors and send a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
};

exports.paymentAndBookingProperty = async (req, res) => {
  try {
    if (req.body.paymentIntentId) {
      const payment = await Payment.findOne({
        stripeId: req.body.paymentIntentId,
      });
      if (payment) {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          req.body.paymentIntentId
        );

        resReturn(res, 201, {
          message: "Data saved successfully",
          paymentIntent: paymentIntent,
        });
        return;
      }
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      req.body.paymentIntentId
    );

    const metadata = paymentIntent.metadata;

    const paymentData = {
      stripeId: paymentIntent.id,
      userId: metadata.userId,
      propertyId: metadata.propertyId,
      originalPrice: metadata.originalPrice,
      actualPrice: metadata.actualPrice,
      discountAmount: metadata.discountAmount,
      serviceFee: metadata.serviceFee,
      discountPercentage: metadata.discountPercentage,
      currency: paymentIntent.currency,
      status: "paid",
    };

    const savedPayment = await Payment.create(paymentData);

    const bookingData = {
      invoiceId: paymentIntent.created,
      paymentId: savedPayment.id,
      renterUserId: metadata.renterUserId,
      renterName: metadata.renterName,
      renterEmail: metadata.renterEmail,
      renterPhoneNumber: metadata?.renterPhoneNumber,
      hostUserId: metadata.hostUserId,
      hostName: metadata.hostName,
      hostEmail: metadata.hostEmail,
      hostPhoneNumber: metadata?.hostPhoneNumber,
      propertyId: metadata.propertyId,
      startDate: metadata.startDate,
      endDate: metadata.endDate,
      stayDays: metadata.stayDays,
      adults: metadata.adults,
      children: metadata.children,
      infants: metadata.infants,
      pets: metadata.pets,
      country: metadata?.country,
      addressLine1: metadata?.addressLine1,
      city: metadata?.city,
      state: metadata?.state,
      postalCode: metadata?.postalCode,
      status: "booked",
    };

    await Booking.create(bookingData);

    const pdfFilePath = path.join(rootDirectory, 'invoice.pdf');
    pdf.create(pdfTemplate(paymentIntent), {}).toFile(pdfFilePath, (err, _) => {
      if (err) {
        console.error("Error generating PDF:", err);
      } else {
        const email = paymentIntent.metadata.renterEmail;
        const htmlContent = GenerateHtmlPDF(paymentIntent);
        const subject = "Payment confirmation";
        sendInfoByEmail(email, htmlContent, subject)
          .then(() => {
            console.log("Email sent successfully");
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          });
      }
    });

    resReturn(res, 200, {
      message: "Data saved successfully",
      paymentIntent: paymentIntent,
    });
  } catch (error) {
    resReturn(res, 500, { error: error.message });
  }
};
 