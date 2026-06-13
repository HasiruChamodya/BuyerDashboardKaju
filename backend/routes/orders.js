const express = require('express');
const { orders, cartItems, listings, counters } = require('../data/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const SHIPPING_COSTS = { Courier: 18500, Pickup: 0 };
const PROMO_CODES = { KAJU5: 0.05 };

// GET /api/orders
// Optional ?stage=Batch Dispatched to filter
router.get('/', (req, res) => {
  let userOrders = orders.filter((o) => o.userId === req.user.id);

  if (req.query.stage) {
    userOrders = userOrders.filter((o) => o.stage === req.query.stage);
  }

  // newest first
  userOrders = [...userOrders].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(userOrders);
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// POST /api/orders  (checkout)
// body: { district, shippingMethod: "Courier"|"Pickup", paymentMethod: "Digital"|"COD", promoCode? }
router.post('/', (req, res) => {
  const { district, shippingMethod, paymentMethod, promoCode } = req.body;

  if (!district || !shippingMethod || !paymentMethod) {
    return res.status(400).json({ message: 'district, shippingMethod, and paymentMethod are required' });
  }
  if (!SHIPPING_COSTS.hasOwnProperty(shippingMethod)) {
    return res.status(400).json({ message: 'Invalid shippingMethod' });
  }
  if (!['Digital', 'COD'].includes(paymentMethod)) {
    return res.status(400).json({ message: 'Invalid paymentMethod' });
  }

  const userCart = cartItems.filter((c) => c.userId === req.user.id);
  if (userCart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // Build order items from cart + current listing data
  const items = [];
  let subtotal = 0;
  let vendorName = null;

  for (const c of userCart) {
    const listing = listings.find((l) => l.id === c.listingId);
    if (!listing) continue;

    const pricePerMt =
      listing.listingType === 'auction' && listing.currentHighBidPerMt
        ? listing.currentHighBidPerMt
        : listing.pricePerMt;

    items.push({
      listingId: listing.id,
      title: listing.title,
      grade: listing.grade,
      quantityMt: c.quantityMt,
      pricePerMt,
    });

    subtotal += pricePerMt * c.quantityMt;

    // Use the vendor of the first item for the order's "vendor" display field
    if (!vendorName) {
      const { vendors } = require('../data/store');
      const vendor = vendors.find((v) => v.id === listing.vendorId);
      vendorName = vendor ? vendor.name : 'KajuMart Vendor';
    }
  }

  // Apply promo code discount
  let discount = 0;
  if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
    discount = subtotal * PROMO_CODES[promoCode.toUpperCase()];
  }

  const shippingCost = SHIPPING_COSTS[shippingMethod];
  const totalLkr = Math.round(subtotal - discount + shippingCost);

  const newOrder = {
    id: `ORD-${counters.orderNum++}`,
    userId: req.user.id,
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    items,
    totalLkr,
    stage: 'Order Registered',
    district,
    shippingMethod,
    paymentMethod,
    vendor: vendorName,
  };

  orders.push(newOrder);

  // Clear the user's cart
  for (let i = cartItems.length - 1; i >= 0; i--) {
    if (cartItems[i].userId === req.user.id) cartItems.splice(i, 1);
  }

  res.status(201).json(newOrder);
});

module.exports = router;