import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { savePartnerPhoto, deletePartnerPhoto } from '@/lib/upload'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'PARTNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  })
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const formData = await req.formData()
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const bio = formData.get('bio') as string
  const company = formData.get('company') as string
  const website = formData.get('website') as string
  const paypalEmail = formData.get('paypalEmail') as string
  const photo = formData.get('photo') as File | null

  let photoUrl = partner.photoUrl

  if (photo && photo.size > 0) {
    if (photo.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Photo must be under 5MB' }, { status: 400 })
    }
    if (partner.photoUrl) await deletePartnerPhoto(partner.photoUrl)
    photoUrl = await savePartnerPhoto(photo)
  }

  await Promise.all([
    prisma.user.update({ where: { id: session.user.id }, data: { name, phone } }),
    prisma.partner.update({
      where: { userId: session.user.id },
      data: { bio, company, website, paypalEmail, photoUrl },
    }),
  ])

  return NextResponse.json({ success: true, photoUrl })
}
