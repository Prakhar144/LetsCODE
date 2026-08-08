import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codeforge';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const username = 'ADMIN';
    const email = 'admin123@gmail.com';
    const password = 'Admin@123';
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Check if exists
    let adminUser = await User.findOne({ username });
    if (adminUser) {
      console.log('Admin user exists. Updating credentials...');
      adminUser.email = email;
      adminUser.password_hash = password_hash;
      adminUser.is_admin = true;
      await adminUser.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      await User.create({
        username,
        email,
        password_hash,
        is_admin: true
      });
      console.log('Admin user created successfully.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();
