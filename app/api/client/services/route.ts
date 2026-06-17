import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: 'Product required' }, { status: 400 })

  const [client, product] = await Promise.all([
    prisma.client.findUnique({ where: { userId: session.user.id } }),
    prisma.product.findUnique({ where: { id: productId } }),
  ])

  if (!client || !product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const existing = await prisma.clientSubscription.findFirst({
    where: { clientId: client.id, productId, status: 'active' },
  })
  if (existing) return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })

  const subscription = await prisma.clientSubscription.create({
    data: {
      clientId: client.id,
      productId: product.id,
      monthlyPrice: product.monthlyPrice,
      status: 'pending_setup',
    },
  })

  return NextResponse.json(subscription, { status: 201 })
}
