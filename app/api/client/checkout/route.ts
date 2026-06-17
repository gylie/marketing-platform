import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'CLIENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { amount, description } = await req.json()
  if (!amount) return NextResponse.json({ error: 'Amount required' }, { status: 400 })

  const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const stripeSecretKey = await getSetting('stripe_secret_key')
  if (!stripeSecretKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })

  const stripeModule = await import('stripe')
  const Stripe = stripeModule.default
  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' as any })

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(parseFloat(amount) * 100),
    currency: 'usd',
    metadata: { clientId: client.id },
  })

  const payment = await prisma.payment.create({
    data: {
      clientId: client.id,
      amount: parseFloat(amount),
      description: description || 'Service payment',
      stripePaymentId: paymentIntent.id,
      status: 'PENDING',
    },
  })

  const publishableKey = await getSetting('stripe_publishable_key')
  return NextResponse.json({ clientSecret: paymentIntent.client_secret, publishableKey, paymentId: payment.id })
}
