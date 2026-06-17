import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const partner = await prisma.partner.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { user: true },
  })
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ name: partner.user.name, company: partner.company, bio: partner.bio, photoUrl: partner.photoUrl })
}
