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
const autoSeed = require('./utils/autoSeed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: false
}));

const allowedOrigins = [
  'https://devops-learning-tracker-delta.vercel.app',
  'https://devops-learning-tracker.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      /^https:\/\/devops-learning-tracker-.*\.vercel\.app$/.test(origin);
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
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

  if (isConnected) {
    await autoSeed();
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
