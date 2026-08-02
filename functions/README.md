# Cloud Functions

Scaffolded ahead of Paystack account approval — **untested against the real
Paystack API**, since no live keys exist yet. Typechecks and compiles clean;
the logic follows Paystack's documented Standard (hosted-checkout) integration
and their webhook signature-verification requirements, but hasn't been
exercised end-to-end the way the rest of this project's features were.

## What's here

- `initializePaystackTransaction` (callable) — client calls this with an
  `orderId` to start a payment. Verifies the caller owns that order and that
  it has a balance due server-side (never trusts client-supplied amounts
  beyond capping to `balanceDue`), then asks Paystack to open a hosted
  checkout transaction and returns the URL to redirect to.
- `verifyPaystackTransaction` (callable) — client calls this after returning
  from Paystack's checkout, for immediate UI feedback.
- `paystackWebhook` (HTTP) — Paystack's server-to-server notification. This
  is the reliable path (doesn't depend on the client's browser staying open),
  and is what should actually be trusted as the source of truth.

Both the callable verify and the webhook funnel through the same
`processVerifiedPayment` in `src/paystack.ts`, which always re-confirms with
Paystack's live `/transaction/verify` endpoint rather than trusting whatever
triggered it, and is idempotent (keyed by `reference` as the `payments/{ref}`
doc ID) so a race between the two can't double-credit an order.

## To activate once the account is approved

1. Get the live secret key from the Paystack dashboard.
2. `firebase functions:secrets:set PAYSTACK_SECRET_KEY` (paste the secret key
   when prompted — never commit it).
3. `cd functions && npm run build && firebase deploy --only functions`.
4. In the Paystack dashboard, add a webhook pointing at the deployed
   `paystackWebhook` URL (shown in the deploy output / Firebase console).
5. **Not built yet:** the client-side "Pay Now" button in the portal and the
   `?reference=` callback handling on return from checkout. That's the
   natural next step once functions are actually deployable and testable —
   deliberately left out of this scaffold to keep it scoped to the backend.

## Local type checking without deploying

```
cd functions
npm install
npm run build
```
