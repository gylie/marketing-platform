import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
import { sendEmail, partnerWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  const { name, email, password, company, phone } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

  const hashed = await bcrypt.hash(password, 12)
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let attempt = 0
  while (await prisma.partner.findUnique({ where: { slug } })) {
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: 'PARTNER',
      name,
      phone,
      partner: { create: { slug, company } },
    },
  })

  try {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`
    await sendEmail({ to: email, subject: 'Welcome to our Partner Program!', html: partnerWelcomeEmail(name, loginUrl) })
  } catch {}

  return NextResponse.json({ success: true }, { status: 201 })
}
