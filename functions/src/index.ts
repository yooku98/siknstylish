import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import {
  initializeTransaction,
  processVerifiedPayment,
  verifyWebhookSignature,
  SUBUNIT_MULTIPLIER,
} from "./paystack";

initializeApp();

// Set once the Paystack account is approved:
//   firebase functions:secrets:set PAYSTACK_SECRET_KEY
const paystackSecretKey = defineSecret("PAYSTACK_SECRET_KEY");

const APP_URL = "https://www.siknstylish.com";

/**
 * Called by the client when the "Pay Now" button is pressed. Verifies the
 * caller actually owns the order server-side (never trusts a client-supplied
 * clientId), computes the amount from the order's own balanceDue rather than
 * a client-supplied figure unless a smaller partial-payment amount is
 * explicitly requested, then asks Paystack to start a hosted-checkout
 * transaction and returns the URL to redirect the browser to.
 */
export const initializePaystackTransaction = onCall(
  { secrets: [paystackSecretKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in required.");
    }
    const orderId = request.data?.orderId;
    if (typeof orderId !== "string" || !orderId) {
      throw new HttpsError("invalid-argument", "orderId is required.");
    }

    const db = getFirestore();
    const orderSnap = await db.collection("orders").doc(orderId).get();
    if (!orderSnap.exists) {
      throw new HttpsError("not-found", "Order not found.");
    }
    const order = orderSnap.data()!;
    if (order.clientId !== request.auth.uid) {
      throw new HttpsError("permission-denied", "This order isn't yours.");
    }

    const balanceDue: number = order.balanceDue ?? 0;
    if (balanceDue <= 0) {
      throw new HttpsError("failed-precondition", "This order has no balance due.");
    }

    const requestedAmount = request.data?.amount;
    const amount =
      typeof requestedAmount === "number" && requestedAmount > 0
        ? Math.min(requestedAmount, balanceDue)
        : balanceDue;

    const email = request.auth.token.email;
    if (!email) {
      throw new HttpsError("failed-precondition", "Account has no email on file.");
    }

    const reference = `${orderId}-${Date.now()}`;

    const result = await initializeTransaction({
      secretKey: paystackSecretKey.value(),
      email,
      amountSubunit: Math.round(amount * SUBUNIT_MULTIPLIER),
      reference,
      callbackUrl: `${APP_URL}/portal`,
      metadata: { orderId, clientId: request.auth.uid },
    });

    return {
      authorizationUrl: result.authorization_url,
      reference: result.reference,
    };
  },
);

/**
 * Called by the client right after returning from Paystack's checkout, for
 * immediate UI feedback. Not the authoritative source of truth on its own --
 * see paystackWebhook below -- but shares the same idempotent processing
 * logic, so whichever of the two fires first wins and the other is a no-op.
 */
export const verifyPaystackTransaction = onCall(
  { secrets: [paystackSecretKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in required.");
    }
    const reference = request.data?.reference;
    if (typeof reference !== "string" || !reference) {
      throw new HttpsError("invalid-argument", "reference is required.");
    }

    try {
      return await processVerifiedPayment(reference, paystackSecretKey.value());
    } catch (err) {
      logger.error(`verifyPaystackTransaction failed for ${reference}`, err);
      throw new HttpsError("internal", "Could not verify payment.");
    }
  },
);

/**
 * Paystack's server-to-server notification -- the reliable path, since it
 * doesn't depend on the client's browser staying open after payment. Every
 * webhook request must have its signature checked before anything in the
 * body is trusted; see https://paystack.com/docs/payments/webhooks/.
 */
export const paystackWebhook = onRequest(
  { secrets: [paystackSecretKey] },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const signature = req.headers["x-paystack-signature"];
    const valid = verifyWebhookSignature(
      req.rawBody,
      typeof signature === "string" ? signature : undefined,
      paystackSecretKey.value(),
    );
    if (!valid) {
      logger.warn("paystackWebhook: invalid signature");
      res.status(401).send("Invalid signature");
      return;
    }

    const event = req.body?.event;
    const reference = req.body?.data?.reference;

    if (event !== "charge.success" || !reference) {
      // Ack anything we don't act on so Paystack doesn't keep retrying it.
      res.status(200).send("ignored");
      return;
    }

    try {
      await processVerifiedPayment(reference, paystackSecretKey.value());
      res.status(200).send("ok");
    } catch (err) {
      logger.error(`paystackWebhook: failed processing ${reference}`, err);
      // Non-2xx so Paystack retries -- this branch is for transient
      // failures (e.g. a Firestore hiccup), not a permanently bad payload.
      res.status(500).send("processing error");
    }
  },
);
