const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const dataService = require('./services/dataService');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: 'https://devops-learning-tracker-delta.vercel.app'
  

}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

app.use('/api/v1', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the DevOps Compass API',
    version: '1.0.0',
    status: 'online'
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'API Route Not Found' });
});

app.use(errorHandler);

const startServer = async () => {
  const isConnected = await connectDB();
  dataService.setDbStatus(isConnected);

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

// Nodemon hot reload trigger comment for new env variables
startServer();
