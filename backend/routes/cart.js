const express = require('express');
const { cartItems, listings, listingWithVendor } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth); // every route below requires login

// Helper: get the effective price per MT for a listing
// (auction lots use the current high bid if higher than the list price)
function effectivePricePerMt(listing) {
  if (listing.listingType === 'auction' && listing.currentHighBidPerMt) {
    return listing.currentHighBidPerMt;
  }
  return listing.pricePerMt;
}

// GET /api/cart
// Returns cart rows joined with listing details + computed totals
router.get('/', (req, res) => {
  const rows = cartItems
    .filter((c) => c.userId === req.user.id)
    .map((c) => {
      const listing = listings.find((l) => l.id === c.listingId);
      if (!listing) return null;

      const pricePerMt = effectivePricePerMt(listing);
      const lineTotal = pricePerMt * c.quantityMt;

      return {
        listingId: c.listingId,
        quantityMt: c.quantityMt,
        packWeight: c.packWeight,
        listing: listingWithVendor(listing),
        pricePerMt,
        lineTotal,
      };
    })
    .filter(Boolean);

  const cartTotal = rows.reduce((sum, r) => sum + r.lineTotal, 0);

  res.json({ items: rows, cartTotal, cartCount: rows.length });
});

// POST /api/cart
// body: { listingId, quantityMt, packWeight }
router.post('/', (req, res) => {
  const { listingId, quantityMt, packWeight } = req.body;

  if (!listingId || !quantityMt) {
    return res.status(400).json({ message: 'listingId and quantityMt are required' });
  }

  const listing = listings.find((l) => l.id === listingId);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  const existing = cartItems.find((c) => c.userId === req.user.id && c.listingId === listingId);

  if (existing) {
    existing.quantityMt = quantityMt;
    if (packWeight) existing.packWeight = packWeight;
  } else {
    cartItems.push({
      userId: req.user.id,
      listingId,
      quantityMt,
      packWeight: packWeight || listing.availablePackWeights?.[0] || null,
    });
  }

  res.status(201).json({ message: 'Added to cart' });
});

// PUT /api/cart/:listingId
// body: { quantityMt, packWeight }
router.put('/:listingId', (req, res) => {
  const item = cartItems.find((c) => c.userId === req.user.id && c.listingId === req.params.listingId);
  if (!item) return res.status(404).json({ message: 'Item not in cart' });

  const { quantityMt, packWeight } = req.body;
  if (quantityMt !== undefined) item.quantityMt = quantityMt;
  if (packWeight !== undefined) item.packWeight = packWeight;

  res.json({ message: 'Cart updated' });
});

// DELETE /api/cart/:listingId
router.delete('/:listingId', (req, res) => {
  const index = cartItems.findIndex((c) => c.userId === req.user.id && c.listingId === req.params.listingId);
  if (index === -1) return res.status(404).json({ message: 'Item not in cart' });

  cartItems.splice(index, 1);
  res.json({ message: 'Removed from cart' });
});

// DELETE /api/cart  (clear entire cart — used after checkout)
router.delete('/', (req, res) => {
  for (let i = cartItems.length - 1; i >= 0; i--) {
    if (cartItems[i].userId === req.user.id) cartItems.splice(i, 1);
  }
  res.json({ message: 'Cart cleared' });
});

module.exports = router;