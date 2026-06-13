const express = require('express');
const { listings, listingWithVendor, bids, counters } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/listings
// Supports optional query params for filtering (mirrors useFilteredListings on the frontend)
//   ?processingType=Raw,Roasted
//   ?grade=W180,W240
//   ?listingType=auction
//   ?q=search text (matches title)
//   ?minPrice=...&maxPrice=...
router.get('/', (req, res) => {
  let results = listings.map(listingWithVendor);

  const { processingType, grade, listingType, q, minPrice, maxPrice } = req.query;

  if (processingType) {
    const types = processingType.split(',');
    results = results.filter((l) => types.includes(l.processingType));
  }

  if (grade) {
    const grades = grade.split(',');
    results = results.filter((l) => grades.includes(l.grade));
  }

  if (listingType) {
    results = results.filter((l) => l.listingType === listingType);
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter((l) => l.title.toLowerCase().includes(query));
  }

  if (minPrice) {
    results = results.filter((l) => l.pricePerMt >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter((l) => l.pricePerMt <= Number(maxPrice));
  }

  res.json(results);
});

// GET /api/listings/auctions/ending-soon
// Returns live auctions sorted by soonest-closing first
router.get('/auctions/ending-soon', (req, res) => {
  const auctions = listings
    .filter((l) => l.listingType === 'auction')
    .map(listingWithVendor)
    .sort((a, b) => new Date(a.auctionEndsAt) - new Date(b.auctionEndsAt));

  res.json(auctions);
});

// GET /api/listings/:id
router.get('/:id', (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json(listingWithVendor(listing));
});

// POST /api/listings/:id/bid   (protected — place a bid on an auction)
router.post('/:id/bid', requireAuth, (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (listing.listingType !== 'auction') {
    return res.status(400).json({ message: 'This listing is not an auction' });
  }

  const { amountPerMt } = req.body;
  const minNextBid = (listing.currentHighBidPerMt || listing.pricePerMt) + (listing.minIncrementPerMt || 0);

  if (!amountPerMt || amountPerMt < minNextBid) {
    return res.status(400).json({
      message: `Bid must be at least ${minNextBid} per MT`,
      minNextBid,
    });
  }

  // Record the bid
  bids.push({
    id: counters.bidId++,
    listingId: listing.id,
    userId: req.user.id,
    amountPerMt,
    createdAt: new Date().toISOString(),
  });

  // Update the listing's current high bid + bid count
  listing.currentHighBidPerMt = amountPerMt;
  listing.bidCount = (listing.bidCount || 0) + 1;

  res.json(listingWithVendor(listing));
});

module.exports = router;