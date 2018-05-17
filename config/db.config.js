const mongoose = require('mongoose');
const DB_NAME = 'renting';
const MONGO_URI = process.env.MONGODB_URI || `mongodb://localhost/${DB_NAME}`;

mongoose.Promise = Promise;

mongoose.connect(MONGO_URI, {autoIndex: false})
  .then(() => {
    console.log(`Connected to ${DB_NAME} database.`);
  }).catch((error) => {
    console.error(`Database connection error: ${error}`);
  });