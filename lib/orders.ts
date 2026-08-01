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
};

export type Order = {
  id: string;
  clientId: string;
  clientEmail: string;
  collectionSlug: string;
  status: OrderStatus;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  staffNotes: string;
  sketchApproved: boolean;
  fabricApproved: boolean;
  inspirationNotes: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};
