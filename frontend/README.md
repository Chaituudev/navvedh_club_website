# NavVedh Club Frontend

Next.js 16 frontend for the AITRC CSE technical-club platform.

This edition uses the Express API in `../backend` and MongoDB. There is no Supabase runtime dependency.

## Local environment

Copy `.env.example` to `.env.local`:

```env
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then:

```bash
npm install
npm run dev
```

Open `http://localhost:3000/setup` first.
