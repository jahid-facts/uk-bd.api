// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import the CORS package
const { ErrorHandler, handleErrors } = require('./src/utils/errorHandler');
require('dotenv').config(); // Load environment variables from .env file

// Create the Express app
const app = express();

// Set up port for the server
const port = process.env.PORT || 3000;

// Set up database connection URL
const dbURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/airbnb';

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend domain
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  credentials: true, // Allow cookies to be sent along with requests
}));

// Use body-parser, helmet, morgan, and cookie-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('combined'));
app.use(cookieParser());


// Import and use userRoute
const userRoute = require('./src/routes/userRoute');
app.use('/api', userRoute);


// Error handling middleware
app.use(handleErrors);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Connect to MongoDB
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up connection events
const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('Connected to MongoDB');
  
  // Start the server only after the database connection is established
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);   
  });
});

connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});


