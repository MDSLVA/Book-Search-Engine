const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://marcelosilvaa92:sanchez_6@cluster0.3nzadve.mongodb.net/your-actual-database-name');


module.exports = mongoose.connection;
