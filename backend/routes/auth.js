import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey_for_codeforge';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

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

    const is_admin = false;

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

    if (!user.password_hash) {
      return res.status(401).json({ detail: 'This account uses a social login provider. Please sign in with Google or GitHub.' });
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

// GitHub OAuth
router.get('/github', (req, res) => {
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_uri = `http://localhost:8000/auth/github/callback`;
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`);
});

router.get('/github/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return res.status(400).send('Failed to get access token');

    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const githubUser = await userRes.json();

    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const emails = await emailRes.json();
    const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email;

    if (!primaryEmail) return res.status(400).send('No email found');

    let user = await User.findOne({ $or: [{ githubId: githubUser.id.toString() }, { email: primaryEmail }] });

    if (!user) {
      user = await User.create({
        username: githubUser.login + '_' + Date.now().toString().slice(-4),
        email: primaryEmail,
        githubId: githubUser.id.toString(),
        is_admin: false
      });
    } else if (!user.githubId) {
      user.githubId = githubUser.id.toString();
      await user.save();
    }

    const payload = { sub: user.username, is_admin: user.is_admin, streak: user.streak || 0 };
    const jwt_token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?token=${jwt_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('OAuth Error');
  }
});

// Google OAuth
router.get('/google', (req, res) => {
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const redirect_uri = `http://localhost:8000/auth/google/callback`;
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=email profile`);
});

router.get('/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `http://localhost:8000/auth/google/callback`
      })
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return res.status(400).send('Failed to get access token');

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const googleUser = await userRes.json();
    const primaryEmail = googleUser.email;

    let user = await User.findOne({ $or: [{ googleId: googleUser.id }, { email: primaryEmail }] });

    if (!user) {
      user = await User.create({
        username: googleUser.name.replace(/\s+/g, '') + '_' + Date.now().toString().slice(-4),
        email: primaryEmail,
        googleId: googleUser.id,
        is_admin: false
      });
    } else if (!user.googleId) {
      user.googleId = googleUser.id;
      await user.save();
    }

    const payload = { sub: user.username, is_admin: user.is_admin, streak: user.streak || 0 };
    const jwt_token = jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?token=${jwt_token}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('OAuth Error');
  }
});

export default router;
