# QA report — MongoDB backend TLS repair

## Fixed in this revision

- Backend runtime pinned to Node.js 22.22.0 in `.node-version`, `.nvmrc`, `package.json`, and `render.yaml`.
- MongoDB startup no longer uses an unguarded top-level connection that produces a raw uncaught exception.
- Connection retries, bounded timeouts, IPv4 preference, a small connection pool and explicit database ping added.
- Atlas SRV connections support authenticated TLS 1.2 compatibility mode by default.
- TLS certificate/hostname verification remains enabled.
- `/health` reports actual database connectivity.
- `npm run db:check` added for DNS/SRV -> TCP -> TLS -> MongoDB/auth diagnosis.
- MongoDB errors classified into TLS, DNS, network, authentication, URI and timeout categories.
- Seed and admin-promotion scripts close MongoDB connections cleanly and report failures.
- Atlas/local/Render instructions updated.

## Static validation

The source was parsed after the repair:

- Backend TypeScript source files: 35
- Frontend TypeScript/TSX source files: 82
- TypeScript parser syntax diagnostics: 0
- Missing backend relative imports: 0
- package.json JSON validation: passed

A dependency-backed `npm install` could not complete in the build environment because outbound npm access timed out, so a full `tsc`/production build could not be truthfully certified here.

## First local test

```bat
cd backend
node -v
npm install
npm run db:check
```

Use Node 22.22.0. Do not start the API until `db:check` passes.
