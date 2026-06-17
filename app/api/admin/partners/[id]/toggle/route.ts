import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'MASTER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const partner = await prisma.partner.findUnique({ where: { id: params.id } })
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.partner.update({ where: { id: params.id }, data: { isActive: !partner.isActive } })
  return NextResponse.json({ success: true })
}
