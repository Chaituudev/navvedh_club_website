# Architecture

Browser → Next.js frontend (Vercel) → Express API (Render) → MongoDB Atlas.

Authentication uses email/password stored as bcrypt hashes in MongoDB. The API returns a signed JWT; Next.js stores it in a first-party HttpOnly cookie and forwards it to the API from server actions/server components.

This avoids cross-site authentication cookies between Vercel and Render and removes the previous Supabase dependency.
