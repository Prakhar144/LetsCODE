import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Problem from './models/Problem.js';
import Submission from './models/Submission.js';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import codeRoutes from './routes/code.js';
import discussRoutes from './routes/discuss.js';
import feedRoutes from './routes/feed.js';
import { seedDatabaseData } from './seed.js';

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
    let mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/codeforge';
    let usingMemoryDb = false;

    // Use a temporary in-memory database if no valid MongoDB URI is provided
    if (mongoUri === 'memory' || mongoUri.includes('cluster0.mongodb.net') || mongoUri.includes('YOUR-ACTUAL-CLUSTER-URL')) {
      console.log('Starting temporary in-memory database for Render...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      usingMemoryDb = true;
    } else {
      mongoUri = mongoUri || 'mongodb://localhost:27017/codeforge';
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected.');
    
    // Ensure only admin@gmail.com is admin
    const adminEmail = 'admin@gmail.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash('admin@123', salt);
      await User.create({
        username: 'admin',
        email: adminEmail,
        password_hash,
        is_admin: true
      });
      console.log('Default admin user created.');
    } else if (!adminUser.is_admin) {
      adminUser.is_admin = true;
      await adminUser.save();
    }
    
    // Downgrade any other admins
    await User.updateMany({ email: { $ne: adminEmail } }, { $set: { is_admin: false } });
    
    if (usingMemoryDb) {
      console.log('Populating temporary database with 500 problems...');
      await seedDatabaseData();
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
