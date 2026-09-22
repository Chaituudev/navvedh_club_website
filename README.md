# NavVedh — AITRC CSE Technical Club Platform (MongoDB Beta)

This is the MongoDB / Express / Next.js edition of the club platform.

## Stack

- Frontend: Next.js 16 + TypeScript + Tailwind CSS
- Backend: Express 5 + TypeScript
- Database: MongoDB / MongoDB Atlas
- Auth: bcrypt passwords + signed JWT session stored by the Next.js frontend in an HttpOnly cookie
- Deployment: frontend on Vercel, backend on Render, database on MongoDB Atlas
- Recommended runtime: Node.js 22.22.0

## Backend connection repair

If you previously saw `ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR`, read `BACKEND_FIX_README.md` first. The backend now includes `npm run db:check` and is pinned to Node 22.22.0 for Render.

## Local setup

### Backend

```bat
cd backend
copy .env.example .env
```

Set at minimum:

```env
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=CHANGE_THIS_TO_A_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
FRONTEND_URL=http://localhost:3000
```

Then run:

```bat
npm install
npm run db:check
npm run seed
npm run dev
```

Backend health check:

`http://localhost:4000/health`

### Frontend

Open a second terminal:

```bat
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000/setup`, then `/register`.

## Make the first admin

Register normally through the website. Then:

```bat
cd backend
npm run make-admin -- your-email@example.com
```

Sign out and use `/admin/login`.

## Main test flow

1. `/setup`
2. `/register`
3. `/profile`
4. `/events/department-hackathon-2026`
5. Register for the event
6. `/hackathons/department-hackathon-2026`
7. Create/join a team
8. Confirm roster
9. Select problem statement
10. Save a project draft
11. Final-submit
12. Promote an account to SUPER_ADMIN
13. Test `/admin/login`, `/admin/users`, `/admin/applications`, `/admin/contact-messages`, `/admin/communications`

Do not run the old Supabase migrations. This edition does not use Supabase.
