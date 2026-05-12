# ExamGuard

ExamGuard is an online coding exam and proctoring platform.

## Project Structure

- `client/` - Next.js frontend (exam UI, recruiter pages, editor, proctoring UI)
- `server/` - Node.js backend API (exam, submission, proctoring, realtime endpoints)
- `Backend/` - legacy/extra backend snapshot (keep separate from active `server/`)

## Run Locally

### 1) Backend

Create `server/.env` with at least:

- `DATABASE_URL` — PostgreSQL connection string for Prisma
- `JWT_SECRET` — long random string for signing cookies

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

API listens on **`http://localhost:5000`** by default (`PORT` optional).

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on **`http://localhost:3000`**. The dev script reserves extra heap for Next.js on Windows (helps avoid “Array buffer allocation failed” during compile).

### 3) Recruiter dashboard

1. Register a user with role **`RECRUITER`** (`POST /api/v1/auth/register` with `"role": "RECRUITER"`).
2. Open **`/recruiter`**, log in, then pick an exam you created (or open **`/recruiter?examId=<uuid>`**).

## Notes

- Use `server/` as the active backend to avoid confusion with `Backend/`.
- If you no longer need `Backend/`, archive or remove it in a dedicated cleanup commit.
