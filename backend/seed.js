import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export const seedDatabaseData = async () => {
  try {
    const rawData = fs.readFileSync(new URL('./leetcode_500.json', import.meta.url), 'utf-8');
    const dataset = JSON.parse(rawData);

    console.log(`Loaded ${dataset.length} problems from dataset. Seeding to database...`);

    const bulkOps = dataset.map(p => {
      const title = p.task_id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      const newProblem = {
        title: title,
        description: p.problem_description,
        difficulty: p.difficulty,
        tags: p.tags,
        test_cases: JSON.stringify(p.input_output)
      };

      return {
        updateOne: {
          filter: { title: newProblem.title },
          update: { $set: newProblem },
          upsert: true
        }
      };
    });

    await Problem.bulkWrite(bulkOps);
    console.log(`Database seeded successfully with ${dataset.length} DSA problems.`);
  } catch (error) {
    console.error("Failed to seed database data:", error);
  }
};

const runStandalone = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/codeforge';
    await mongoose.connect(MONGO_URI);
    await seedDatabaseData();
    process.exit(0);
  } catch (error) {
    console.error("Standalone seed failed:", error);
    process.exit(1);
  }
};

// Only run standalone if this script is executed directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  runStandalone();
}
