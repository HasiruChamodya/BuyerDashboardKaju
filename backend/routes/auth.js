const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users, counters } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Strip sensitive fields before sending a user object to the client
function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { fullName, email, password, companyName } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'fullName, email, and password are required' });
  }

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: counters.userId++,
    fullName,
    email,
    passwordHash,
    jobTitle: '',
    phone: '',
    companyName: companyName || '',
    businessRegNo: '',
    tin: '',
    district: '',
    address: '',
    defaultPaymentMethod: 'Digital',
    bankAccountName: '',
    bankName: '',
    bankAccountNumber: '',
    notifyOutbid: true,
    notifyAuctionEnding: true,
    notifyOrderUpdates: true,
    notifyMessages: true,
    notifyPromotions: false,
  };

  users.push(newUser);

  const token = signToken(newUser);
  res.status(201).json({ token, user: toPublicUser(newUser) });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
});

// GET /api/auth/me  (protected — returns the logged-in user's profile)
router.get('/me', requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(toPublicUser(user));
});

module.exports = router;