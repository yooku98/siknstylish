# Sik n Stylish

Website and client portal for Sik n Stylish, a bespoke fashion house in Accra, Ghana (evening wear, office wear, bridal, menswear and beaded pieces).

**Live site:** https://siknstylish.com/

## Features

- **Marketing site:** home, about, portfolio (collections + per-item pages with a lightbox), process timeline, testimonials, FAQ, measurements guide. Includes SEO metadata, `sitemap.xml` and `robots.txt`
- **Booking and contact forms:** sent through [Web3Forms](https://web3forms.com), so no form backend is needed
- **Client portal** (`/portal`): Firebase Auth sign-in; clients save their measurements and track their orders
- **Admin** (`/admin`): staff-only management of bookings, orders and portfolio items
- **Payments (scaffold, not live):** Paystack Cloud Functions in `functions/`. See [`functions/README.md`](functions/README.md) for status and activation steps
- WhatsApp floating contact button

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 · Firebase (Auth, Firestore, Storage, Cloud Functions)

## Structure

```
app/                 Routes (App Router): about, book, contact, faq, measurements,
                     portal, admin, portfolio/[slug], process, testimonials
components/          Grouped by feature (admin, booking, portal, portfolio, layout, ui, ...)
lib/                 Content data (collections, faq, process, testimonials), Firebase
                     client, Firestore helpers (orders, bookings, measurements), SEO config
functions/           Firebase Cloud Functions (Paystack scaffold)
firestore.rules      Firestore security rules (owner-scoped user data, staff role)
storage.rules        Storage security rules
scripts/set-staff-claim.mjs   Grants/revokes the `staff` custom claim
public/CNAME         Custom domain for GitHub Pages
```

## Run locally

```bash
cp .env.example .env.local   # fill in the Web3Forms key and Firebase web config
npm install
npm run dev                  # http://localhost:3000
```

## Staff access

Admin access comes from a Firebase custom claim (`role: "staff"`), which can't be set from the Firebase console:

```bash
npm run grant-staff -- someone@example.com [path-to-service-account.json]
npm run revoke-staff -- someone@example.com
```

Keep service-account keys in `secrets/`, which is gitignored. Never commit them.

## Deployment

- **Site:** `.github/workflows/deploy.yml` runs `next build` (`output: "export"`) on push to `main` and publishes `out/` to GitHub Pages. The `NEXT_PUBLIC_*` values come from repository secrets.
- **Firestore rules and functions:** `firebase deploy --only firestore:rules` / `firebase deploy --only functions`. The project is set in `.firebaserc`.
- **Storage rules:** `storage.rules` isn't listed in `firebase.json` yet, so the CLI won't deploy it. Add a `"storage": {"rules": "storage.rules"}` entry first, or publish the rules from the Firebase console.
