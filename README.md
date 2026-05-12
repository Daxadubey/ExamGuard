# ExamGuard

ExamGuard is an online coding exam and proctoring platform.

## Project Structure

- `client/` - Next.js frontend (exam UI, recruiter pages, editor, proctoring UI)
- `server/` - Node.js backend API (exam, submission, proctoring, realtime endpoints)
- `Backend/` - legacy/extra backend snapshot (keep separate from active `server/`)

## Run Locally

### 1) Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### 2) Backend

```bash
cd server
npm install
npm run dev
```

## Notes

- Use `server/` as the active backend to avoid confusion with `Backend/`.
- If you no longer need `Backend/`, archive or remove it in a dedicated cleanup commit.
