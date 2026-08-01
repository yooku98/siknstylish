"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { collections } from "@/lib/collections";
import {
  Order,
  OrderStatus,
  orderStatuses,
  orderStatusLabels,
} from "@/lib/orders";

const inputClasses =
  "border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold";

type CreateStatus = "idle" | "submitting" | "error";

function NewOrderForm() {
  const [status, setStatus] = useState<CreateStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("clientEmail")).trim().toLowerCase();
    const collectionSlug = String(formData.get("collectionSlug"));
    const totalAmount = Number(formData.get("totalAmount")) || 0;

    try {
      const usersQuery = query(
        collection(db, "users"),
        where("email", "==", email),
      );
      const snap = await getDocs(usersQuery);
      if (snap.empty) {
        setError(
          "No client account found with that email. They need to sign up in the client portal first.",
        );
        setStatus("error");
        return;
      }
      const clientDoc = snap.docs[0];

      await addDoc(collection(db, "orders"), {
        clientId: clientDoc.id,
        clientEmail: email,
        collectionSlug,
        status: "consultation",
        totalAmount,
        depositPaid: 0,
        balanceDue: totalAmount,
        staffNotes: "",
        sketchApproved: false,
        fabricApproved: false,
        inspirationNotes: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      (e.target as HTMLFormElement).reset();
      setStatus("idle");
    } catch {
      setError("Something went wrong creating the order.");
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border border-ink/10 p-6"
    >
      <h3 className="font-serif text-xl text-ink">New Order</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="clientEmail">
            Client Email
          </label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            required
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="collectionSlug">
            Collection
          </label>
          <select
            id="collectionSlug"
            name="collectionSlug"
            required
            defaultValue=""
            className={inputClasses}
          >
            <option value="" disabled>
              Select a collection
            </option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="totalAmount">
            Total (GH₵)
          </label>
          <input
            id="totalAmount"
            name="totalAmount"
            type="number"
            min="0"
            step="1"
            className={inputClasses}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="self-start inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Creating..." : "Create Order"}
      </button>
    </form>
  );
}

function OrderRow({ order }: { order: Order }) {
  const [status, setStatusField] = useState<OrderStatus>(order.status);
  const [staffNotes, setStaffNotes] = useState(order.staffNotes);
  const [depositPaid, setDepositPaid] = useState(order.depositPaid);
  const [totalAmount, setTotalAmount] = useState(order.totalAmount);
  const [saveState, setSaveState] = useState<"idle" | "saving">("idle");
  const [savedRecently, setSavedRecently] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const dirty =
    status !== order.status ||
    staffNotes !== order.staffNotes ||
    depositPaid !== order.depositPaid ||
    totalAmount !== order.totalAmount;

  const handleSave = async () => {
    setSaveState("saving");
    setSaveError(null);
    try {
      await updateDoc(doc(db, "orders", order.id), {
        status,
        staffNotes,
        depositPaid,
        totalAmount,
        balanceDue: totalAmount - depositPaid,
        updatedAt: serverTimestamp(),
      });
      setSavedRecently(true);
    } catch {
      setSaveError("Couldn't save — please try again.");
    } finally {
      setSaveState("idle");
    }
  };

  return (
    <div className="border border-ink/10 p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-ink font-medium">{order.clientEmail}</p>
          <p className="text-ink/50 text-xs uppercase tracking-wide">
            {order.collectionSlug}
          </p>
        </div>
        <div className="flex gap-4 text-xs text-ink/60">
          {order.sketchApproved && <span>Sketch approved</span>}
          {order.fabricApproved && <span>Fabric approved</span>}
        </div>
      </div>

      {order.inspirationNotes && (
        <p className="text-sm text-ink/70 bg-ink/5 p-3">
          Client note: {order.inspirationNotes}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-ink/60 uppercase tracking-wide">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatusField(e.target.value as OrderStatus)}
            className={inputClasses}
          >
            {orderStatuses.map((s) => (
              <option key={s} value={s}>
                {orderStatusLabels[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-ink/60 uppercase tracking-wide">
            Total (GH₵)
          </label>
          <input
            type="number"
            min="0"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-ink/60 uppercase tracking-wide">
            Deposit Paid (GH₵)
          </label>
          <input
            type="number"
            min="0"
            value={depositPaid}
            onChange={(e) => setDepositPaid(Number(e.target.value) || 0)}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-ink/60 uppercase tracking-wide">
            Balance Due
          </label>
          <p className="px-4 py-3 text-sm text-ink/70">
            GH₵ {(totalAmount - depositPaid).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-ink/60 uppercase tracking-wide">
          Staff Notes
        </label>
        <textarea
          rows={2}
          value={staffNotes}
          onChange={(e) => setStaffNotes(e.target.value)}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saveState === "saving"}
          className="self-start inline-flex items-center justify-center px-6 py-2.5 text-xs tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors disabled:opacity-40"
        >
          {saveState === "saving" ? "Saving..." : "Save Changes"}
        </button>
        {!dirty && savedRecently && (
          <span className="text-xs text-ink/50">Saved.</span>
        )}
        {saveError && (
          <span className="text-xs text-red-700">{saveError}</span>
        )}
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <NewOrderForm />
      <div className="flex flex-col gap-4">
        {loading && <p className="text-ink/60 text-sm">Loading orders...</p>}
        {!loading && orders.length === 0 && (
          <p className="text-ink/60 text-sm">No orders yet.</p>
        )}
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
