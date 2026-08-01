"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Button from "@/components/ui/Button";
import AuthForm from "@/components/portal/AuthForm";
import MeasurementsForm from "@/components/portal/MeasurementsForm";

const upcomingFeatures = [
  "View the progress of your order",
  "Approve sketches or fabric choices",
  "Upload inspiration photos",
  "Make payments",
  "Review your previous orders",
];

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

export default function PortalApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (nextUser) {
        await ensureUserProfile(nextUser);
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
          We&apos;re still building these out. In the meantime, reach out
          directly and we&apos;ll help with any of the above.
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
