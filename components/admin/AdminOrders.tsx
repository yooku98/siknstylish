"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
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
  arrayUnion,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { collections, getCollection } from "@/lib/collections";
import { resizeImage } from "@/lib/resizeImage";
import {
  Order,
  OrderStatus,
  PaymentMethod,
  orderStatuses,
  orderStatusLabels,
  paymentMethodLabels,
} from "@/lib/orders";
import PaymentHistory, { usePayments } from "@/components/payments/PaymentHistory";

const inputClasses =
  "border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold";

type CreateStatus = "idle" | "submitting" | "error";

export type OrderPrefill = {
  email: string;
  name: string;
  phone: string;
  collectionSlug: string;
  bookingId: string;
};

function formatDate(order: Order) {
  return order.createdAt
    ? order.createdAt.toDate().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Just now";
}

function NewOrderForm({
  prefill,
  onCreated,
}: {
  prefill?: OrderPrefill | null;
  onCreated: (message: string) => void;
}) {
  const [status, setStatus] = useState<CreateStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("clientEmail")).trim().toLowerCase();
    const clientName = String(formData.get("clientName") ?? "").trim();
    const clientPhone = String(formData.get("clientPhone") ?? "").trim();
    const collectionSlug = String(formData.get("collectionSlug"));
    const totalAmount = Number(formData.get("totalAmount")) || 0;

    try {
      const usersQuery = query(
        collection(db, "users"),
        where("email", "==", email),
      );
      const snap = await getDocs(usersQuery);
      // No portal account yet? Create the order anyway with clientId left
      // null -- it auto-links the moment they sign up with this same,
      // verified email (see firestore.rules canClaimOrder / AuthForm).
      const clientId = snap.empty ? null : snap.docs[0].id;

      await addDoc(collection(db, "orders"), {
        clientId,
        clientEmail: email,
        clientName,
        clientPhone,
        collectionSlug,
        status: "consultation",
        totalAmount,
        depositPaid: 0,
        balanceDue: totalAmount,
        staffNotes: "",
        sketches: [],
        sketchApproved: false,
        fabricApproved: false,
        inspirationNotes: "",
        inspirationPhotos: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const notes: string[] = [];
      if (prefill?.bookingId) {
        try {
          await updateDoc(doc(db, "bookingRequests", prefill.bookingId), {
            status: "converted",
          });
        } catch {
          notes.push("Couldn't mark the booking as converted -- update it in the Bookings tab.");
        }
      }
      if (clientId === null) {
        notes.push(
          "This client doesn't have a portal account yet -- the order will show up in their portal once they sign up with this email.",
        );
      }
      (e.target as HTMLFormElement).reset();
      setStatus("idle");
      // Clears the booking prefill; reset() alone would restore its values
      // and invite a duplicate order.
      onCreated(notes.length ? `Order created. ${notes.join(" ")}` : "Order created.");
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
      {prefill && (
        <p className="text-xs text-ink/60">
          From {prefill.name}&apos;s booking request -- it will be marked as converted.
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="clientName">
            Client Name
          </label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            defaultValue={prefill?.name}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="clientPhone">
            Phone / WhatsApp
          </label>
          <input
            id="clientPhone"
            name="clientPhone"
            type="tel"
            defaultValue={prefill?.phone}
            className={inputClasses}
          />
        </div>
      </div>
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
            defaultValue={prefill?.email}
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
            defaultValue={prefill?.collectionSlug || ""}
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

const roundCedis = (n: number) => Math.round(n * 100) / 100;

// Staff can record these; "paystack" entries only come from Cloud Functions.
const manualPaymentMethods: PaymentMethod[] = ["cash", "momo", "bank", "other"];

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function RecordPayment({ order }: { order: Order }) {
  const [kind, setKind] = useState<"payment" | "correction">("payment");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("momo");
  const [paidOn, setPaidOn] = useState(todayInputValue);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recorded, setRecorded] = useState(false);

  const parsed = roundCedis(Number(amount));
  const validAmount = Number.isFinite(parsed) && parsed > 0;
  const needsNote = kind === "correction" && !note.trim();

  const handleRecord = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!validAmount || needsNote || !user) return;
    setSaving(true);
    setError(null);
    setRecorded(false);

    const signed = kind === "correction" ? -parsed : parsed;
    const orderRef = doc(db, "orders", order.id);
    const paymentRef = doc(collection(orderRef, "payments"));
    try {
      // A transaction so the new deposit is based on the latest saved value,
      // not whatever this screen loaded -- two staff recording at once can't
      // overwrite each other.
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(orderRef);
        if (!snap.exists()) throw new Error("missing");
        const current = snap.data() as Order;
        const depositPaid = roundCedis((current.depositPaid ?? 0) + signed);
        if (depositPaid > current.totalAmount) throw new Error("overpaid");
        if (depositPaid < 0) throw new Error("negative");

        tx.set(paymentRef, {
          amount: signed,
          method,
          note: note.trim(),
          source: "manual",
          // Noon avoids the date shifting a day if a browser isn't on GMT.
          paidAt: Timestamp.fromDate(new Date(`${paidOn}T12:00:00`)),
          recordedBy: user.uid,
          recordedByEmail: user.email ?? "",
          processedAt: serverTimestamp(),
        });
        tx.update(orderRef, {
          depositPaid,
          balanceDue: roundCedis(current.totalAmount - depositPaid),
          lastPaymentId: paymentRef.id,
          updatedAt: serverTimestamp(),
        });
      });
      setAmount("");
      setNote("");
      setKind("payment");
      setRecorded(true);
    } catch (err) {
      const reason = err instanceof Error ? err.message : "";
      setError(
        reason === "overpaid"
          ? "That would take payments above the order total."
          : reason === "negative"
            ? "A correction can't take the total paid below zero."
            : "Couldn't record the payment — please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleRecord} className="flex flex-col gap-3 bg-ink/5 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as "payment" | "correction")}
          aria-label="Entry type"
          className={inputClasses}
        >
          <option value="payment">Payment received</option>
          <option value="correction">Correction / refund</option>
        </select>
        <input
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          placeholder="Amount (GH₵)"
          aria-label="Amount in cedis"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClasses}
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          aria-label="Payment method"
          className={inputClasses}
        >
          {manualPaymentMethods.map((m) => (
            <option key={m} value={m}>
              {paymentMethodLabels[m]}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={paidOn}
          max={todayInputValue()}
          onChange={(e) => setPaidOn(e.target.value || todayInputValue())}
          aria-label="Date paid"
          className={inputClasses}
        />
      </div>
      <input
        type="text"
        maxLength={300}
        placeholder={
          kind === "correction"
            ? "Reason for the correction (required, visible to the client)"
            : "Note, e.g. MoMo reference (optional, visible to the client)"
        }
        aria-label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className={inputClasses}
      />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!validAmount || needsNote || saving}
          className="inline-flex items-center justify-center px-5 py-2 text-xs tracking-wide uppercase border border-ink text-ink hover:bg-ink hover:text-ivory transition-colors disabled:opacity-40"
        >
          {saving ? "Recording..." : kind === "correction" ? "Record Correction" : "Record Payment"}
        </button>
        {recorded && <span className="text-xs text-ink/50">Recorded.</span>}
        {error && <span className="text-xs text-red-700">{error}</span>}
      </div>
    </form>
  );
}

function OrderPayments({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="self-start text-xs text-ink/60 uppercase tracking-wide hover:text-gold"
      >
        Payments {open ? "▴" : "▾"}
      </button>
      {/* Mounted only when open so a long order list doesn't hold one live
          listener per order. */}
      {open && <OrderPaymentsBody order={order} />}
    </div>
  );
}

function OrderPaymentsBody({ order }: { order: Order }) {
  const { payments, loading, error } = usePayments(order.id);
  return (
    <>
      <PaymentHistory
        payments={payments}
        loading={loading}
        error={error}
        depositPaid={order.depositPaid}
        showRecordedBy
      />
      <RecordPayment order={order} />
    </>
  );
}

function OrderRow({ order }: { order: Order }) {
  const [status, setStatusField] = useState<OrderStatus>(order.status);
  const [staffNotes, setStaffNotes] = useState(order.staffNotes);
  const [totalAmount, setTotalAmount] = useState(order.totalAmount);
  const [clientName, setClientName] = useState(order.clientName ?? "");
  const [clientPhone, setClientPhone] = useState(order.clientPhone ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving">("idle");
  const [savedRecently, setSavedRecently] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sketchUploading, setSketchUploading] = useState(false);
  const [sketchError, setSketchError] = useState<string | null>(null);

  const dirty =
    status !== order.status ||
    staffNotes !== order.staffNotes ||
    totalAmount !== order.totalAmount ||
    clientName !== (order.clientName ?? "") ||
    clientPhone !== (order.clientPhone ?? "");
  // Deposits only change through the payment log, so this is the live value.
  const depositPaid = order.depositPaid;
  const overpaid = depositPaid > totalAmount;

  const handleSave = async () => {
    if (overpaid) return;
    setSaveState("saving");
    setSaveError(null);
    try {
      const orderRef = doc(db, "orders", order.id);
      // Read the deposit inside the transaction: a payment recorded since
      // this screen loaded must not be undone by a stale balance.
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(orderRef);
        if (!snap.exists()) throw new Error("missing");
        const latestDeposit = (snap.data() as Order).depositPaid ?? 0;
        if (latestDeposit > totalAmount) throw new Error("overpaid");
        tx.update(orderRef, {
          status,
          staffNotes,
          totalAmount,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          balanceDue: roundCedis(totalAmount - latestDeposit),
          updatedAt: serverTimestamp(),
        });
      });
      setSavedRecently(true);
    } catch (err) {
      setSaveError(
        err instanceof Error && err.message === "overpaid"
          ? "The total can't be less than what's already been paid."
          : "Couldn't save — please try again.",
      );
    } finally {
      setSaveState("idle");
    }
  };

  const handleSketchUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;

    setSketchUploading(true);
    setSketchError(null);
    try {
      const file = await resizeImage(picked);
      const storagePath = `orders/${order.id}/sketches/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, storagePath);
      // No customMetadata.clientId if the order is still unclaimed -- there's
      // no uid to tag it with yet, so it just stays unreadable by any client
      // (correct: nobody's signed in as this client yet) until claimed.
      await uploadBytes(
        storageRef,
        file,
        order.clientId ? { customMetadata: { clientId: order.clientId } } : undefined,
      );
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "orders", order.id), {
        sketches: arrayUnion({ url, storagePath }),
        updatedAt: serverTimestamp(),
      });
    } catch {
      setSketchError("Sketch upload failed — please try again.");
    } finally {
      setSketchUploading(false);
    }
  };

  const collectionName = getCollection(order.collectionSlug)?.name ?? order.collectionSlug;

  return (
    <div className="border border-ink/10 p-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-ink font-medium">{order.clientName || order.clientEmail}</p>
          <p className="text-ink/60 text-sm">
            {[order.clientName ? order.clientEmail : null, order.clientPhone]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <p className="text-ink/50 text-xs uppercase tracking-wide mt-1">
            {collectionName} · {formatDate(order)}
          </p>
        </div>
        <div className="flex gap-4 text-xs text-ink/60">
          {!order.clientId && (
            <span className="text-gold">Unclaimed — no portal account yet</span>
          )}
          {order.sketchApproved && <span>Sketch approved</span>}
          {order.fabricApproved && <span>Fabric approved</span>}
        </div>
      </div>

      {order.inspirationNotes && (
        <p className="text-sm text-ink/70 bg-ink/5 p-3">
          Client note: {order.inspirationNotes}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xs text-ink/60 uppercase tracking-wide">
          Sketches
        </label>
        <div className="flex flex-wrap gap-3">
          {order.sketches?.map((sketch) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={sketch.storagePath}
              src={sketch.url}
              alt="Sketch"
              className="w-20 h-20 object-cover border border-ink/10"
            />
          ))}
          <label className="w-20 h-20 border border-dashed border-ink/30 flex items-center justify-center text-xs text-ink/50 cursor-pointer text-center px-1">
            {sketchUploading ? "..." : "+ Add"}
            <input
              type="file"
              accept="image/*"
              onChange={handleSketchUpload}
              disabled={sketchUploading}
              className="hidden"
            />
          </label>
        </div>
        {sketchError && <p className="text-xs text-red-700">{sketchError}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-ink/60 uppercase tracking-wide">
          Inspiration Photos
        </label>
        {order.inspirationPhotos?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {order.inspirationPhotos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.storagePath}
                src={photo.url}
                alt="Client inspiration"
                className="w-20 h-20 object-cover border border-ink/10"
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-ink/50">No inspiration photos uploaded.</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-ink/60 uppercase tracking-wide">
            Client Name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-ink/60 uppercase tracking-wide">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

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
          <span className="text-xs text-ink/60 uppercase tracking-wide">
            Paid So Far
          </span>
          <p className="px-4 py-3 text-sm text-ink/70">
            GH₵ {depositPaid.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-ink/60 uppercase tracking-wide">
            Balance Due
          </label>
          <p className={`px-4 py-3 text-sm ${overpaid ? "text-red-700" : "text-ink/70"}`}>
            GH₵ {roundCedis(totalAmount - depositPaid).toLocaleString()}
          </p>
        </div>
      </div>

      <OrderPayments order={order} />

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
          disabled={!dirty || overpaid || saveState === "saving"}
          className="self-start inline-flex items-center justify-center px-6 py-2.5 text-xs tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors disabled:opacity-40"
        >
          {saveState === "saving" ? "Saving..." : "Save Changes"}
        </button>
        {!dirty && savedRecently && (
          <span className="text-xs text-ink/50">Saved.</span>
        )}
        {overpaid && (
          <span className="text-xs text-red-700">
            The total can&apos;t be less than what&apos;s been paid.
          </span>
        )}
        {saveError && (
          <span className="text-xs text-red-700">{saveError}</span>
        )}
      </div>
    </div>
  );
}

type StatusFilter = "all" | "active" | OrderStatus;

const closedStatuses: OrderStatus[] = ["delivered", "cancelled"];

export default function AdminOrders({
  prefill,
  onPrefillUsed,
}: {
  prefill?: OrderPrefill | null;
  onPrefillUsed: () => void;
}) {
  const [createdInfo, setCreatedInfo] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const visibleOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter === "active" && closedStatuses.includes(order.status)) return false;
      if (statusFilter !== "all" && statusFilter !== "active" && order.status !== statusFilter) {
        return false;
      }
      if (!term) return true;
      return [order.clientEmail, order.clientName, order.clientPhone]
        .some((field) => field?.toLowerCase().includes(term));
    });
  }, [orders, search, statusFilter]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
        setLoading(false);
      },
      () => {
        setError("Couldn't load orders — please refresh the page.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {createdInfo && (
        <p role="status" className="text-sm text-ink/70 border border-gold/40 bg-gold/10 px-4 py-3">
          {createdInfo}
        </p>
      )}
      <NewOrderForm
        key={prefill?.bookingId ?? "empty"}
        prefill={prefill}
        onCreated={(message) => {
          setCreatedInfo(message);
          onPrefillUsed();
        }}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone"
            aria-label="Search orders"
            className={`${inputClasses} flex-1`}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            aria-label="Filter by status"
            className={inputClasses}
          >
            <option value="all">All orders ({orders.length})</option>
            <option value="active">In progress (not delivered or cancelled)</option>
            {orderStatuses.map((s) => (
              <option key={s} value={s}>
                {orderStatusLabels[s]}
              </option>
            ))}
          </select>
        </div>
        {loading && <p className="text-ink/60 text-sm">Loading orders...</p>}
        {error && <p className="text-sm text-red-700">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-ink/60 text-sm">No orders yet.</p>
        )}
        {!loading && orders.length > 0 && visibleOrders.length === 0 && (
          <p className="text-ink/60 text-sm">No orders match this search.</p>
        )}
        {visibleOrders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
