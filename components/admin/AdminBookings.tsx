"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { collections } from "@/lib/collections";
import {
  BookingRequest,
  BookingRequestStatus,
  bookingRequestStatuses,
  bookingRequestStatusLabels,
} from "@/lib/bookingRequests";

const inputClasses =
  "border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold";

function BookingRow({
  request,
  onCreateOrder,
}: {
  request: BookingRequest;
  onCreateOrder: (params: { email: string; collectionSlug: string }) => void;
}) {
  const [status, setStatus] = useState<BookingRequestStatus>(request.status);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (next: BookingRequestStatus) => {
    setStatus(next);
    setSaving(true);
    try {
      await updateDoc(doc(db, "bookingRequests", request.id), { status: next });
    } finally {
      setSaving(false);
    }
  };

  const matchedCollection = collections.find(
    (c) => c.name === request.garmentCategory,
  );

  return (
    <div className="border border-ink/10 p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-ink font-medium">{request.name}</p>
          <p className="text-ink/60 text-sm">
            {request.email} · {request.phone}
          </p>
        </div>
        <select
          value={status}
          disabled={saving}
          onChange={(e) => handleStatusChange(e.target.value as BookingRequestStatus)}
          className={`${inputClasses} w-auto`}
        >
          {bookingRequestStatuses.map((s) => (
            <option key={s} value={s}>
              {bookingRequestStatusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-xs text-ink/50 uppercase tracking-wide">Garment</p>
          <p className="text-ink/80">{request.garmentCategory}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50 uppercase tracking-wide">Consultation</p>
          <p className="text-ink/80">{request.consultationType}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50 uppercase tracking-wide">Preferred Date</p>
          <p className="text-ink/80">{request.preferredDate}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50 uppercase tracking-wide">Preferred Time</p>
          <p className="text-ink/80">{request.preferredTime}</p>
        </div>
      </div>

      {request.notes && (
        <p className="text-sm text-ink/70 bg-ink/5 p-3">{request.notes}</p>
      )}

      <button
        type="button"
        onClick={() =>
          onCreateOrder({
            email: request.email,
            collectionSlug: matchedCollection?.slug ?? "",
          })
        }
        className="self-start inline-flex items-center justify-center px-6 py-2.5 text-xs tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors"
      >
        Create Order From This
      </button>
    </div>
  );
}

export default function AdminBookings({
  onCreateOrder,
}: {
  onCreateOrder: (params: { email: string; collectionSlug: string }) => void;
}) {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "bookingRequests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setRequests(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BookingRequest),
        );
        setLoading(false);
      },
      () => {
        setError("Couldn't load booking requests — please refresh the page.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {loading && <p className="text-ink/60 text-sm">Loading booking requests...</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
      {!loading && !error && requests.length === 0 && (
        <p className="text-ink/60 text-sm">No booking requests yet.</p>
      )}
      {requests.map((request) => (
        <BookingRow key={request.id} request={request} onCreateOrder={onCreateOrder} />
      ))}
    </div>
  );
}
