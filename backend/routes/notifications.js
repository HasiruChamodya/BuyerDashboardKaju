const express = require('express');
const { notifications } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/notifications
// Optional ?type=outbid to filter
router.get('/', (req, res) => {
  let userNotifications = notifications.filter((n) => n.userId === req.user.id);

  if (req.query.type) {
    userNotifications = userNotifications.filter((n) => n.type === req.query.type);
  }

  // newest first
  userNotifications = [...userNotifications].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const unreadCount = notifications.filter((n) => n.userId === req.user.id && !n.read).length;

  res.json({ notifications: userNotifications, unreadCount });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  const notification = notifications.find(
    (n) => n.id === req.params.id && n.userId === req.user.id
  );
  if (!notification) return res.status(404).json({ message: 'Notification not found' });

  notification.read = true;
  res.json(notification);
});

// PATCH /api/notifications/read-all
router.patch('/read-all', (req, res) => {
  notifications
    .filter((n) => n.userId === req.user.id)
    .forEach((n) => (n.read = true));

  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;