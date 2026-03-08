# Bootcamp QR Attendance

A single Next.js + Supabase app for:

- participant signup/login
- profile collection
- QR code generation
- admin scanner
- daily attendance tracking
- CSV export
- responsive UI for mobile and desktop

## Event

**Business Development and Brand Building Bootcamp for First-Time Founders**

Configured event days:

- 2026-03-10
- 2026-03-11
- 2026-03-12
- 2026-03-13
- 2026-03-14

Change the dates in:

- `lib/constants.ts`
- `supabase/schema.sql`

---

## 1) Fix Node PATH on Windows

If `node -v` does not work:

### Option A
Re-run the Node installer and tick **Add to PATH**.

### Option B
Add this path to System Environment Variables manually:

```text
C:\Program Files\nodejs\
```

Then close and reopen terminal.

Test:

```bash
node -v
npm -v
```

---

## 2) Download tools

Install:

- Node.js LTS
- Git
- VS Code

---

## 3) Project folder

Unzip this folder and open it in VS Code.

```text
bootcamp-qr-attendance
```

---

## 4) Install packages

Inside the project root:

```bash
npm install
```

---

## 5) Create Supabase project

1. Create a new Supabase project
2. Open **SQL Editor**
3. Paste and run the full file from:

```text
supabase/schema.sql
```

---

## 6) Add environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

You can copy `.env.example` and rename it to `.env.local`.

---

## 7) Optional but recommended auth setting

In Supabase dashboard:

- Authentication
- Providers / Email settings

Turn **Confirm Email** off for faster event registration flow.

---

## 8) Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 9) Create an admin user

1. Sign up once through the app with your admin email
2. Then go to Supabase SQL Editor and run:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

3. Log out and log back in

Now the admin pages will work.

---

## 10) Pages

### Public
- `/`
- `/login`
- `/signup`

### Participant
- `/participant/dashboard`
- `/participant/profile`
- `/participant/qr`

### Admin
- `/admin/dashboard`
- `/admin/scanner`
- `/admin/attendance`
- `/admin/participants`

---

## 11) QR design

The QR does **not** store all raw personal data.

It stores a JSON payload like:

```json
{
  "qrToken": "unique-random-token"
}
```

The admin scanner uses that token to fetch the participant from Supabase and mark attendance.

This is safer and scans faster than storing all personal data inside the QR.

---

## 12) Deploy to Vercel

### Option A: GitHub + Vercel dashboard
1. Push project to GitHub
2. Import repo in Vercel
3. Add the same two env vars
4. Deploy

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Then add env vars in Vercel dashboard and redeploy.

---

## 13) Test checklist

- signup works
- login works
- participant profile saves
- participant QR shows
- admin scanner marks attendance
- duplicate attendance on same day is blocked
- attendance table filters by day
- CSV export downloads
- mobile layout does not overflow horizontally

---

## 14) Main files to read first

- `supabase/schema.sql`
- `lib/constants.ts`
- `app/(auth)/signup/page.tsx`
- `app/participant/qr/page.tsx`
- `app/admin/scanner/page.tsx`
- `app/api/mark-attendance/route.ts`
