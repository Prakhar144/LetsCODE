import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const seedProblems = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/codeforge';
    await mongoose.connect(MONGO_URI);

    const rawData = fs.readFileSync(new URL('./leetcode_500.json', import.meta.url), 'utf-8');
    const dataset = JSON.parse(rawData);

    console.log(`Loaded ${dataset.length} problems from dataset. Seeding to database...`);

    let count = 0;
    for (let p of dataset) {
      const title = p.task_id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
      const newProblem = {
        title: title,
        description: p.problem_description,
        difficulty: p.difficulty,
        tags: p.tags,
        test_cases: JSON.stringify(p.input_output)
      };

      await Problem.findOneAndUpdate(
        { title: newProblem.title },
        { $set: newProblem },
        { upsert: true, new: true }
      );
      count++;
      if (count % 50 === 0) {
         console.log(`Inserted ${count} problems...`);
      }
    }
    console.log("Database seeded successfully with 500 DSA problems.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }
};

seedProblems();
