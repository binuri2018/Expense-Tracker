const express = require('express');
const bcrypt = require('bcryptjs');
const { getQuery, runQuery } = require('../database/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        error: 'Please provide a valid email address'
      });
    }

    // Check if user already exists
    const existingUser = await getQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await runQuery(
      'INSERT INTO users (username, email, passwordHash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    // Generate JWT token
    const token = generateToken(result.id, email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: result.id,
        username,
        email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration'
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await getQuery(
      'SELECT id, username, email, passwordHash FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error during login'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    // This route should be protected by auth middleware
    // For now, we'll check if user ID is provided in query params
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }

    const user = await getQuery(
      'SELECT id, username, email, createdAt FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching profile'
    });
  }
});

module.exports = router;
