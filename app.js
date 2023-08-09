require('dotenv').config(); // Import dotenv at the beginning

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;
const dbURL = process.env.MONGODB_URL || 'mongodb://localhost:27017/airbnb';

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('combined'));
app.use(cookieParser());

const userRoute = require('./src/routes/userRoute');
app.use('/api', userRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
});
