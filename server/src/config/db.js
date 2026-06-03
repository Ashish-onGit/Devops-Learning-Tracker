const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devops_compass';
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`MongoDB Connection Error: ${error.message}`);
    console.warn('Backend server running in local fallback mode (no MongoDB connected). APIs will serve fallback seed data.');
    return false;
  }
};

module.exports = connectDB;
