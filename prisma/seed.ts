import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@yourdomain.com' },
    update: {},
    create: {
      email: 'admin@yourdomain.com',
      password: hashedPassword,
      role: Role.MASTER_ADMIN,
      name: 'Admin',
    },
  })
  console.log('Admin created:', admin.email)

  const settings = [
    { key: 'stripe_publishable_key', value: '', encrypted: false, label: 'Stripe Publishable Key', group: 'stripe' },
    { key: 'stripe_secret_key', value: '', encrypted: true, label: 'Stripe Secret Key', group: 'stripe' },
    { key: 'stripe_webhook_secret', value: '', encrypted: true, label: 'Stripe Webhook Secret', group: 'stripe' },
    { key: 'email_provider', value: 'resend', encrypted: false, label: 'Email Provider (resend|smtp)', group: 'email' },
    { key: 'resend_api_key', value: '', encrypted: true, label: 'Resend API Key', group: 'email' },
    { key: 'smtp_host', value: '', encrypted: false, label: 'SMTP Host', group: 'email' },
    { key: 'smtp_port', value: '587', encrypted: false, label: 'SMTP Port', group: 'email' },
    { key: 'smtp_user', value: '', encrypted: false, label: 'SMTP Username', group: 'email' },
    { key: 'smtp_password', value: '', encrypted: true, label: 'SMTP Password', group: 'email' },
    { key: 'email_from', value: 'noreply@yourdomain.com', encrypted: false, label: 'From Email Address', group: 'email' },
    { key: 'commission_rate', value: '0.25', encrypted: false, label: 'Commission Rate (0.25 = 25%)', group: 'general' },
    { key: 'withdrawal_minimum', value: '250', encrypted: false, label: 'Minimum Withdrawal Amount ($)', group: 'general' },
  ]

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log('System settings seeded.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
