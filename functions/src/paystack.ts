import * as crypto from "crypto";
import * as logger from "firebase-functions/logger";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

// Paystack (like most African/UK-style processors) takes amounts in the
// currency's smallest subunit -- pesewas for GHS, same idea as kobo/cents.
export const SUBUNIT_MULTIPLIER = 100;

export function verifyWebhookSignature(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  secretKey: string,
): boolean {
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const actualBuf = Buffer.from(signatureHeader, "utf8");
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned" | string;
    reference: string;
    amount: number; // subunit
    currency: string;
    paid_at: string | null;
    metadata: { orderId?: string; clientId?: string } | null;
  };
};

async function paystackRequest<T>(
  path: string,
  secretKey: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = (await res.json()) as T & { message?: string };
  if (!res.ok) {
    throw new Error(
      `Paystack request to ${path} failed: ${res.status} ${body?.message ?? ""}`,
    );
  }
  return body;
}

export async function initializeTransaction(params: {
  secretKey: string;
  email: string;
  amountSubunit: number;
  reference: string;
  callbackUrl: string;
  metadata: { orderId: string; clientId: string };
}): Promise<PaystackInitializeResponse["data"]> {
  const res = await paystackRequest<PaystackInitializeResponse>(
    "/transaction/initialize",
    params.secretKey,
    {
      method: "POST",
      body: JSON.stringify({
        email: params.email,
        amount: params.amountSubunit,
        currency: "GHS",
        reference: params.reference,
        callback_url: params.callbackUrl,
        metadata: params.metadata,
      }),
    },
  );
  return res.data;
}

async function verifyTransaction(
  reference: string,
  secretKey: string,
): Promise<PaystackVerifyResponse["data"]> {
  const res = await paystackRequest<PaystackVerifyResponse>(
    `/transaction/verify/${encodeURIComponent(reference)}`,
    secretKey,
  );
  return res.data;
}

/**
 * Single source of truth for crediting a payment, called from both the
 * webhook and the client-facing verify callable. Always re-confirms with
 * Paystack's own /transaction/verify endpoint rather than trusting whatever
 * payload triggered it (webhook body or client-supplied reference) --
 * neither a webhook delivery nor a client call is assumed trustworthy on
 * its own, only Paystack's live API response is.
 *
 * Idempotent: keyed by reference as the payments/{reference} doc ID, so a
 * webhook delivery and a client-triggered verify racing each other (or
 * Paystack retrying a webhook) can't double-credit an order.
 */
export async function processVerifiedPayment(
  reference: string,
  secretKey: string,
): Promise<{ status: string; orderId?: string }> {
  const data = await verifyTransaction(reference, secretKey);

  if (data.status !== "success") {
    logger.info(`Payment ${reference} not successful (status: ${data.status})`);
    return { status: data.status };
  }

  const orderId = data.metadata?.orderId;
  const clientId = data.metadata?.clientId;
  if (!orderId || !clientId) {
    logger.error(`Payment ${reference} missing orderId/clientId metadata`);
    throw new Error("Payment metadata missing orderId/clientId");
  }

  const db = getFirestore();
  const paymentRef = db.collection("payments").doc(reference);
  const orderRef = db.collection("orders").doc(orderId);

  await db.runTransaction(async (tx) => {
    const [paymentSnap, orderSnap] = await Promise.all([
      tx.get(paymentRef),
      tx.get(orderRef),
    ]);

    if (paymentSnap.exists && paymentSnap.data()?.status === "success") {
      // Already processed by the other path (webhook vs. callable race).
      return;
    }

    if (!orderSnap.exists) {
      throw new Error(`Order ${orderId} not found for payment ${reference}`);
    }
    const order = orderSnap.data()!;
    if (order.clientId !== clientId) {
      throw new Error(
        `Payment ${reference} metadata.clientId does not match order ${orderId}'s clientId`,
      );
    }

    const amountPaid = data.amount / SUBUNIT_MULTIPLIER;
    const depositPaid = (order.depositPaid ?? 0) + amountPaid;
    const balanceDue = Math.max((order.totalAmount ?? 0) - depositPaid, 0);

    tx.set(paymentRef, {
      orderId,
      clientId,
      amount: amountPaid,
      currency: data.currency,
      status: "success",
      paidAt: data.paid_at ? new Date(data.paid_at) : Timestamp.now(),
      processedAt: Timestamp.now(),
    });
    tx.update(orderRef, {
      depositPaid,
      balanceDue,
      updatedAt: Timestamp.now(),
    });
  });

  logger.info(`Payment ${reference} credited to order ${orderId}`);
  return { status: "success", orderId };
}
