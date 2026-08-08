import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import fs from 'fs';

async function seedMassive() {
  try {
    await mongoose.connect('mongodb://localhost:27017/codeforge');
    console.log('MongoDB connected for massive seed.');

    // Clear existing
    await Problem.deleteMany({});
    console.log('Cleared existing problems.');

    const problems = [
      {
        title: "Two Sum",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
        difficulty: "Easy",
        test_cases: JSON.stringify([
          { input: "2 7 11 15\n9", expected: "[0, 1]" },
          { input: "3 2 4\n6", expected: "[1, 2]" },
          { input: "3 3\n6", expected: "[0, 1]" }
        ])
      },
      {
        title: "Valid Parentheses",
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n\nExample:\nInput: s = \"()\"\nOutput: True\n\nInput: s = \"()[]{}\"\nOutput: True",
        difficulty: "Easy",
        test_cases: JSON.stringify([
          { input: "()", expected: "True" },
          { input: "()[]{}", expected: "True" },
          { input: "(]", expected: "False" }
        ])
      },
      {
        title: "Maximum Subarray",
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nExample:\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.",
        difficulty: "Medium",
        test_cases: JSON.stringify([
          { input: "-2 1 -3 4 -1 2 1 -5 4", expected: "6" },
          { input: "1", expected: "1" },
          { input: "5 4 -1 7 8", expected: "23" }
        ])
      },
      {
        title: "Merge Intervals",
        description: "Given an array of `intervals` where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.\n\nExample:\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]",
        difficulty: "Medium",
        test_cases: JSON.stringify([
          { input: "1,3 2,6 8,10 15,18", expected: "[[1, 6], [8, 10], [15, 18]]" },
          { input: "1,4 4,5", expected: "[[1, 5]]" }
        ])
      },
      {
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).\n\nExample:\nInput: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000",
        difficulty: "Hard",
        test_cases: JSON.stringify([
          { input: "1 3\n2", expected: "2.00000" },
          { input: "1 2\n3 4", expected: "2.50000" }
        ])
      },
      {
        title: "Number of Islands",
        description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\nExample:\nInput:\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0\nOutput: 1",
        difficulty: "Medium",
        test_cases: JSON.stringify([
          { input: "1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", expected: "1" },
          { input: "1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", expected: "3" }
        ])
      },
      {
        title: "Climbing Stairs",
        description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nExample:\nInput: n = 2\nOutput: 2",
        difficulty: "Easy",
        test_cases: JSON.stringify([
          { input: "2", expected: "2" },
          { input: "3", expected: "3" },
          { input: "4", expected: "5" }
        ])
      },
      {
        title: "Word Break",
        description: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\nExample:\nInput: s = \"leetcode\", wordDict = [\"leet\",\"code\"]\nOutput: true",
        difficulty: "Medium",
        test_cases: JSON.stringify([
          { input: "leetcode\nleet code", expected: "true" },
          { input: "applepenapple\napple pen", expected: "true" },
          { input: "catsandog\ncats dog sand and cat", expected: "false" }
        ])
      },
      {
        title: "Coin Change",
        description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nExample:\nInput: coins = [1,2,5], amount = 11\nOutput: 3",
        difficulty: "Medium",
        test_cases: JSON.stringify([
          { input: "1 2 5\n11", expected: "3" },
          { input: "2\n3", expected: "-1" },
          { input: "1\n0", expected: "0" }
        ])
      }
    ];

    // Generate remaining problems up to 100
    const topics = ['Array', 'Tree', 'Graph', 'Linked List', 'Dynamic Programming', 'String', 'Hash Table', 'Math'];
    const actions = ['Reverse', 'Find Maximum in', 'Calculate Sum of', 'Merge Two', 'Rotate', 'Check Valid', 'Count Nodes in', 'Search in'];
    
    for (let i = 10; i <= 100; i++) {
      const topic = topics[i % topics.length];
      const action = actions[(i * 3) % actions.length];
      const difficulty = i % 7 === 0 ? 'Hard' : (i % 3 === 0 ? 'Medium' : 'Easy');
      
      problems.push({
        title: `${action} ${topic} (Variant ${i})`,
        description: `This is an auto-generated problem for ${action.toLowerCase()} a ${topic.toLowerCase()}.\n\nGiven the standard input for a ${topic}, implement an algorithm that solves the problem in optimal time complexity.\n\nExample:\nInput: standard input format\nOutput: expected output based on problem constraints.`,
        difficulty: difficulty,
        test_cases: JSON.stringify([
          { input: "1 2 3", expected: "1 2 3" },
          { input: "4 5 6", expected: "4 5 6" }
        ])
      });
    }

    await Problem.insertMany(problems);
    console.log(`Successfully seeded ${problems.length} problems!`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedMassive();
