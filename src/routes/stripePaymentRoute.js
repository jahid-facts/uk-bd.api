const express = require("express");
const {
  stripePaymentGateway,
} = require("../controllers/stripePaymentGatewayController");
const router = express.Router();

router.post("/create-payment-intent", stripePaymentGateway); 
 
module.exports = router;
 