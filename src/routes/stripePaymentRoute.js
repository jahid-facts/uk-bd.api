const express = require("express");
const {
  stripePaymentGateway, paymentAndBookingProperty,
} = require("../controllers/stripePaymentGatewayController");
const router = express.Router();

router.post("/create-payment-intent", stripePaymentGateway); 
router.post("/payment-booking-propery", paymentAndBookingProperty); 
 
module.exports = router;
 