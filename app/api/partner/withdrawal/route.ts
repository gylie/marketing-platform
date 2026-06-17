import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { getPartnerBalance } from '@/lib/commission'
import { getSetting } from '@/lib/settings'
import { Decimal } from '@prisma/client/runtime/library'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'PARTNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { amount, paypalEmail } = await req.json()
  if (!amount || !paypalEmail) return NextResponse.json({ error: 'Amount and PayPal email required' }, { status: 400 })

  const partner = await prisma.partner.findUnique({ where: { userId: session.user.id } })
  if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 })

  const minWithdrawal = parseFloat((await getSetting('withdrawal_minimum')) || '250')
  const balance = await getPartnerBalance(partner.id)

  if (new Decimal(amount).gt(balance)) {
    return NextResponse.json({ error: 'Amount exceeds available balance' }, { status: 400 })
  }
  if (amount < minWithdrawal) {
    return NextResponse.json({ error: `Minimum withdrawal is $${minWithdrawal}` }, { status: 400 })
  }

  const pending = await prisma.withdrawalRequest.findFirst({
    where: { partnerId: partner.id, status: 'PENDING' },
  })
  if (pending) {
    return NextResponse.json({ error: 'You already have a pending withdrawal request' }, { status: 400 })
  }

  const withdrawal = await prisma.withdrawalRequest.create({
    data: { partnerId: partner.id, amount: new Decimal(amount), paypalEmail },
  })

  return NextResponse.json(withdrawal, { status: 201 })
}
