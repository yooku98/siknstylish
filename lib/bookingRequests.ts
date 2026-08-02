import { Timestamp } from "firebase/firestore";

export const bookingRequestStatuses = [
  "new",
  "contacted",
  "converted",
  "archived",
] as const;

export type BookingRequestStatus = (typeof bookingRequestStatuses)[number];

export const bookingRequestStatusLabels: Record<BookingRequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted to Order",
  archived: "Archived",
};

export type BookingRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  garmentCategory: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  status: BookingRequestStatus;
  createdAt: Timestamp | null;
};
