import express from 'express';
import Post from '../models/Post.js';
import Reply from '../models/Reply.js';
import { authenticate } from './auth.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Use token username as author
    const username = req.user.username;
    
    const post = new Post({
      title,
      content,
      tags: tags || [],
      author: username
    });
    
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upvote a post
router.post('/:id/upvote', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.votes += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get replies for a post
router.get('/:id/replies', async (req, res) => {
  try {
    const replies = await Reply.find({ post_id: req.params.id }).sort({ createdAt: 1 });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a reply
router.post('/:id/reply', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    const author = req.user.username || (req.user.email ? req.user.email.split('@')[0] : 'User');
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const reply = new Reply({
      post_id: post._id,
      author,
      content
    });
    
    await reply.save();
    
    // Update reply count on post
    post.replies = (post.replies || 0) + 1;
    await post.save();
    
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
