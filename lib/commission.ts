import { prisma } from './prisma'
import { getSetting } from './settings'
import { Decimal } from '@prisma/client/runtime/library'

export async function createCommission(paymentId: string): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { client: { include: { partner: true } } },
  })

  if (!payment || payment.status !== 'PAID') return
  if (!payment.client.partnerId) return

  const existingCommission = await prisma.commission.findUnique({ where: { paymentId } })
  if (existingCommission) return

  const rateStr = await getSetting('commission_rate')
  const rate = parseFloat(rateStr || '0.25')
  const amount = new Decimal(payment.amount).mul(rate).toDecimalPlaces(2)

  await prisma.commission.create({
    data: {
      partnerId: payment.client.partnerId,
      paymentId: payment.id,
      amount,
      rate: new Decimal(rate),
    },
  })
}

export async function getPartnerBalance(partnerId: string): Promise<Decimal> {
  const [earned, withdrawn] = await Promise.all([
    prisma.commission.aggregate({
      where: { partnerId },
      _sum: { amount: true },
    }),
    prisma.withdrawalRequest.aggregate({
      where: { partnerId, status: { in: ['APPROVED', 'PAID'] } },
      _sum: { amount: true },
    }),
  ])

  const totalEarned = earned._sum.amount ?? new Decimal(0)
  const totalWithdrawn = withdrawn._sum.amount ?? new Decimal(0)
  return new Decimal(totalEarned).sub(totalWithdrawn)
}
