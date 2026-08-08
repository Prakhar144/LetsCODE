import express from 'express';
import FeedPost from '../models/FeedPost.js';
import Submission from '../models/Submission.js';
import { authenticate } from './auth.js';

const router = express.Router();

// Get mixed feed
router.get('/', async (req, res) => {
  try {
    const posts = await FeedPost.find().sort({ createdAt: -1 }).limit(20);
    const submissions = await Submission.find({ status: 'Accepted' })
      .sort({ created_at: -1 })
      .limit(20)
      .populate('problem_id', 'title difficulty')
      .populate('user_id', 'username email');
      
    // Normalize posts
    const normalizedPosts = posts.map(p => ({
      type: 'post',
      id: p._id,
      author: p.author,
      content: p.content,
      image_url: p.image_url,
      likes: p.likes,
      timestamp: p.createdAt
    }));
    
    // Normalize submissions
    const normalizedSubmissions = submissions.map(s => {
      let author = 'User';
      if (s.user_id) {
         author = s.user_id.username || (s.user_id.email ? s.user_id.email.split('@')[0] : 'User');
      } else if (typeof s.user_id === 'string') {
         author = s.user_id;
      }
      return {
        type: 'submission',
        id: s._id,
        author: author,
        problem: s.problem_id,
        score: s.score,
        timestamp: s.created_at
      }
    });
    
    const feed = [...normalizedPosts, ...normalizedSubmissions]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 30);
    
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create post
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, image_url } = req.body;
    const author = req.user.username || (req.user.email ? req.user.email.split('@')[0] : 'User');
    
    const post = new FeedPost({
      author,
      content,
      image_url: image_url || ''
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
