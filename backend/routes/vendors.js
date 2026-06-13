const express = require('express');
const { vendors, listings, listingWithVendor } = require('../data/store');

const router = express.Router();

// GET /api/vendors
router.get('/', (req, res) => {
  res.json(vendors);
});

// GET /api/vendors/:id
router.get('/:id', (req, res) => {
  const vendor = vendors.find((v) => v.id === req.params.id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
  res.json(vendor);
});

// GET /api/vendors/:id/listings
router.get('/:id/listings', (req, res) => {
  const vendor = vendors.find((v) => v.id === req.params.id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

  const vendorListings = listings
    .filter((l) => l.vendorId === req.params.id)
    .map(listingWithVendor);

  res.json(vendorListings);
});

module.exports = router;