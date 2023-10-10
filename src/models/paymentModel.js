const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AllProperty",
    },
    stripeId: String,
    totalAmount: Number,
    discountAmount: Number,
    fee: Number,
    discountPercentage: Number,
    currency: String,
    status: string,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
