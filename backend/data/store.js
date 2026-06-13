const bcrypt = require('bcryptjs');

// ───────────────────────────────────────────────
// VENDORS
// ───────────────────────────────────────────────
const vendors = [
  { id: "v1", name: "Anuradhapura Cashew Estate", location: "Anuradhapura", rating: 4.8, totalReviews: 142, verified: true, yearsActive: 12 },
  { id: "v2", name: "Puttalam Coastal Processors", location: "Puttalam", rating: 4.6, totalReviews: 98, verified: true, yearsActive: 8 },
  { id: "v3", name: "Monaragala Hill Country Nuts", location: "Monaragala", rating: 4.3, totalReviews: 54, verified: false, yearsActive: 4 },
  { id: "v4", name: "Vavuniya AgroExports", location: "Ampara", rating: 4.9, totalReviews: 211, verified: true, yearsActive: 15 },
];

// ───────────────────────────────────────────────
// LISTINGS  (vendorId references vendors[] above —
// same pattern as the FK in the listings table)
// ───────────────────────────────────────────────
const listings = [
  {
    id: "L-1001", title: "Premium W180 Whole Cashews — Grade A", processingType: "Raw", grade: "W180",
    origin: "Anuradhapura, Sri Lanka", processingDate: "2026-05-28", totalVolumeKg: 8000,
    availablePackWeights: ["25kg", "50kg", "1MT"], pricePerMt: 1480000,
    images: ["cashew-raw-1", "cashew-raw-2", "cashew-raw-3"], vendorId: "v1",
    listingType: "fixed", stockAvailable: 8,
    description: "Sun-dried W180 grade whole cashews sourced directly from estate-grown trees in the Anuradhapura district. Low moisture content (under 5%), minimal breakage, and consistent kernel size throughout the batch. Suitable for premium retail repacking or export-grade roasting.",
  },
  {
    id: "L-1002", title: "Salted Roasted Cashews — W240 Bulk Lot", processingType: "Roasted", grade: "W240",
    origin: "Puttalam, Sri Lanka", processingDate: "2026-06-02", totalVolumeKg: 5000,
    availablePackWeights: ["10kg", "25kg", "50kg"], pricePerMt: 1620000,
    images: ["cashew-roasted-1", "cashew-roasted-2"], vendorId: "v2",
    listingType: "auction", stockAvailable: 5,
    currentHighBidPerMt: 1655000, minIncrementPerMt: 5000, buyItNowPricePerMt: 1750000,
    auctionEndsAt: new Date(Date.now() + 1000 * 60 * 47).toISOString(), bidCount: 14,
    description: "Lightly salted, roasted W240 cashews finished in small batches for an even golden colour. Packed in food-grade vacuum pouches. Ideal for snack distributors and gifting brands looking for a ready-to-shelf product.",
  },
  {
    id: "L-1003", title: "Honey Baked Flavoured Cashews — Festive Pack", processingType: "Flavoured", grade: "W320",
    origin: "Monaragala, Sri Lanka", processingDate: "2026-06-05", totalVolumeKg: 2200,
    availablePackWeights: ["5kg", "10kg", "25kg"], pricePerMt: 1390000,
    images: ["cashew-honey-1", "cashew-honey-2"], vendorId: "v3",
    listingType: "auction", stockAvailable: 2.2,
    currentHighBidPerMt: 1410000, minIncrementPerMt: 2500,
    auctionEndsAt: new Date(Date.now() + 1000 * 60 * 4).toISOString(), bidCount: 6,
    description: "Oven-baked W320 cashews finished with a thin honey glaze, popular for the festive gifting season. Sealed in resealable kraft pouches with a 9-month shelf life. Small-batch lot — limited stock remaining.",
  },
  {
    id: "L-1004", title: "Organic Raw Cashew Nuts — W320 Export Grade", processingType: "Raw", grade: "W320",
    origin: "Ampara, Sri Lanka", processingDate: "2026-05-20", totalVolumeKg: 12000,
    availablePackWeights: ["50kg", "1MT"], pricePerMt: 1350000,
    images: ["cashew-organic-1", "cashew-organic-2", "cashew-organic-3"], vendorId: "v4",
    listingType: "fixed", stockAvailable: 12,
    description: "Certified organic W320 raw cashew nuts grown without synthetic pesticides across Ampara estates. Each batch is lab-tested for aflatoxin levels and moisture before dispatch. Bulk export documentation available on request.",
  },
  {
    id: "L-1005", title: "Roasted & Baked Mix — LWP Grade", processingType: "Baked", grade: "LWP",
    origin: "Anuradhapura, Sri Lanka", processingDate: "2026-06-01", totalVolumeKg: 3000,
    availablePackWeights: ["10kg", "25kg"], pricePerMt: 980000,
    images: ["cashew-lwp-1", "cashew-lwp-2"], vendorId: "v1",
    listingType: "fixed", stockAvailable: 3,
    description: "Large White Pieces (LWP) grade, oven-baked for confectionery and bakery use. Cost-effective for bulk recipe ingredients without compromising on flavour. Packed in moisture-resistant liners.",
  },
  {
    id: "L-1006", title: "Chili-Lime Flavoured Cashew Splits", processingType: "Flavoured", grade: "Splits",
    origin: "Puttalam, Sri Lanka", processingDate: "2026-06-04", totalVolumeKg: 1800,
    availablePackWeights: ["5kg", "10kg"], pricePerMt: 1120000,
    images: ["cashew-chililime-1"], vendorId: "v2",
    listingType: "auction", stockAvailable: 1.8,
    currentHighBidPerMt: 1135000, minIncrementPerMt: 2000, buyItNowPricePerMt: 1200000,
    auctionEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(), bidCount: 3,
    description: "A spicy-tangy take on cashew splits, coated lightly in chili and lime seasoning. Popular with bars and craft snack brands looking for a distinctive flavour profile.",
  },
  {
    id: "L-1007", title: "Standard Raw W450 Cashew Nuts", processingType: "Raw", grade: "W450",
    origin: "Ampara, Sri Lanka", processingDate: "2026-05-15", totalVolumeKg: 15000,
    availablePackWeights: ["50kg", "1MT"], pricePerMt: 1180000,
    images: ["cashew-w450-1", "cashew-w450-2"], vendorId: "v4",
    listingType: "fixed", stockAvailable: 15,
    description: "Larger W450 grade raw cashews, well suited for bulk reprocessing or wholesale redistribution. Competitive pricing on volume orders above 5MT — message the vendor for tiered rates.",
  },
  {
    id: "L-1008", title: "Premium SWP Roasted Cashew Pieces", processingType: "Roasted", grade: "SWP",
    origin: "Anuradhapura, Sri Lanka", processingDate: "2026-05-30", totalVolumeKg: 4000,
    availablePackWeights: ["10kg", "25kg", "50kg"], pricePerMt: 1050000,
    images: ["cashew-swp-1"], vendorId: "v1",
    listingType: "auction", stockAvailable: 4,
    currentHighBidPerMt: 1062000, minIncrementPerMt: 3000,
    auctionEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(), bidCount: 9,
    description: "Small White Pieces (SWP), roasted to a deep golden brown with a strong nutty aroma. Common choice for snack mixes and bakery toppings at scale.",
  },
];

