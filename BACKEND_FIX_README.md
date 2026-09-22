# Backend TLS / MongoDB Atlas repair

This revision hardens the MongoDB backend after the Windows/Node error:

`ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR` / `SSL alert number 80`

## What changed

- Render and the repository are pinned to Node.js `22.22.0`.
- Atlas/SRV connections use an authenticated TLS 1.2 compatibility context by default.
- Certificate and hostname verification remain enabled. No insecure TLS flags are used.
- MongoDB connections now use bounded timeouts, a small pool, IPv4 preference, retry attempts, and an explicit ping.
- Startup errors are classified (TLS / DNS / auth / network / URI) instead of surfacing as an uncaught stack trace.
- `npm run db:check` tests SRV DNS, TCP reachability, TLS, then the MongoDB driver/authentication.
- `/health` reports whether MongoDB is actually connected.
- `seed` and `make-admin` now close MongoDB cleanly and print useful failures.

## Do this first on Windows

The failing log was running Node `24.14.0`. Use Node `22.22.0` for this project while debugging Atlas.

If you already have nvm-windows:

```bat
nvm install 22.22.0
nvm use 22.22.0
node -v
```

The last command should print `v22.22.0`.

Then reinstall backend dependencies:

```bat
cd backend
rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm install
```

## Atlas setup checklist

1. Atlas -> Database Access: create a **database user**.
2. Atlas -> Network Access: add your current public IP for local development.
3. Atlas -> Connect -> Drivers -> Node.js: copy a fresh connection string.
4. Put that exact string in `backend/.env` as `MONGODB_URI`.
5. Replace `<db_password>` with the database-user password.
6. If the password contains reserved URI characters, URL-encode the password.

Do not use your Atlas website/account password unless it is also intentionally the database user's password.

## Diagnose before starting the API

```bat
npm run db:check
```

A healthy Atlas connection ends with:

```text
[db:check] TCP: OK
[db:check] TLS: OK
[db:check] MongoDB ping: OK
[db:check] PASS: database connection is healthy.
```

Only after that succeeds, run:

```bat
npm run seed
npm run dev
```

Then open `http://localhost:4000/health`.

## If SRV/DNS fails

Atlas can provide a standard `mongodb://` connection string as an alternative to `mongodb+srv://`. Use the standard string if your local DNS/network has trouble with SRV records.

## If TCP fails

The network is blocking MongoDB before TLS/authentication. Check Atlas Network Access and outbound TCP port `27017`. Campus Wi-Fi, VPNs, firewalls and some ISP/security products can block it.

## If TLS still fails on Node 22

Try a different network (for example your mobile hotspot) and run `npm run db:check` again. If TCP succeeds but TLS fails on multiple networks, copy a fresh Atlas connection string and inspect Atlas cluster/network settings.

Do **not** set `tlsInsecure=true`, `tlsAllowInvalidCertificates=true`, or disable TLS verification. Those options hide the symptom by weakening security.

## If authentication fails

That is a different error from TLS. Check the Atlas database username/password and URL-encode reserved password characters such as `@`, `:`, `/`, `?`, `#`, `[`, `]`, and `%`.
