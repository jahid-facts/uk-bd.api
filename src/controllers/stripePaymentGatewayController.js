const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.stripePaymentGateway = async (req, res) => {
  const {
    userId,
    name,
    email,
    propertyId,
    originalPrice,
    actualPrice,
    discountAmount,
    serviceFee,
    discountPercentage,
    startDate,
    endDate,
  } = req.body;
  try {
    // Calculate the amount in cents
    const amountInCents = Math.round(actualPrice > 1 ? actualPrice * 100 : 2 * 100);

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method_types: ["card"],
      description: `Payment for ${name} ( ${email} )`,
    });

    // Send the client secret back to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // Handle any errors and send a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
}; 


exports.paymentAndBookingProperty = async (req, res) => {
  // const {
  //   userId,
  //   name,
  //   email,
  //   propertyId,
  //   originalPrice,
  //   actualPrice,
  //   discountAmount,
  //   serviceFee,
  //   discountPercentage,
  //   startDate,
  //   endDate,
  // } = req.body;
  console.log('paymentIntent.client_secret', req.body)
  try {
    // Calculate the amount in cents
    

    // Send the client secret back to the client
    res.json({ clientSecret: 'paymentIntent.client_secret' });
  } catch (error) {
    // Handle any errors and send a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
};
