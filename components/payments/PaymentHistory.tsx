"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Payment, paymentMethodLabels } from "@/lib/orders";

export function usePayments(orderId: string) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "orders", orderId, "payments"), orderBy("paidAt", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Payment));
        setError(null);
        setLoading(false);
      },
      () => {
        setError("Couldn't load payment history — please refresh the page.");
        setLoading(false);
      },
    );
  }, [orderId]);

  return { payments, loading, error };
}

function formatPaidAt(payment: Payment) {
  return payment.paidAt
    ? payment.paidAt.toDate().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Just now";
}

function formatCedis(amount: number) {
  const sign = amount < 0 ? "−" : "";
  return `${sign}GH₵ ${Math.abs(amount).toLocaleString()}`;
}

export default function PaymentHistory({
  payments,
  loading,
  error,
  depositPaid,
  showRecordedBy = false,
}: {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  depositPaid: number;
  showRecordedBy?: boolean;
}) {
  if (loading) return <p className="text-xs text-ink/50">Loading payments...</p>;
  if (error) return <p className="text-xs text-red-700">{error}</p>;

  // Orders paid before the log existed carry a deposit with no entries
  // behind it; show that as one opening line rather than a fake entry.
  const logged = payments.reduce((sum, p) => sum + p.amount, 0);
  const unlogged = Math.round((depositPaid - logged) * 100) / 100;

  if (payments.length === 0 && unlogged === 0) {
    return <p className="text-xs text-ink/50">No payments recorded yet.</p>;
  }

  return (
    <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10 text-sm">
      {payments.map((payment) => (
        <li key={payment.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2">
          <div className="flex flex-col">
            <span className="text-ink">
              {formatPaidAt(payment)} · {paymentMethodLabels[payment.method] ?? payment.method}
              {payment.amount < 0 && <span className="text-red-700"> · Correction</span>}
            </span>
            {payment.note && <span className="text-ink/60 text-xs">{payment.note}</span>}
            {showRecordedBy && payment.recordedByEmail && (
              <span className="text-ink/40 text-xs">Recorded by {payment.recordedByEmail}</span>
            )}
          </div>
          <span className={payment.amount < 0 ? "text-red-700" : "text-ink"}>
            {formatCedis(payment.amount)}
          </span>
        </li>
      ))}
      {unlogged !== 0 && (
        <li className="flex flex-wrap items-baseline justify-between gap-x-4 py-2 text-ink/60">
          <span>Recorded before payment history started</span>
          <span>{formatCedis(unlogged)}</span>
        </li>
      )}
    </ul>
  );
}
