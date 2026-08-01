"use client";

import { FormEvent, useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";

type Status = "loading" | "idle" | "saving" | "saved" | "error";

const fields: { key: string; label: string }[] = [
  { key: "bustChest", label: "Bust / Chest" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "shoulderToWaist", label: "Shoulder to Waist" },
  { key: "shoulderToFloor", label: "Shoulder to Floor" },
  { key: "armLength", label: "Arm Length" },
  { key: "sleeve", label: "Sleeve (fullest part of upper arm)" },
];

type Measurements = Record<string, string>;

export default function MeasurementsForm({ user }: { user: User }) {
  const [status, setStatus] = useState<Status>("loading");
  const [values, setValues] = useState<Measurements>({});
  const [notes, setNotes] = useState("");

  const measurementsRef = doc(db, "users", user.uid, "measurements", "current");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const snap = await getDoc(measurementsRef);
      if (cancelled) return;
      if (snap.exists()) {
        const data = snap.data();
        setValues(data.values ?? {});
        setNotes(data.notes ?? "");
      }
      setStatus("idle");
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await setDoc(measurementsRef, {
        values,
        notes,
        updatedAt: serverTimestamp(),
      });
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  if (status === "loading") {
    return <p className="text-ink/60 text-sm text-center">Loading measurements...</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full text-left"
      onChange={() => status !== "saving" && setStatus("idle")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm text-ink/70" htmlFor={key}>
              {label}
            </label>
            <input
              id={key}
              type="text"
              inputMode="decimal"
              placeholder="e.g. 34 in"
              value={values[key] ?? ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-ink/70" htmlFor="measurement-notes">
          Notes
        </label>
        <textarea
          id="measurement-notes"
          rows={3}
          placeholder="Anything else we should know — fit preferences, past adjustments, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border border-ink/20 bg-ivory px-4 py-3 text-sm resize-none focus:outline-none focus:border-gold"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save Measurements"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-ink/60">Saved.</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-700">
            Couldn&apos;t save — please try again.
          </span>
        )}
      </div>
    </form>
  );
}
