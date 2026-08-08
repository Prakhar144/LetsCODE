import express from 'express';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import { authenticate, requireAdmin } from './auth.js';

const router = express.Router();

// Get all users with analytics
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'username is_admin is_blocked');

    const userStats = await Promise.all(users.map(async (user) => {
      const submissions = await Submission.find({ user_id: user._id });
      
      const totalAttempts = submissions.length;
      const totalCorrect = submissions.filter(s => s.status === 'Accepted').length;
      
      // Calculate unique solved problems
      const solvedProblems = new Set(
        submissions.filter(s => s.status === 'Accepted').map(s => s.problem_id.toString())
      );
      const uniqueSolved = solvedProblems.size;

      return {
        id: user._id,
        username: user.username,
        is_admin: user.is_admin,
        is_blocked: user.is_blocked,
        totalAttempts,
        totalCorrect,
        uniqueSolved
      };
    }));

    res.json(userStats);
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// Toggle user block status
router.post('/users/:user_id/toggle-block', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }
    
    // Prevent blocking other admins
    if (user.is_admin) {
      return res.status(403).json({ detail: 'Cannot block an administrator' });
    }
    
    user.is_blocked = !user.is_blocked;
    await user.save();
    
    res.json({ message: 'User block status toggled', is_blocked: user.is_blocked });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// Create a problem
router.post('/problems', authenticate, requireAdmin, async (req, res) => {
  const { title, description, difficulty, test_cases } = req.body;
  try {
    const newProblem = await Problem.create({ title, description, difficulty, test_cases });
    res.json(newProblem);
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

// Delete a problem
router.delete('/problems/:problem_id', authenticate, requireAdmin, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problem_id);
    if (!problem) {
      return res.status(404).json({ detail: 'Problem not found' });
    }
    await problem.deleteOne();
    res.json({ message: 'Problem deleted' });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

export default router;
