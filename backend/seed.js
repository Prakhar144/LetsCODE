import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import dotenv from 'dotenv';
dotenv.config();

const seedProblems = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codeforge';
    await mongoose.connect(MONGO_URI);

    const problems = [
      // 1. Array & Hash Table
      {
        title: "Two Sum",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        test_cases: JSON.stringify([{ input: "2 7 11 15\n9", expected: "[0, 1]" }])
      },
      // 2. Stack
      {
        title: "Valid Parentheses",
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.",
        difficulty: "Easy",
        tags: ["Stack", "String"],
        test_cases: JSON.stringify([{ input: "()", expected: "True" }, { input: "(]", expected: "False" }])
      },
      // 3. Dynamic Programming
      {
        title: "Maximum Subarray",
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
        test_cases: JSON.stringify([{ input: "-2 1 -3 4 -1 2 1 -5 4", expected: "6" }])
      },
      {
        title: "Climbing Stairs",
        description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        difficulty: "Easy",
        tags: ["Math", "Dynamic Programming", "Memoization"],
        test_cases: JSON.stringify([{ input: "3", expected: "3" }])
      },
      // 4. Graph & BFS / DFS
      {
        title: "Number of Islands",
        description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
        difficulty: "Medium",
        tags: ["Array", "Graph", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
        test_cases: JSON.stringify([{ input: "1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", expected: "3" }])
      },
      // 5. Binary Search
      {
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
        difficulty: "Hard",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        test_cases: JSON.stringify([{ input: "1 3\n2", expected: "2.00000" }])
      },
      // 6. Linked List
      {
        title: "Reverse Linked List",
        description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
        difficulty: "Easy",
        tags: ["Linked List", "Recursion"],
        test_cases: JSON.stringify([{ input: "1 2 3 4 5", expected: "5 4 3 2 1" }])
      },
      // 7. Tree (Binary Tree)
      {
        title: "Invert Binary Tree",
        description: "Given the `root` of a binary tree, invert the tree, and return its root.",
        difficulty: "Easy",
        tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
        test_cases: JSON.stringify([{ input: "4 2 7 1 3 6 9", expected: "4 7 2 9 6 3 1" }])
      },
      // 8. Heap / Priority Queue
      {
        title: "Kth Largest Element in an Array",
        description: "Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.\n\nNote that it is the `kth` largest element in the sorted order, not the `kth` distinct element.",
        difficulty: "Medium",
        tags: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect"],
        test_cases: JSON.stringify([{ input: "3 2 1 5 6 4\n2", expected: "5" }])
      },
      // 9. Backtracking
      {
        title: "Permutations",
        description: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
        difficulty: "Medium",
        tags: ["Array", "Backtracking"],
        test_cases: JSON.stringify([{ input: "1 2 3", expected: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }])
      },
      // 10. Greedy
      {
        title: "Jump Game",
        description: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming", "Greedy"],
        test_cases: JSON.stringify([{ input: "2 3 1 1 4", expected: "true" }, { input: "3 2 1 0 4", expected: "false" }])
      },
      // 11. Trie
      {
        title: "Implement Trie (Prefix Tree)",
        description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this very efficient data structure, such as autocomplete and spellchecker.\n\nImplement the Trie class.",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Design", "Trie"],
        test_cases: JSON.stringify([{ input: "Trie insert search startsWith\napple apple app", expected: "null null true true" }])
      },
      // 12. Sliding Window
      {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string `s`, find the length of the longest substring without repeating characters.",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Sliding Window"],
        test_cases: JSON.stringify([{ input: "abcabcbb", expected: "3" }, { input: "bbbbb", expected: "1" }])
      },
      // 13. Two Pointers
      {
        title: "Container With Most Water",
        description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Greedy"],
        test_cases: JSON.stringify([{ input: "1 8 6 2 5 4 8 3 7", expected: "49" }])
      },
      // 14. Math
      {
        title: "Pow(x, n)",
        description: "Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).",
        difficulty: "Medium",
        tags: ["Math", "Recursion"],
        test_cases: JSON.stringify([{ input: "2.00000\n10", expected: "1024.00000" }])
      },
      // 15. Queue
      {
        title: "Design Circular Queue",
        description: "Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle and the last position is connected back to the first position to make a circle. It is also called 'Ring Buffer'.",
        difficulty: "Medium",
        tags: ["Array", "Linked List", "Design", "Queue"],
        test_cases: JSON.stringify([{ input: "MyCircularQueue enQueue enQueue\n3 1 2", expected: "null true true" }])
      }
    ];

    for (let p of problems) {
      await Problem.findOneAndUpdate(
        { title: p.title },
        { $set: p },
        { upsert: true, new: true }
      );
      console.log(`Updated/Added problem: ${p.title}`);
    }

    console.log("Database seeded successfully with all DSA categories.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }
};

seedProblems();
