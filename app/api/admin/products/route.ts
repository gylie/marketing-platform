import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'MASTER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, description, monthlyPrice, setupFee, features } = await req.json()
  if (!name || !monthlyPrice) return NextResponse.json({ error: 'Name and price required' }, { status: 400 })

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      monthlyPrice: parseFloat(monthlyPrice),
      setupFee: parseFloat(setupFee || '0'),
      features: features || null,
    },
  })

  return NextResponse.json(product, { status: 201 })
}
