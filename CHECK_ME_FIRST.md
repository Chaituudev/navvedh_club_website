# Check this build first

## 1. Runtime

Use Node.js 22.22.0 for the backend.

```bat
node -v
```

If you use nvm-windows:

```bat
nvm install 22.22.0
nvm use 22.22.0
```

## 2. Atlas

Before starting the backend:

- Create an Atlas database user.
- Add your current public IP in Atlas Network Access.
- Copy the Atlas Drivers connection string into `backend/.env`.
- URL-encode reserved characters in the database password.

## 3. Run database diagnostics

```bat
cd backend
npm install
npm run db:check
```

Do not continue until `db:check` reaches `PASS`.

## 4. Seed + start backend

```bat
npm run seed
npm run dev
```

Open `http://localhost:4000/health`. It should report `database: connected`.

## 5. Start frontend

```bat
cd ..\frontend
copy .env.example .env.local
npm install
npm run dev
```

Open `/setup`, then test register/login/profile and the event flow.

If the database check fails, send the complete output of `npm run db:check`. It intentionally does not print your MongoDB password.
