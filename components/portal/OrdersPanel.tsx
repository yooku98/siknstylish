"use client";

import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { getCollection } from "@/lib/collections";
import { Order, orderStatusLabels } from "@/lib/orders";

function OrderCard({ order }: { order: Order }) {
  const [inspirationNotes, setInspirationNotes] = useState(order.inspirationNotes);
  const [savingApproval, setSavingApproval] = useState<
    "sketch" | "fabric" | null
  >(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const collectionName = getCollection(order.collectionSlug)?.name ?? order.collectionSlug;

  const toggleApproval = async (field: "sketchApproved" | "fabricApproved") => {
    setSavingApproval(field === "sketchApproved" ? "sketch" : "fabric");
    setError(null);
    try {
      await updateDoc(doc(db, "orders", order.id), {
        [field]: !order[field],
      });
    } catch {
      setError("Couldn't save — please try again.");
    } finally {
      setSavingApproval(null);
    }
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    setError(null);
    try {
      await updateDoc(doc(db, "orders", order.id), { inspirationNotes });
      setNotesSaved(true);
    } catch {
      setError("Couldn't save — please try again.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const storagePath = `orders/${order.id}/inspiration/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, storagePath);
      // OrdersPanel only ever renders orders already claimed by this user
      // (query is where clientId==user.uid), so this is never actually null.
      await uploadBytes(storageRef, file, {
        customMetadata: { clientId: order.clientId ?? "" },
      });
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "orders", order.id), {
        inspirationPhotos: arrayUnion({ url, storagePath }),
      });
    } catch {
      setError("Photo upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-ink/10 p-6 flex flex-col gap-5 text-left">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-ink font-medium">{collectionName}</p>
          <p className="text-ink/50 text-xs uppercase tracking-wide">
            {orderStatusLabels[order.status]}
          </p>
        </div>
        <p className="text-sm text-ink/70">
          GH₵ {order.depositPaid.toLocaleString()} paid of{" "}
          {order.totalAmount.toLocaleString()} — balance GH₵{" "}
          {order.balanceDue.toLocaleString()}
        </p>
      </div>

      {order.sketches?.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-ink/60 uppercase tracking-wide">Sketches</p>
          <div className="flex flex-wrap gap-3">
            {order.sketches.map((sketch) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={sketch.storagePath}
                src={sketch.url}
                alt="Sketch"
                className="w-24 h-24 object-cover border border-ink/10"
              />
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={order.sketchApproved}
              disabled={savingApproval === "sketch"}
              onChange={() => toggleApproval("sketchApproved")}
            />
            I approve this sketch
          </label>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={order.fabricApproved}
          disabled={savingApproval === "fabric"}
          onChange={() => toggleApproval("fabricApproved")}
        />
        I approve the fabric choice
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-ink/60 uppercase tracking-wide">
          Inspiration Photos
        </p>
        <div className="flex flex-wrap gap-3">
          {order.inspirationPhotos?.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.storagePath}
              src={photo.url}
              alt="Inspiration"
              className="w-20 h-20 object-cover border border-ink/10"
            />
          ))}
          <label className="w-20 h-20 border border-dashed border-ink/30 flex items-center justify-center text-xs text-ink/50 cursor-pointer text-center px-1">
            {uploading ? "..." : "+ Add"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) handlePhotoUpload(file);
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-ink/60 uppercase tracking-wide" htmlFor={`notes-${order.id}`}>
          Notes for us
        </label>
        <textarea
          id={`notes-${order.id}`}
          rows={2}
          value={inspirationNotes}
          onChange={(e) => {
            setInspirationNotes(e.target.value);
            setNotesSaved(false);
          }}
          className="border border-ink/20 bg-ivory px-4 py-3 text-sm resize-none focus:outline-none focus:border-gold"
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={saveNotes}
            disabled={savingNotes || inspirationNotes === order.inspirationNotes}
            className="self-start inline-flex items-center justify-center px-6 py-2.5 text-xs tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors disabled:opacity-40"
          >
            {savingNotes ? "Saving..." : "Save Note"}
          </button>
          {notesSaved && inspirationNotes === order.inspirationNotes && (
            <span className="text-xs text-ink/50">Saved.</span>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

export default function OrdersPanel({ user }: { user: User }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("clientId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
        setLoading(false);
      },
      () => {
        setError("Couldn't load your orders — please refresh the page.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [user.uid]);

  if (loading) {
    return <p className="text-ink/60 text-sm text-center">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-700 text-center">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <p className="text-ink/60 text-sm text-center">
        You don&apos;t have any orders yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
