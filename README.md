# Marketing Services Platform

Full-stack Next.js 14 marketing platform with partner referral system, client portal, and admin dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: MySQL / MariaDB via Prisma ORM
- **Auth**: NextAuth.js (JWT + CredentialsProvider)
- **Email**: Resend or SMTP (configured via Admin panel)
- **Payments**: Stripe (keys stored AES-256 encrypted in DB)
- **File Storage**: Local (Hostinger `/public/uploads/partners/`)

---

## Local Development Setup

### 1. Install Node.js
Download from https://nodejs.org (v18+)

### 2. Install dependencies
```bash
cd marketing-platform
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/marketing_platform"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Your Agency Name"
```

### 4. Set up database
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Create admin account + system settings
```

### 5. Start dev server
```bash
npm run dev
```

Visit http://localhost:3000

**Default admin login**: `admin@yourdomain.com` / `Admin@123!`
(Change this immediately in production!)

---

## Hostinger Deployment

### 1. Create MySQL database
In Hostinger hPanel → Databases → MySQL Databases:
- Create database: `marketing_platform`
- Create user with all privileges
- Note the host (usually `localhost` on shared hosting, or an IP on VPS)

### 2. Upload files
Options:
- **FTP**: Upload the project via FileZilla to `/public_html/`
- **Git**: SSH into server and `git clone` your repo

### 3. Set up Node.js on Hostinger
In hPanel → Advanced → Node.js:
- Create Node.js app
- Application root: `public_html/marketing-platform` (or wherever you uploaded)
- Application URL: your domain
- Application startup file: `server.js` (auto-created by Hostinger)
- Node.js version: 18+

### 4. Install & build via SSH
```bash
ssh user@yourserver.com
cd public_html/marketing-platform
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run build
```

### 5. Set environment variables
In Hostinger Node.js app settings, add:
```
DATABASE_URL=mysql://user:password@localhost:3306/marketing_platform
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=Your Agency Name
```

### 6. Configure Stripe (after deploy)
Log in at `/admin` → Settings:
- **Stripe Publishable Key**: `pk_live_...`
- **Stripe Secret Key**: `sk_live_...`
- **Stripe Webhook Secret**: Set up in Stripe Dashboard → Webhooks
  - Endpoint URL: `https://yourdomain.com/api/webhook/stripe`
  - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 7. Configure Email
In Admin → Settings:
- **Email Provider**: `resend` or `smtp`
- If Resend: enter API key from resend.com
- If SMTP: enter Hostinger SMTP credentials:
  - Host: `mail.yourdomain.com`
  - Port: `587`
  - User: `noreply@yourdomain.com`
  - Password: your email password

---

## Project Structure

```
app/
  (public pages)
  page.tsx              — Homepage
  services/page.tsx     — Services listing
  about/page.tsx        — About page
  contact/page.tsx      — Contact form
  ref/[slug]/page.tsx   — Partner referral landing page

  login/page.tsx        — Login (all roles)
  register/
    partner/page.tsx    — Partner registration
    client/page.tsx     — Client registration

  admin/                — Admin portal (MASTER_ADMIN only)
    page.tsx            — Dashboard
    partners/           — Partner management
    clients/            — Client management
    products/           — Service/product management
    withdrawals/        — Withdrawal request management
    settings/           — App settings (Stripe, email, commissions)

  partner/              — Partner portal (PARTNER only)
    page.tsx            — Dashboard
    clients/            — View clients
    commissions/        — Earnings + withdrawal requests
    referrals/          — Referral link
    profile/            — Profile + photo upload

  client/               — Client portal (CLIENT only)
    page.tsx            — Dashboard
    services/           — Active services + add new
    requests/           — Change requests
    invoices/           — Payment history
    settings/           — Account settings

  api/
    auth/               — NextAuth endpoints
    register/           — Registration endpoints
    admin/              — Admin CRUD APIs
    partner/            — Partner APIs
    client/             — Client APIs
    webhook/stripe/     — Stripe payment webhook

lib/
  prisma.ts             — Prisma client singleton
  encryption.ts         — AES-256 encrypt/decrypt for DB secrets
  settings.ts           — SystemSetting CRUD with encryption
  commission.ts         — Commission calculation + balance
  email.ts              — Email sending via Resend or SMTP
  upload.ts             — Partner photo file upload
  auth.ts               — Session helpers + role protection
  utils.ts              — Formatting helpers, slug generation

prisma/
  schema.prisma         — Full DB schema
  seed.ts               — Admin account + default settings
```

---

## Commission System

- Rate: **25%** (configurable in Admin → Settings → `commission_rate`)
- Triggered: Server-side only via Stripe webhook `payment_intent.succeeded`
- Minimum withdrawal: **$250** (configurable via `withdrawal_minimum` setting)
- Withdrawal flow: Partner requests → Admin approves/marks paid → Email notification

## Referral System

- Each partner has a unique slug (e.g. `/ref/john-smith`)
- Visiting `/ref/[slug]` sets a 30-day cookie (`referral_slug`)
- Cookie is read during client registration and partner is assigned
- Partner is also assignable manually by admin

## Security Notes

- All Stripe/email keys are AES-256 encrypted in the database using `NEXTAUTH_SECRET`
- Passwords are bcrypt-hashed (cost factor 12)
- Commission creation is server-side only (webhook-triggered, never client-triggered)
- Route protection via NextAuth middleware + `requireRole()` in layouts
