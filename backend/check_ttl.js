import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/codeforge');
    const db = mongoose.connection.db;
    const collections = await db.collections();
    for (const collection of collections) {
      const indexes = await collection.indexes();
      for (const idx of indexes) {
        if (idx.expireAfterSeconds !== undefined) {
          console.log(`TTL Index found in ${collection.collectionName}:`, idx);
        }
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
