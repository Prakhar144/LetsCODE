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
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n**Input Format:**\n- The first line contains space-separated integers representing the array `nums`.\n- The second line contains a single integer `target`.\n\n**Output Format:**\n- Return a list/array of two integers representing the indices.\n\n**Constraints:**\n- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`\n- `-10^9 <= target <= 10^9`\n\n**Example:**\n**Input:**\n2 7 11 15\n9\n**Output:**\n[0, 1]\n**Explanation:** `nums[0] + nums[1] == 9`, so we return `[0, 1]`.",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        test_cases: JSON.stringify([{ input: "2 7 11 15\n9", expected: "[0, 1]" }])
      },
      // 2. Stack
      {
        title: "Valid Parentheses",
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n\n**Input Format:**\n- A single string `s` representing the sequence of brackets.\n\n**Output Format:**\n- Return `true` if the string is valid, otherwise return `false`.\n\n**Constraints:**\n- `1 <= s.length <= 10^4`\n- `s` consists of parentheses only '()[]{}'.\n\n**Example:**\n**Input:**\n()\n**Output:**\nTrue",
        difficulty: "Easy",
        tags: ["Stack", "String"],
        test_cases: JSON.stringify([{ input: "()", expected: "True" }, { input: "(]", expected: "False" }])
      },
      // 3. Dynamic Programming
      {
        title: "Maximum Subarray",
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n**Input Format:**\n- A single line containing space-separated integers representing the array `nums`.\n\n**Output Format:**\n- Return a single integer representing the maximum subarray sum.\n\n**Constraints:**\n- `1 <= nums.length <= 10^5`\n- `-10^4 <= nums[i] <= 10^4`\n\n**Example:**\n**Input:**\n-2 1 -3 4 -1 2 1 -5 4\n**Output:**\n6\n**Explanation:** The subarray `[4,-1,2,1]` has the largest sum `6`.",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
        test_cases: JSON.stringify([{ input: "-2 1 -3 4 -1 2 1 -5 4", expected: "6" }])
      },
      {
        title: "Climbing Stairs",
        description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\n**Input Format:**\n- A single integer `n`.\n\n**Output Format:**\n- Return a single integer representing the number of distinct ways to climb.\n\n**Constraints:**\n- `1 <= n <= 45`\n\n**Example:**\n**Input:**\n3\n**Output:**\n3\n**Explanation:** There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
        difficulty: "Easy",
        tags: ["Math", "Dynamic Programming", "Memoization"],
        test_cases: JSON.stringify([{ input: "3", expected: "3" }])
      },
      // 4. Graph & BFS / DFS
      {
        title: "Number of Islands",
        description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\n**Input Format:**\n- Multiple lines, each containing space-separated '1's and '0's representing the grid.\n\n**Output Format:**\n- Return a single integer representing the number of islands.\n\n**Constraints:**\n- `m == grid.length`\n- `n == grid[i].length`\n- `1 <= m, n <= 300`\n\n**Example:**\n**Input:**\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1\n**Output:**\n3",
        difficulty: "Medium",
        tags: ["Array", "Graph", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
        test_cases: JSON.stringify([{ input: "1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", expected: "3" }])
      },
      // 5. Binary Search
      {
        title: "Median of Two Sorted Arrays",
        description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).\n\n**Input Format:**\n- First line contains space-separated integers for `nums1`.\n- Second line contains space-separated integers for `nums2`.\n\n**Output Format:**\n- Return a single float representing the median (up to 5 decimal places).\n\n**Constraints:**\n- `nums1.length == m`, `nums2.length == n`\n- `0 <= m <= 1000`, `0 <= n <= 1000`\n- `1 <= m + n <= 2000`\n\n**Example:**\n**Input:**\n1 3\n2\n**Output:**\n2.00000",
        difficulty: "Hard",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        test_cases: JSON.stringify([{ input: "1 3\n2", expected: "2.00000" }])
      },
      // 6. Linked List
      {
        title: "Reverse Linked List",
        description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\n**Input Format:**\n- A single line of space-separated integers representing the values of the linked list nodes.\n\n**Output Format:**\n- Return a space-separated string of the reversed linked list.\n\n**Constraints:**\n- The number of nodes in the list is the range `[0, 5000]`.\n- `-5000 <= Node.val <= 5000`\n\n**Example:**\n**Input:**\n1 2 3 4 5\n**Output:**\n5 4 3 2 1",
        difficulty: "Easy",
        tags: ["Linked List", "Recursion"],
        test_cases: JSON.stringify([{ input: "1 2 3 4 5", expected: "5 4 3 2 1" }])
      },
      // 7. Tree (Binary Tree)
      {
        title: "Invert Binary Tree",
        description: "Given the `root` of a binary tree, invert the tree, and return its root.\n\n**Input Format:**\n- A level-order traversal (space-separated integers) representing the binary tree. `null` values might be represented as `null` or skipped.\n\n**Output Format:**\n- A space-separated level-order traversal of the inverted tree.\n\n**Constraints:**\n- The number of nodes in the tree is in the range `[0, 100]`.\n- `-100 <= Node.val <= 100`\n\n**Example:**\n**Input:**\n4 2 7 1 3 6 9\n**Output:**\n4 7 2 9 6 3 1",
        difficulty: "Easy",
        tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
        test_cases: JSON.stringify([{ input: "4 2 7 1 3 6 9", expected: "4 7 2 9 6 3 1" }])
      },
      // 8. Heap / Priority Queue
      {
        title: "Kth Largest Element in an Array",
        description: "Given an integer array `nums` and an integer `k`, return the `kth` largest element in the array.\n\nNote that it is the `kth` largest element in the sorted order, not the `kth` distinct element.\n\n**Input Format:**\n- First line contains space-separated integers representing `nums`.\n- Second line contains a single integer `k`.\n\n**Output Format:**\n- Return a single integer which is the kth largest element.\n\n**Constraints:**\n- `1 <= k <= nums.length <= 10^5`\n- `-10^4 <= nums[i] <= 10^4`\n\n**Example:**\n**Input:**\n3 2 1 5 6 4\n2\n**Output:**\n5",
        difficulty: "Medium",
        tags: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect"],
        test_cases: JSON.stringify([{ input: "3 2 1 5 6 4\n2", expected: "5" }])
      },
      // 9. Backtracking
      {
        title: "Permutations",
        description: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.\n\n**Input Format:**\n- A single line containing space-separated integers representing `nums`.\n\n**Output Format:**\n- Return a JSON array of arrays representing all permutations.\n\n**Constraints:**\n- `1 <= nums.length <= 6`\n- `-10 <= nums[i] <= 10`\n- All the integers of `nums` are unique.\n\n**Example:**\n**Input:**\n1 2 3\n**Output:**\n[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
        difficulty: "Medium",
        tags: ["Array", "Backtracking"],
        test_cases: JSON.stringify([{ input: "1 2 3", expected: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }])
      },
      // 10. Greedy
      {
        title: "Jump Game",
        description: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.\n\n**Input Format:**\n- A single line containing space-separated integers representing `nums`.\n\n**Output Format:**\n- Return `true` or `false`.\n\n**Constraints:**\n- `1 <= nums.length <= 10^4`\n- `0 <= nums[i] <= 10^5`\n\n**Example:**\n**Input:**\n2 3 1 1 4\n**Output:**\ntrue\n**Explanation:** Jump 1 step from index 0 to 1, then 3 steps to the last index.",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming", "Greedy"],
        test_cases: JSON.stringify([{ input: "2 3 1 1 4", expected: "true" }, { input: "3 2 1 0 4", expected: "false" }])
      },
      // 11. Trie
      {
        title: "Implement Trie (Prefix Tree)",
        description: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with `insert`, `search`, and `startsWith` methods.\n\n**Input Format:**\n- First line contains a space-separated list of operations (e.g. `Trie insert search startsWith`).\n- Second line contains space-separated arguments for each operation respectively.\n\n**Output Format:**\n- Return a space-separated string of results (`null` for void methods, `true`/`false` for boolean methods).\n\n**Constraints:**\n- `1 <= word.length, prefix.length <= 2000`\n- `word` and `prefix` consist only of lowercase English letters.\n\n**Example:**\n**Input:**\nTrie insert search startsWith\napple apple app\n**Output:**\nnull null true true",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Design", "Trie"],
        test_cases: JSON.stringify([{ input: "Trie insert search startsWith\napple apple app", expected: "null null true true" }])
      },
      // 12. Sliding Window
      {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string `s`, find the length of the longest substring without repeating characters.\n\n**Input Format:**\n- A single string `s`.\n\n**Output Format:**\n- Return an integer representing the length of the longest substring.\n\n**Constraints:**\n- `0 <= s.length <= 5 * 10^4`\n- `s` consists of English letters, digits, symbols and spaces.\n\n**Example:**\n**Input:**\nabcabcbb\n**Output:**\n3\n**Explanation:** The answer is \"abc\", with the length of 3.",
        difficulty: "Medium",
        tags: ["Hash Table", "String", "Sliding Window"],
        test_cases: JSON.stringify([{ input: "abcabcbb", expected: "3" }, { input: "bbbbb", expected: "1" }])
      },
      // 13. Two Pointers
      {
        title: "Container With Most Water",
        description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\n**Input Format:**\n- A single line of space-separated integers representing the `height` array.\n\n**Output Format:**\n- Return an integer representing the maximum area of water the container can store.\n\n**Constraints:**\n- `n == height.length`\n- `2 <= n <= 10^5`\n- `0 <= height[i] <= 10^4`\n\n**Example:**\n**Input:**\n1 8 6 2 5 4 8 3 7\n**Output:**\n49",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Greedy"],
        test_cases: JSON.stringify([{ input: "1 8 6 2 5 4 8 3 7", expected: "49" }])
      },
      // 14. Math
      {
        title: "Pow(x, n)",
        description: "Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).\n\n**Input Format:**\n- First line contains a float `x`.\n- Second line contains an integer `n`.\n\n**Output Format:**\n- Return a float representing `x^n`.\n\n**Constraints:**\n- `-100.0 < x < 100.0`\n- `-2^31 <= n <= 2^31-1`\n\n**Example:**\n**Input:**\n2.00000\n10\n**Output:**\n1024.00000",
        difficulty: "Medium",
        tags: ["Math", "Recursion"],
        test_cases: JSON.stringify([{ input: "2.00000\n10", expected: "1024.00000" }])
      },
      // 15. Queue
      {
        title: "Design Circular Queue",
        description: "Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle and the last position is connected back to the first position to make a circle. It is also called 'Ring Buffer'.\n\n**Input Format:**\n- First line: operations to execute separated by space.\n- Second line: space-separated arguments for each operation respectively.\n\n**Output Format:**\n- A space-separated list of results (`null` for constructors, `true`/`false` for booleans, values for retrieval).\n\n**Example:**\n**Input:**\nMyCircularQueue enQueue enQueue\n3 1 2\n**Output:**\nnull true true",
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
