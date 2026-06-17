import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendEmail, clientWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  const { name, email, password, company, phone, referralSlug } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

  let partnerId: string | undefined
  if (referralSlug) {
    const partner = await prisma.partner.findUnique({ where: { slug: referralSlug, isActive: true } })
    if (partner) partnerId = partner.id
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: 'CLIENT',
      name,
      phone,
      client: { create: { company, partnerId } },
    },
  })

  try {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`
    await sendEmail({ to: email, subject: 'Welcome!', html: clientWelcomeEmail(name, loginUrl) })
  } catch {}

  return NextResponse.json({ success: true }, { status: 201 })
}
