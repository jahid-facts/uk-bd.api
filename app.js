// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors'); // Import the CORS package
const { ErrorHandler, handleErrors } = require('./src/utils/errorHandler'); 
require('dotenv').config(); // Load environment variables from .env file

// Create the Express app
const app = express();

// Set up port for the server
const port = process.env.PORT || 5000;

// Set up database connection URL
const dbURL = process.env.MONGODB_URL || 'mongodb+srv://ukbd:MNjqO714lSWx6le5@uk-bd-00.kt2fhlb.mongodb.net/uk-bd';

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3009', // Replace with your frontend domain
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'], 
  credentials: true, // Allow cookies to be sent along with requests
}));

// Use body-parser, helmet, morgan, and cookie-parser middleware
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('combined'));

// Import and use userRoute
const userRoute = require('./src/routes/userRoute');
const frontendRoute = require('./src/routes/frontendRoute');
const propertyRoute = require('./src/routes/propertyRoute');
app.use('/api', userRoute);
app.use('/api', frontendRoute);
app.use('/api', propertyRoute);


//Error handling middleware
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


app.get("/", (req, res, next) => {
  res.status(200).send('Server is working...');
});


