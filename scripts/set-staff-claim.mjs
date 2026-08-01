// One-off local script to grant/revoke the "staff" custom claim used by the
// Firestore/Storage security rules. This cannot be done from the Firebase
// Console UI — only the Admin SDK can set custom claims.
//
// Usage:
//   node scripts/set-staff-claim.mjs grant someone@example.com [path-to-key.json]
//   node scripts/set-staff-claim.mjs revoke someone@example.com [path-to-key.json]
//
// Credentials, in order of preference:
//   1. A service account key JSON at the given path (or
//      ./secrets/service-account.json) — gitignored, never commit it.
//   2. Application Default Credentials, e.g. from:
//        gcloud auth application-default login \
//          --impersonate-service-account=firebase-adminsdk-fbsvc@siknstylish.iam.gserviceaccount.com
//      Use this when the project's org policy blocks downloadable keys
//      (iam.disableServiceAccountKeyCreation).

import { existsSync, readFileSync } from "fs";
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [, , action, email, keyPathArg] = process.argv;

if (!["grant", "revoke"].includes(action) || !email) {
  console.error(
    "Usage: node scripts/set-staff-claim.mjs <grant|revoke> <email> [path-to-service-account.json]",
  );
  process.exit(1);
}

const keyPath = keyPathArg ?? "./secrets/service-account.json";

if (existsSync(keyPath)) {
  const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
  initializeApp({ credential: cert(serviceAccount) });
} else {
  initializeApp({
    credential: applicationDefault(),
    projectId: "siknstylish",
  });
}

const auth = getAuth();
const user = await auth.getUserByEmail(email);
const nextClaims = { ...user.customClaims };

if (action === "grant") {
  nextClaims.role = "staff";
} else {
  delete nextClaims.role;
}

await auth.setCustomUserClaims(user.uid, nextClaims);
console.log(
  `${action === "grant" ? "Granted" : "Revoked"} staff role for ${email} (${user.uid}).`,
);
console.log(
  "They must sign out and back in (or wait for their ID token to refresh) before it takes effect.",
);
