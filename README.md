# AromaFlame Candles

Online shop for AromaFlame Candles — handmade soy wax flower bouquets.

## Features

- Storefront with product catalogue, occasion filter, photo gallery and cart
- Order form (cash on delivery) that saves orders to the database
- Admin area at `/admin` for managing orders and products, including
  multi-photo upload with in-browser image compression
- Site content in Bulgarian, prices in EUR

## Stack

- React 19, TypeScript, Vite, Tailwind CSS 4
- Supabase for the database, photo storage and admin login
- Hosted on Vercel

## Development

```bash
npm install
npm run dev
```

The site runs at http://localhost:5173.

Other scripts: `npm run build` (type-check and production build),
`npm run lint`.

## Database setup

Run [`supabase/setup.sql`](supabase/setup.sql) in the Supabase SQL Editor. It
creates the tables, row level security rules and the photo bucket, and is safe
to run more than once. Visitors can only read active products and place new
orders; everything else requires an admin login.

The Supabase URL and publishable key in `src/lib/supabase.ts` are public by
design. They can be overridden with `VITE_SUPABASE_URL` and
`VITE_SUPABASE_KEY`.
