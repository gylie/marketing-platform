import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { sendEmail, withdrawalApprovedEmail, withdrawalRejectedEmail } from '@/lib/email'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'MASTER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status, adminNote } = await req.json()
  const withdrawal = await prisma.withdrawalRequest.update({
    where: { id: params.id },
    data: { status, adminNote, processedAt: new Date() },
    include: { partner: { include: { user: true } } },
  })

  try {
    const name = withdrawal.partner.user.name
    const amount = withdrawal.amount.toString()
    const email = withdrawal.partner.user.email
    if (status === 'APPROVED' || status === 'PAID') {
      await sendEmail({ to: email, subject: 'Withdrawal Approved', html: withdrawalApprovedEmail(name, amount) })
    } else if (status === 'REJECTED') {
      await sendEmail({ to: email, subject: 'Withdrawal Update', html: withdrawalRejectedEmail(name, amount, adminNote || '') })
    }
  } catch { /* email failure shouldn't block the response */ }

  return NextResponse.json(withdrawal)
}
