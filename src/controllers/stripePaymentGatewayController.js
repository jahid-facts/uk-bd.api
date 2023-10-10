const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.stripePaymentGateway = async (req, res) => {
  // const { amount, email, name } = req.body;
  const amount = Math.floor(Math.random() * 10000); // Generates a random amount between 0 and 9999
  const email = `user${Math.floor(Math.random() * 10000)}@example.com`; // Generates a random email address
  const name = `User ${Math.floor(Math.random() * 10000)}`; // Generates a random name

  // const randomData = {
  //   amount: randomAmount,
  //   email: randomEmail,
  //   name: randomName,
  // };

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "usd",
      payment_method_types: ["card"],
      description: `Payment for ${name} (${email})`,
      metadata: {
        email: email,
        name: name,
      },
    });

    // console.log(paymentIntent)
    // Send the client secret back to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // Handle any errors and send a 500 Internal Server Error response
    res.status(500).json({ error: error.message });
  }
};
