import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Problem from './models/Problem.js';
import Submission from './models/Submission.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import codeRoutes from './routes/code.js';
import discussRoutes from './routes/discuss.js';
import feedRoutes from './routes/feed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/code', codeRoutes);
app.use('/discuss', discussRoutes);
app.use('/feed', feedRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Codeforge API (Node.js)' });
});

// Sync database and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeforge');
    console.log('MongoDB connected.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
