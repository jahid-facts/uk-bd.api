const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    stripeId: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllProperty",
    },
    originalPrice: Number,
    actualPrice: Number,
    discountAmount: Number,
    serviceFee: Number,
    discountPercentage: Number,
    currency: String,
    invoice: String,
    status: String,   
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