// ───────────────────────────────────────────────
// DISTRICTS
// ───────────────────────────────────────────────
const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara",
  "Hambantota", "Jaffna", "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle", "Trincomalee", "Batticaloa", "Ampara",
];

// ───────────────────────────────────────────────
// USERS  (this is the `users` table)
// Demo login: demo@kajumart.lk / password123
// ───────────────────────────────────────────────
const users = [
  {
    id: 1,
    fullName: "Nadeesha Kumara",
    email: "demo@kajumart.lk",
    passwordHash: bcrypt.hashSync("password123", 10),
    jobTitle: "Procurement Manager",
    phone: "+94 77 123 4567",
    companyName: "Lanka Fresh Foods (Pvt) Ltd",
    businessRegNo: "PV 00214567",
    tin: "134567890",
    district: "Colombo",
    address: "No. 45, Industrial Zone Road, Colombo 14, Sri Lanka",
    defaultPaymentMethod: "Digital",
    bankAccountName: "Lanka Fresh Foods (Pvt) Ltd",
    bankName: "Commercial Bank of Ceylon",
    bankAccountNumber: "8001234567",
    notifyOutbid: true,
    notifyAuctionEnding: true,
    notifyOrderUpdates: true,
    notifyMessages: true,
    notifyPromotions: false,
  },
];

// ───────────────────────────────────────────────
// CART ITEMS  (this is the `cart_items` table)
// ───────────────────────────────────────────────
const cartItems = [
  { userId: 1, listingId: "L-1001", quantityMt: 1, packWeight: "1MT" },
  { userId: 1, listingId: "L-1004", quantityMt: 2, packWeight: "1MT" },
];

// ───────────────────────────────────────────────
// WATCHLIST  (this is the `watchlist` table)
// ───────────────────────────────────────────────
const watchlistItems = [
  { userId: 1, listingId: "L-1002" },
  { userId: 1, listingId: "L-1003" },
];

