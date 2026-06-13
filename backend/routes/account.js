const express = require('express');
const { users } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

// Fields a buyer is allowed to edit via these endpoints
const EDITABLE_PROFILE_FIELDS = [
  'fullName', 'jobTitle', 'phone', 'companyName', 'businessRegNo',
  'tin', 'district', 'address', 'defaultPaymentMethod',
  'bankAccountName', 'bankName', 'bankAccountNumber',
];

const EDITABLE_NOTIFICATION_FIELDS = [
  'notifyOutbid', 'notifyAuctionEnding', 'notifyOrderUpdates',
  'notifyMessages', 'notifyPromotions',
];

// GET /api/account
router.get('/', (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(toPublicUser(user));
});

// PUT /api/account
// body: any subset of EDITABLE_PROFILE_FIELDS
router.put('/', (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  for (const field of EDITABLE_PROFILE_FIELDS) {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  }

  res.json(toPublicUser(user));
});

// PUT /api/account/notifications
// body: any subset of EDITABLE_NOTIFICATION_FIELDS (booleans)
router.put('/notifications', (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  for (const field of EDITABLE_NOTIFICATION_FIELDS) {
    if (req.body[field] !== undefined) {
      user[field] = !!req.body[field];
    }
  }

  res.json(toPublicUser(user));
});

module.exports = router;