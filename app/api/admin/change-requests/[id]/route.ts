import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { sendEmail, changeRequestUpdateEmail } from '@/lib/email'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'MASTER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status, adminNote } = await req.json()
  const request = await prisma.changeRequest.update({
    where: { id: params.id },
    data: { status, adminNote },
    include: { client: { include: { user: true } } },
  })

  try {
    await sendEmail({
      to: request.client.user.email,
      subject: `Request Update: ${request.title}`,
      html: changeRequestUpdateEmail(request.client.user.name, request.title, status),
    })
  } catch {}

  return NextResponse.json(request)
}
