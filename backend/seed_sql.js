import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import dotenv from 'dotenv';

dotenv.config();

const sqlProblems = [
  {
    title: "Combine Two Tables",
    description: "Write a SQL query to report the first name, last name, city, and state of each person in the `Person` table. If the address of a `personId` is not present in the `Address` table, report `null` instead.",
    difficulty: "Easy",
    test_cases: JSON.stringify({
      inputs: [
        {"Person": [{"personId": 1, "firstName": "Wang", "lastName": "Allen"}, {"personId": 2, "firstName": "Alice", "lastName": "Bob"}], "Address": [{"addressId": 1, "personId": 2, "city": "New York City", "state": "New York"}, {"addressId": 2, "personId": 3, "city": "Leetcode", "state": "California"}]}
      ],
      outputs: [
        [{"firstName":"Wang","lastName":"Allen","city":null,"state":null},{"firstName":"Alice","lastName":"Bob","city":"New York City","state":"New York"}]
      ]
    }),
    tags: ["SQL", "Database", "Join"]
  },
  {
    title: "Second Highest Salary",
    description: "Write a SQL query to report the second highest salary from the `Employee` table. If there is no second highest salary, the query should report `null`.",
    difficulty: "Medium",
    test_cases: JSON.stringify({
      inputs: [
        {"Employee": [{"id": 1, "salary": 100}, {"id": 2, "salary": 200}, {"id": 3, "salary": 300}]}
      ],
      outputs: [
        [{"SecondHighestSalary": 200}]
      ]
    }),
    tags: ["SQL", "Database"]
  },
  {
    title: "Duplicate Emails",
    description: "Write a SQL query to report all the duplicate emails. Note that it's guaranteed that the email field is not NULL.",
    difficulty: "Easy",
    test_cases: JSON.stringify({
      inputs: [
        {"Person": [{"id": 1, "email": "a@b.com"}, {"id": 2, "email": "c@d.com"}, {"id": 3, "email": "a@b.com"}]}
      ],
      outputs: [
        [{"Email": "a@b.com"}]
      ]
    }),
    tags: ["SQL", "Database", "Group By"]
  },
  {
    title: "Employees Earning More Than Their Managers",
    description: "Write a SQL query to find the employees who earn more than their managers. Return the result table in any order.",
    difficulty: "Medium",
    test_cases: JSON.stringify({
      inputs: [
        {"Employee": [{"id": 1, "name": "Joe", "salary": 70000, "managerId": 3}, {"id": 2, "name": "Henry", "salary": 80000, "managerId": 4}, {"id": 3, "name": "Sam", "salary": 60000, "managerId": null}, {"id": 4, "name": "Max", "salary": 90000, "managerId": null}]}
      ],
      outputs: [
        [{"Employee": "Joe"}]
      ]
    }),
    tags: ["SQL", "Database", "Join"]
  },
  {
    title: "Customers Who Never Order",
    description: "Write a SQL query to report all customers who never order anything. Return the result table in any order.",
    difficulty: "Easy",
    test_cases: JSON.stringify({
      inputs: [
        {"Customers": [{"id": 1, "name": "Joe"}, {"id": 2, "name": "Henry"}, {"id": 3, "name": "Sam"}, {"id": 4, "name": "Max"}], "Orders": [{"id": 1, "customerId": 3}, {"id": 2, "customerId": 1}]}
      ],
      outputs: [
        [{"Customers": "Henry"}, {"Customers": "Max"}]
      ]
    }),
    tags: ["SQL", "Database"]
  }
];

const seedSqlProblems = async () => {
  try {
    const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/codeforge';
    await mongoose.connect(MONGO_URI);
    
    console.log(`Loaded ${sqlProblems.length} SQL problems. Seeding to database...`);
    
    const bulkOps = sqlProblems.map(p => {
      return {
        updateOne: {
          filter: { title: p.title },
          update: { $set: p },
          upsert: true
        }
      };
    });

    await Problem.bulkWrite(bulkOps);
    console.log(`Database seeded successfully with ${sqlProblems.length} SQL problems.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database data:", error);
    process.exit(1);
  }
};

seedSqlProblems();
