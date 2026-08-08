import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey_for_codeforge';
const EXPIRES_IN = '1h';

// Middleware to protect routes
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ username: payload.sub });
    if (!user) throw new Error();
    if (user.is_blocked) {
      return res.status(403).json({ detail: 'Your account has been blocked' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Could not validate credentials' });
  }
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ detail: 'Not enough privileges' });
  }
  next();
};

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ detail: 'Username already registered' });
      } else {
        return res.status(400).json({ detail: 'Email already registered' });
      }
    }

    const userCount = await User.countDocuments();
    const is_admin = userCount === 0;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await User.create({ username, email, password_hash, is_admin });
    res.json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  // We need to parse URL-encoded data because FastAPI's OAuth2PasswordRequestForm expects application/x-www-form-urlencoded
  // But wait, the frontend sends a FormData object, which is parsed by multer or express.urlencoded
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }] 
    });
    if (!user) {
      return res.status(401).json({ detail: 'Incorrect username or password' });
    }
    if (user.is_blocked) {
      return res.status(403).json({ detail: 'Your account has been blocked' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ detail: 'Incorrect username or password' });
    }

    const payload = { sub: user.username, is_admin: user.is_admin, streak: user.streak || 0 };
    const access_token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });

    res.json({ access_token, token_type: 'bearer', streak: user.streak || 0 });
  } catch (error) {
    res.status(500).json({ detail: 'Server error' });
  }
});

export default router;
