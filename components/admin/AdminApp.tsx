"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminPortfolio from "@/components/admin/AdminPortfolio";
import AdminBookings from "@/components/admin/AdminBookings";

type Tab = "orders" | "bookings" | "portfolio";
type Prefill = { email: string; collectionSlug: string } | null;

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("orders");
  const [prefill, setPrefill] = useState<Prefill>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        const token = await nextUser.getIdTokenResult();
        setIsStaff(token.claims.role === "staff");
      } else {
        setIsStaff(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshAccess = async () => {
    if (!user) return;
    const token = await user.getIdTokenResult(true);
    setIsStaff(token.claims.role === "staff");
  };

  if (loading) {
    return <p className="text-ink/60 text-sm">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-4 items-start">
        <p className="text-ink/70 text-base">
          Please sign in through the client portal first.
        </p>
        <Button href="/portal" variant="primary">
          Go to Client Portal
        </Button>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="flex flex-col gap-4 items-start">
        <p className="text-ink/70 text-base">
          You&apos;re signed in as {user.email}, but this account doesn&apos;t
          have staff access.
        </p>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={refreshAccess}>
            Refresh Access
          </Button>
          <Button type="button" variant="outline" onClick={() => signOut(auth)}>
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex border border-ink/20">
          <button
            type="button"
            onClick={() => setTab("orders")}
            className={`px-6 py-2.5 text-sm uppercase tracking-wide transition-colors ${
              tab === "orders" ? "bg-ink text-ivory" : "text-ink/70"
            }`}
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => setTab("bookings")}
            className={`px-6 py-2.5 text-sm uppercase tracking-wide transition-colors ${
              tab === "bookings" ? "bg-ink text-ivory" : "text-ink/70"
            }`}
          >
            Bookings
          </button>
          <button
            type="button"
            onClick={() => setTab("portfolio")}
            className={`px-6 py-2.5 text-sm uppercase tracking-wide transition-colors ${
              tab === "portfolio" ? "bg-ink text-ivory" : "text-ink/70"
            }`}
          >
            Portfolio
          </button>
        </div>
        <Button type="button" variant="outline" onClick={() => signOut(auth)}>
          Sign Out
        </Button>
      </div>

      {tab === "orders" && <AdminOrders prefill={prefill} />}
      {tab === "bookings" && (
        <AdminBookings
          onCreateOrder={(params) => {
            setPrefill(params);
            setTab("orders");
          }}
        />
      )}
      {tab === "portfolio" && <AdminPortfolio />}
    </div>
  );
}