// ───────────────────────────────────────────────
// ORDERS + ORDER ITEMS  (`orders` + `order_items` tables,
// nested here for convenience)
// ───────────────────────────────────────────────
const orders = [
  {
    id: "ORD-20453", userId: 1, date: "2026-06-10",
    items: [
      { listingId: "L-1004", title: "Organic Raw Cashew Nuts — W320 Export Grade", grade: "W320", quantityMt: 2, pricePerMt: 1350000 },
    ],
    totalLkr: 2700000, stage: "Batch Dispatched", district: "Colombo",
    shippingMethod: "Courier", paymentMethod: "Digital", vendor: "Vavuniya AgroExports",
  },
  {
    id: "ORD-20410", userId: 1, date: "2026-06-05",
    items: [
      { listingId: "L-1001", title: "Premium W180 Whole Cashews — Grade A", grade: "W180", quantityMt: 1, pricePerMt: 1480000 },
      { listingId: "L-1005", title: "Roasted & Baked Mix — LWP Grade", grade: "LWP", quantityMt: 0.5, pricePerMt: 980000 },
    ],
    totalLkr: 1970000, stage: "Payment Verified in Escrow", district: "Gampaha",
    shippingMethod: "Pickup", paymentMethod: "COD", vendor: "Anuradhapura Cashew Estate",
  },
  {
    id: "ORD-20355", userId: 1, date: "2026-05-22",
    items: [
      { listingId: "L-1007", title: "Standard Raw W450 Cashew Nuts", grade: "W450", quantityMt: 5, pricePerMt: 1180000 },
    ],
    totalLkr: 5900000, stage: "Completed & Delivered", district: "Kurunegala",
    shippingMethod: "Courier", paymentMethod: "Digital", vendor: "Vavuniya AgroExports",
  },
  {
    id: "ORD-20298", userId: 1, date: "2026-05-10",
    items: [
      { listingId: "L-1002", title: "Salted Roasted Cashews — W240 Bulk Lot", grade: "W240", quantityMt: 1, pricePerMt: 1600000 },
    ],
    totalLkr: 1600000, stage: "Completed & Delivered", district: "Colombo",
    shippingMethod: "Courier", paymentMethod: "Digital", vendor: "Puttalam Coastal Processors",
  },
];

// ───────────────────────────────────────────────
// NOTIFICATIONS  (`notifications` table)
// ───────────────────────────────────────────────
const notifications = [
  {
    id: "n1", userId: 1, type: "outbid", title: "You've been outbid",
    message: "Your bid on Honey Baked Flavoured Cashews — Festive Pack (LOT L-1003) was just exceeded. Current high bid: LKR 1,410,000 / MT.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), read: false,
  },
  {
    id: "n2", userId: 1, type: "auction-ending", title: "Auction ending soon",
    message: "Salted Roasted Cashews — W240 Bulk Lot (LOT L-1002) closes in under 1 hour.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: false,
  },
  {
    id: "n3", userId: 1, type: "order-update", title: "Order dispatched",
    message: "ORD-20453 has been dispatched by Vavuniya AgroExports and is on its way to Colombo.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), read: false,
  },
  {
    id: "n4", userId: 1, type: "message", title: "New message from Anuradhapura Cashew Estate",
    message: "\"We can offer a discount on the W180 lot for orders above 3MT — let us know if you'd like a revised quote.\"",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), read: true,
  },
  {
    id: "n5", userId: 1, type: "system", title: "Escrow payment verified",
    message: "Your payment for ORD-20410 has been verified and placed in escrow pending dispatch.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true,
  },
];

// ───────────────────────────────────────────────
// CONVERSATIONS + MESSAGES (`conversations` + `messages` tables,
// nested here for convenience)
// ───────────────────────────────────────────────
const conversations = [
  {
    id: "c1", userId: 1, vendorName: "Anuradhapura Cashew Estate", vendorVerified: true,
    relatedLot: "L-1001",
    messages: [
      { id: "m1", from: "buyer", text: "Hi, is the W180 lot still available in 1MT packs?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
      { id: "m2", from: "vendor", text: "Yes, we currently have 8MT available in 1MT packs.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString() },
      { id: "m3", from: "vendor", text: "We can offer a discount on the W180 lot for orders above 3MT — let us know if you'd like a revised quote.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
    ],
  },
  {
    id: "c2", userId: 1, vendorName: "Puttalam Coastal Processors", vendorVerified: true,
    relatedLot: "L-1002",
    messages: [
      { id: "m4", from: "buyer", text: "If I win the W240 auction, when can this ship to Colombo?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 31).toISOString() },
      { id: "m5", from: "vendor", text: "Sure, the dispatch will go out by Thursday.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
    ],
  },
  {
    id: "c3", userId: 1, vendorName: "Vavuniya AgroExports", vendorVerified: true,
    relatedLot: "L-1004",
    messages: [
      { id: "m6", from: "vendor", text: "Thank you for the order — escrow confirmed on our end too.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
    ],
  },
];

// ───────────────────────────────────────────────
// BIDS  (`bids` table) — starts empty
// ───────────────────────────────────────────────
const bids = [];

// ───────────────────────────────────────────────
// ID counters — mutate properties on this object
// (e.g. counters.userId++) so the increments are
// visible to every file that imports `counters`
// ───────────────────────────────────────────────
const counters = {
  userId: 2,
  orderNum: 20454,
  notificationId: 6,
  messageId: 7,
  bidId: 1,
};

// ───────────────────────────────────────────────
// Helper: attach vendor object to a listing
// (stand-in for a SQL JOIN)
// ───────────────────────────────────────────────
function getVendorById(id) {
  return vendors.find((v) => v.id === id);
}

function listingWithVendor(listing) {
  const { vendorId, ...rest } = listing;
  return { ...rest, vendor: getVendorById(vendorId) };
}

module.exports = {
  vendors,
  listings,
  districts,
  users,
  cartItems,
  watchlistItems,
  orders,
  notifications,
  conversations,
  bids,
  counters,
  getVendorById,
  listingWithVendor,
};