# MediCare — Pharmacy Website Template

A complete, ultra-clean website + automation kit for local pharmacies and medical stores in India. Built for **Patna** first; reusable for any Tier 2/3 city. No build step. No backend required to start. Deploy on GitHub Pages in 60 seconds.

## Live
After you enable Pages (Settings → Pages → `main` / root), the site is at:
`https://devpilotx.github.io/medicare-pharmacy-template/`

## What's included
- 8 pages: Home, Medicines, Prescription, Delivery, About, Contact, Cart, 404
- Admin dashboard: orders, inventory, refills, customers, revenue chart
- Customer account page with order history
- **Hindi / English language toggle** in the nav
- **Dark mode** (light / dark / auto) with `prefers-color-scheme` support
- **PWA**: installable on phones, offline shell
- **SEO**: per-page meta, sitemap, robots, OG image
- **WhatsApp ordering** end-to-end
- **Razorpay / UPI payments** (optional)
- **Supabase backend** (optional) for cross-device orders + customer accounts
- 41-medicine sample catalog across 8 categories

## Pages
| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero + quick order + best sellers + reviews |
| Medicines | `medicines.html` | Catalog with search, categories, sort, add to cart |
| Prescription | `prescription.html` | Upload + 3-step flow + FAQ |
| Delivery | `delivery.html` | Features + areas + order tracking + FAQ |
| About | `about.html` | Story + values + licensing |
| Contact | `contact.html` | Map + form + directions |
| Cart | `cart.html` | Cart + checkout (WhatsApp or Razorpay) |
| **Admin** | `admin.html` | Dashboard (login: `admin123`) |
| **Account** | `account.html` | Customer sign-in + order history |
| 404 | `404.html` | Friendly not found |

## Customise for a client
Edit `PHARMACY_CONFIG` at the top of `script.js` (or copy `config.example.js` into the HTML before `script.js`):
```js
window.PHARMACY_CONFIG = {
  name: 'Sharma Medical Store',
  short: 'Sharma',
  whatsapp: '919999988888',     // country code + number, no + or spaces
  phone: '+91 99999 88888',
  email: 'orders@sharmamedical.in',
  address: 'Shop 14, Kankarbagh Main Road, Patna 800020',
  hours: '7 AM – 11 PM · Open 7 days',
  maps: 'https://www.google.com/maps?q=Kankarbagh+Patna&output=embed',
  license: 'DL No. BR-67890/CD · GSTIN 10ZYXWV5678G2H1',
  adminPassword: 'a-strong-password'
};
```

## Enable Razorpay / UPI online payments
1. Create a Razorpay account: https://dashboard.razorpay.com
2. Copy your **Key ID** (test or live).
3. Add to your config:
   ```js
   window.RAZORPAY_CONFIG = { enabled: true, keyId: 'rzp_test_XXXXX', createOrderUrl: '' };
   ```
4. For **production**, you must add a tiny server endpoint that calls Razorpay's Orders API and returns `{ id, amount, currency }`. Point `createOrderUrl` at it. (Deploy as a Cloudflare/Vercel/Netlify function; ~10 lines.) Without this, only test mode works.
5. Once enabled, the cart shows a **Pay online** option that opens Razorpay's UPI / Card / Netbanking sheet.

## Enable Supabase backend (cross-device + customer accounts)
Without this, orders live in browser localStorage (great for a demo, single-device).
1. Create a free project: https://supabase.com
2. Copy the URL + anon key into your config:
   ```js
   window.BACKEND_CONFIG = { enabled: true, supabaseUrl: '...', supabaseAnonKey: '...' };
   ```
3. Run this SQL in the Supabase SQL editor:
   ```sql
   create table public.orders (
     id bigserial primary key,
     order_id text unique not null,
     customer_name text not null,
     customer_phone text not null,
     customer_address text,
     items jsonb not null,
     total numeric not null,
     payment text,
     payment_id text,
     status text default 'Pending',
     created_at timestamptz default now()
   );
   create table public.refills (
     id text primary key,
     customer text not null,
     phone text not null,
     medicine text not null,
     next_date date not null,
     notes text,
     created_at timestamptz default now()
   );
   alter table public.orders enable row level security;
   alter table public.refills enable row level security;
   create policy "public insert orders" on public.orders for insert to anon with check (true);
   create policy "public read own orders" on public.orders for select to anon using (true);
   create policy "public read refills" on public.refills for select to anon using (true);
   ```
4. Customer sign-up / sign-in now uses real Supabase Auth on `account.html`.

## Admin dashboard
- Visit `admin.html`, password `admin123` (change it in `PHARMACY_CONFIG.adminPassword`).
- Tabs: **Overview** (KPIs + 7-day revenue chart), **Orders** (filter, change status, WhatsApp customer), **Inventory** (add / edit / delete medicines), **Refills** (schedule + 1-click WhatsApp reminder), **Customers** (lifetime spend, last order).
- Demo data seeds automatically on first visit.

## Tech
- Vanilla HTML / CSS / JS. No frameworks. No build.
- PWA: `manifest.json` + `sw.js` (offline shell cache `medicare-v1`).
- Service Worker registers automatically.
- Cart, theme, language, orders, inventory, refills persist via `localStorage`.

## File layout
```
index.html  medicines.html  prescription.html  delivery.html
about.html  contact.html    cart.html          404.html
admin.html  account.html
script.js   pages.js  admin.js  account.js  backend.js  payment.js
styles.css  manifest.json  sw.js  robots.txt  sitemap.xml
config.example.js
assets/medicines.json  assets/favicon.svg  assets/icon-192.svg
assets/icon-512.svg    assets/og-image.svg
```

## License
MIT — use it for any client.
