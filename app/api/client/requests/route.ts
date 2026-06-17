import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, description } = await req.json()
  if (!title || !description) return NextResponse.json({ error: 'Title and description required' }, { status: 400 })

  const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const request = await prisma.changeRequest.create({
    data: { clientId: client.id, title, description },
  })

  return NextResponse.json(request, { status: 201 })
}
