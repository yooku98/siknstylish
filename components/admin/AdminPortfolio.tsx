"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { collections } from "@/lib/collections";

const inputClasses =
  "border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold";

type PortfolioItem = {
  id: string;
  collectionSlug: string;
  imageUrl: string;
  storagePath: string;
  caption: string;
  createdAt: Timestamp | null;
};

type UploadStatus = "idle" | "uploading" | "error";

function UploadForm() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("uploading");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const collectionSlug = String(formData.get("collectionSlug"));
    const caption = String(formData.get("caption") ?? "");
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      setError("Please choose an image.");
      setStatus("error");
      return;
    }

    try {
      const storagePath = `portfolio/${collectionSlug}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "portfolioItems"), {
        collectionSlug,
        imageUrl,
        storagePath,
        caption,
        createdAt: serverTimestamp(),
      });

      (e.target as HTMLFormElement).reset();
      setStatus("idle");
    } catch {
      setError("Upload failed. Please try again.");
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border border-ink/10 p-6"
    >
      <h3 className="font-serif text-xl text-ink">Upload Portfolio Image</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <label className="text-sm text-ink/70" htmlFor="caption">
            Caption
          </label>
          <input id="caption" name="caption" type="text" className={inputClasses} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="image">
            Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            className={`${inputClasses} py-2.5`}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={status === "uploading"}
        className="self-start inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors disabled:opacity-60"
      >
        {status === "uploading" ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "portfolioItems"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setItems(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PortfolioItem),
        );
        setLoading(false);
      },
      () => {
        setLoadError("Couldn't load portfolio images — please refresh the page.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const handleDelete = async (item: PortfolioItem) => {
    setDeletingId(item.id);
    setDeleteError(null);
    try {
      await deleteDoc(doc(db, "portfolioItems", item.id));
      await deleteObject(ref(storage, item.storagePath));
    } catch {
      setDeleteError("Couldn't delete — please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <UploadForm />
      {deleteError && <p className="text-sm text-red-700">{deleteError}</p>}
      {loadError && <p className="text-sm text-red-700">{loadError}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && <p className="text-ink/60 text-sm">Loading...</p>}
        {!loading && !loadError && items.length === 0 && (
          <p className="text-ink/60 text-sm col-span-full">
            No portfolio images uploaded yet.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.caption || item.collectionSlug}
              className="w-full aspect-[4/5] object-cover border border-ink/10"
            />
            <p className="text-xs text-ink/50 uppercase tracking-wide">
              {item.collectionSlug}
            </p>
            {item.caption && (
              <p className="text-sm text-ink/70">{item.caption}</p>
            )}
            <button
              type="button"
              onClick={() => handleDelete(item)}
              disabled={deletingId === item.id}
              className="text-xs text-red-700 uppercase tracking-wide self-start disabled:opacity-50"
            >
              {deletingId === item.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
