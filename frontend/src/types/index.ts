// ─────────────────────────────────────────────────────────────────────────
// KajuMart Buyer Dashboard — shared types
// ─────────────────────────────────────────────────────────────────────────

export type ProcessingType = "Raw" | "Roasted" | "Baked" | "Flavoured";

export type CashewGrade =
  | "W180"
  | "W210"
  | "W240"
  | "W320"
  | "W450"
  | "LWP"
  | "SWP"
  | "Splits";

export type ListingType = "fixed" | "auction";

export type SriLankanDistrict =
  | "Colombo"
  | "Gampaha"
  | "Kalutara"
  | "Kandy"
  | "Matale"
  | "Nuwara Eliya"
  | "Galle"
  | "Matara"
  | "Hambantota"
  | "Jaffna"
  | "Kurunegala"
  | "Puttalam"
  | "Anuradhapura"
  | "Polonnaruwa"
  | "Badulla"
  | "Monaragala"
  | "Ratnapura"
  | "Kegalle"
  | "Trincomalee"
  | "Batticaloa"
  | "Ampara";

export interface Vendor {
  id: string;
  name: string;
  location: SriLankanDistrict;
  rating: number; // 0–5
  totalReviews: number;
  verified: boolean;
  yearsActive: number;
}

export interface Listing {
  id: string;
  title: string;
  processingType: ProcessingType;
  grade: CashewGrade;
  origin: string;
  processingDate: string; // ISO date
  totalVolumeKg: number;
  availablePackWeights: string[]; // e.g. ["25kg", "50kg", "1MT"]
  pricePerMt: number; // LKR
  images: string[];
  vendor: Vendor;
  listingType: ListingType;
  stockAvailable: number; // MT
  // Auction-only fields
  currentHighBidPerMt?: number;
  minIncrementPerMt?: number;
  buyItNowPricePerMt?: number;
  auctionEndsAt?: string; // ISO datetime
  bidCount?: number;
  description: string;
}

export interface CartItem {
  listingId: string;
  quantityMt: number;
  packWeight: string;
}

export type OrderStage =
  | "Order Registered"
  | "Payment Verified in Escrow"
  | "Batch Dispatched"
  | "Completed & Delivered";

export interface OrderItem {
  listingId: string;
  title: string;
  grade: CashewGrade;
  quantityMt: number;
  pricePerMt: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  totalLkr: number;
  stage: OrderStage;
  district: SriLankanDistrict;
  shippingMethod: "Courier" | "Pickup";
  paymentMethod: "Digital" | "COD";
  vendor: string;
}

export type NotificationType =
  | "outbid"
  | "auction-ending"
  | "order-update"
  | "message"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ConversationMessage {
  id: string;
  from: "buyer" | "vendor";
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  vendorName: string;
  vendorVerified: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unread: number;
  relatedLot?: string;
  messages: ConversationMessage[];
}
