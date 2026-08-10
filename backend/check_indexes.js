import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/codeforge');
    const db = mongoose.connection.db;
    const collections = await db.collections();
    for (const collection of collections) {
      if (collection.collectionName === 'users') {
        const indexes = await collection.indexes();
        console.log('Indexes for users:', JSON.stringify(indexes, null, 2));
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
