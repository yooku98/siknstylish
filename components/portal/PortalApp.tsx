"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, sendEmailVerification, signOut, User } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import AuthForm from "@/components/portal/AuthForm";
import MeasurementsForm from "@/components/portal/MeasurementsForm";
import OrdersPanel from "@/components/portal/OrdersPanel";

const upcomingFeatures = ["Make payments"];

async function ensureUserProfile(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: user.displayName ?? "",
      createdAt: serverTimestamp(),
    });
  }
}

// Links any order staff created for this email before this person had a
// portal account. Gated on emailVerified in firestore.rules (canClaimOrder)
// so this can't be used to hijack someone else's order.
async function claimUnclaimedOrders(user: User) {
  if (!user.emailVerified || !user.email) return;
  const q = query(
    collection(db, "orders"),
    where("clientEmail", "==", user.email),
    where("clientId", "==", null),
  );
  const snap = await getDocs(q);
  await Promise.all(
    snap.docs.map((d) =>
      updateDoc(d.ref, { clientId: user.uid, updatedAt: serverTimestamp() }),
    ),
  );
}

export default function PortalApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) {
        // Neither of these should ever be able to block the portal from
        // rendering -- a transient failure here (e.g. a network hiccup)
        // shouldn't leave the user stuck on "Loading..." forever.
        await ensureUserProfile(nextUser).catch((err) =>
          console.error("ensureUserProfile failed", err),
        );
        await claimUnclaimedOrders(nextUser).catch((err) =>
          console.error("claimUnclaimedOrders failed", err),
        );
      }
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <p className="text-ink/60 text-sm text-center">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-10 items-center w-full">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 items-center text-center max-w-2xl mx-auto w-full">
      <p className="text-ink/70 text-base">
        Welcome back{user.displayName ? `, ${user.displayName}` : ""}.
      </p>

      {!user.emailVerified && (
        <div className="border border-gold bg-gold/10 p-4 flex flex-col gap-2 w-full text-sm text-ink/80">
          <p>
            Please verify your email — check your inbox for a link. If an
            order was already started for you before you signed up,
            it&apos;ll only show up here once your email is verified.
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              disabled={resendStatus !== "idle"}
              onClick={async () => {
                setResendStatus("sending");
                await sendEmailVerification(user).catch(() => {});
                setResendStatus("sent");
              }}
              className="self-start text-xs uppercase tracking-wide underline disabled:opacity-50"
            >
              {resendStatus === "sent" ? "Verification email sent" : "Resend verification email"}
            </button>
            <button
              type="button"
              onClick={async () => {
                // A signed-in session's cached ID token doesn't pick up
                // emailVerified turning true on its own -- force a refresh.
                await user.reload();
                await user.getIdToken(true);
                window.location.reload();
              }}
              className="self-start text-xs uppercase tracking-wide underline"
            >
              I&apos;ve verified — refresh
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 w-full text-left">
        <h2 className="font-serif text-2xl text-ink text-center">
          Your Orders
        </h2>
        <OrdersPanel user={user} />
      </div>

      <div className="flex flex-col gap-6 w-full text-left">
        <h2 className="font-serif text-2xl text-ink text-center">
          Your Measurements
        </h2>
        <MeasurementsForm user={user} />
      </div>

      <div className="flex flex-col gap-4 items-center">
        <h2 className="font-serif text-2xl text-ink">Coming Soon</h2>
        <ul className="flex flex-col gap-3 text-ink/70 text-base">
          {upcomingFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <p className="text-ink/60 text-sm">
          Paystack integration is pending account review. In the meantime,
          reach out directly and we&apos;ll help with payments.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button href="/contact" variant="primary">
          Contact Us
        </Button>
        <Button type="button" variant="outline" onClick={() => signOut(auth)}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
