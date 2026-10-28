import { Timestamp } from "firebase/firestore";

export const orderStatuses = [
  "consultation",
  "measuring",
  "cutting",
  "sewing",
  "fitting",
  "finishing",
  "ready",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export const orderStatusLabels: Record<OrderStatus, string> = {
  consultation: "Consultation",
  measuring: "Measuring",
  cutting: "Cutting",
  sewing: "Sewing",
  fitting: "Fitting",
  finishing: "Finishing",
  ready: "Ready for Pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export type StoredImage = {
  url: string;
  storagePath: string;
};

export type Order = {
  id: string;
  // null until a portal account with a matching, verified email claims it --
  // see AuthForm/PortalApp's auto-claim logic.
  clientId: string | null;
  clientEmail: string;
  // Optional: orders created before these fields existed don't have them.
  clientName?: string;
  clientPhone?: string;
  collectionSlug: string;
  status: OrderStatus;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  staffNotes: string;
  sketches: StoredImage[];
  sketchApproved: boolean;
  fabricApproved: boolean;
  inspirationNotes: string;
  inspirationPhotos: StoredImage[];
  // Set alongside every depositPaid change; the rules require a matching
  // payments entry to exist, so the deposit can't move without a log line.
  lastPaymentId?: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export const paymentMethods = ["cash", "momo", "bank", "paystack", "other"] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  momo: "Mobile Money",
  bank: "Bank Transfer",
  paystack: "Online (Paystack)",
  other: "Other",
};

// orders/{orderId}/payments/{paymentId}. Append-only: a mistake is fixed with
// a negative correction entry, never an edit or delete.
export type Payment = {
  id: string;
  amount: number;
  method: PaymentMethod;
  note: string;
  source: "manual" | "paystack";
  paidAt: Timestamp | null;
  recordedByEmail?: string;
  processedAt: Timestamp | null;
};
