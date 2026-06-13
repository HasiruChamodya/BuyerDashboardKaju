const express = require('express');
const { conversations, counters } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Helper: derive lastMessage/lastTimestamp from the messages array
function withLastMessage(conversation) {
  const last = conversation.messages[conversation.messages.length - 1];
  return {
    ...conversation,
    lastMessage: last ? last.text : '',
    lastTimestamp: last ? last.timestamp : null,
  };
}

// GET /api/conversations
router.get('/', (req, res) => {
  const userConversations = conversations
    .filter((c) => c.userId === req.user.id)
    .map(withLastMessage)
    .sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp));

  res.json(userConversations);
});

// GET /api/conversations/:id
// Also marks the conversation as read (unread = 0)
router.get('/:id', (req, res) => {
  const conversation = conversations.find(
    (c) => c.id === req.params.id && c.userId === req.user.id
  );
  if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

  conversation.unread = 0;
  res.json(withLastMessage(conversation));
});

// POST /api/conversations/:id/messages
// body: { text }
router.post('/:id/messages', (req, res) => {
  const conversation = conversations.find(
    (c) => c.id === req.params.id && c.userId === req.user.id
  );
  if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'text is required' });
  }

  const message = {
    id: `m${counters.messageId++}`,
    from: 'buyer',
    text: text.trim(),
    timestamp: new Date().toISOString(),
  };

  conversation.messages.push(message);
  res.status(201).json(message);
});

module.exports = router;