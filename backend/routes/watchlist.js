const express = require('express');
const { watchlistItems, listings, listingWithVendor } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/watchlist
// Returns full listing objects for everything the user is watching
router.get('/', (req, res) => {
  const watchedIds = watchlistItems
    .filter((w) => w.userId === req.user.id)
    .map((w) => w.listingId);

  const watchedListings = listings
    .filter((l) => watchedIds.includes(l.id))
    .map(listingWithVendor);

  res.json(watchedListings);
});

// POST /api/watchlist/:listingId
router.post('/:listingId', (req, res) => {
  const listing = listings.find((l) => l.id === req.params.listingId);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  const already = watchlistItems.find(
    (w) => w.userId === req.user.id && w.listingId === req.params.listingId
  );
  if (!already) {
    watchlistItems.push({ userId: req.user.id, listingId: req.params.listingId });
  }

  res.status(201).json({ message: 'Added to watchlist' });
});

// DELETE /api/watchlist/:listingId
router.delete('/:listingId', (req, res) => {
  const index = watchlistItems.findIndex(
    (w) => w.userId === req.user.id && w.listingId === req.params.listingId
  );
  if (index === -1) return res.status(404).json({ message: 'Item not in watchlist' });

  watchlistItems.splice(index, 1);
  res.json({ message: 'Removed from watchlist' });
});

module.exports = router;