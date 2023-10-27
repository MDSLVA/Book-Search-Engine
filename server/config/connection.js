// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

// module.exports = mongoose.connection;

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

const db = mongoose.connection;

// When successfully connected
db.on('connected', () => {
    console.log('Successfully connected to MongoDB.');
});

// If the connection throws an error
db.on('error', (err) => {
    console.error(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
db.on('disconnected', () => {
    console.log('Mongoose default connection disconnected.');
});

module.exports = db;
