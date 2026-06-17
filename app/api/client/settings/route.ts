import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, phone, company, address, city, state, zip } = await req.json()

  await Promise.all([
    prisma.user.update({ where: { id: session.user.id }, data: { name, phone } }),
    prisma.client.update({ where: { userId: session.user.id }, data: { company, address, city, state, zip } }),
  ])

  return NextResponse.json({ success: true })
}
