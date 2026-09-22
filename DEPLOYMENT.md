# Deployment: Vercel + Render + MongoDB Atlas

## MongoDB Atlas

Create an Atlas cluster and database user first.

For local development, allow your current public IP in Atlas Network Access.

For Render deployment, open the Render service -> **Connect -> Outbound** and copy the listed outbound CIDR ranges. Add those ranges to Atlas Network Access. This is preferable to `0.0.0.0/0`.

Copy Atlas's Node.js driver connection string and save it in Render as `MONGODB_URI`.

## Render backend

This repository pins Render to Node.js `22.22.0` in `render.yaml` and `.node-version`.

Deploy the `backend` directory as a Node web service, or use `render.yaml`.

Required environment variables:

- `NODE_ENV=production`
- `NODE_VERSION=22.22.0`
- `MONGODB_URI`
- `JWT_SECRET` (at least 32 random characters)
- `FRONTEND_URL=https://YOUR-FRONTEND.vercel.app`

Database defaults included in the app:

- `MONGODB_FORCE_TLS12=true`
- `MONGODB_CONNECT_TIMEOUT_MS=15000`
- `MONGODB_SERVER_SELECTION_TIMEOUT_MS=15000`
- `MONGODB_MAX_POOL_SIZE=10`
- `DB_CONNECT_RETRIES=3`

Optional:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

Health URL:

`https://YOUR-API.onrender.com/health`

A successful response reports `ok: true` and `database: connected`.

## Vercel frontend

Import the repository and set Root Directory to `frontend`.

Environment variables:

- `API_URL=https://YOUR-API.onrender.com`
- `NEXT_PUBLIC_API_URL=https://YOUR-API.onrender.com`
- `NEXT_PUBLIC_SITE_URL=https://YOUR-FRONTEND.vercel.app`

Redeploy after changing environment variables.

## First admin

Register the account on the deployed frontend. To promote it, run the local backend against the same Atlas database:

```bat
npm run make-admin -- your-email@example.com
```

Do not commit production `.env` files or MongoDB credentials.
