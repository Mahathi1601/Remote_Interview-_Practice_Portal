const mongoose = require('mongoose');

const connectDB = async (retryCount = 0) => {
  const maxRetries = 5;
  const retryDelay = 5000;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error(`❌ Connection attempt ${retryCount + 1} failed:`, error.message);
    
    if (retryCount < maxRetries) {
      console.log(`Retrying in ${retryDelay/1000} seconds...`);
      setTimeout(() => connectDB(retryCount + 1), retryDelay);
    } else {
      console.error('❌ Failed to connect after multiple retries');
      console.error('Please check:');
      console.error('1. Your IP is whitelisted in MongoDB Atlas');
      console.error('2. Username and password are correct');
      console.error('3. Connection string is correct');
      process.exit(1);
    }
  }
};

module.exports = connectDB;