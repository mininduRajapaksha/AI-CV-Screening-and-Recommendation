const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI 
      || process.env.MONGO_URI 
      || process.env.MONGO_URL 
      || process.env.MONGODB_URL 
      || process.env.DB_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in .env file. Please check MONGODB_URI variable.');
    }

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;