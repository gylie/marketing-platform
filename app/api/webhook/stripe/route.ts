import { NextResponse } from 'next/server'
import { getSetting } from '@/lib/settings'
import { prisma } from '@/lib/prisma'
import { createCommission } from '@/lib/commission'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  const webhookSecret = await getSetting('stripe_webhook_secret')
  if (!webhookSecret) return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })

  let event: any
  try {
    const stripe = await import('stripe')
    const Stripe = stripe.default
    const stripeSecretKey = await getSetting('stripe_secret_key')
    const stripeInstance = new Stripe(stripeSecretKey, { apiVersion: '2024-04-10' as any })
    event = stripeInstance.webhooks.constructEvent(body, sig!, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentId: pi.id },
    })
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PAID', paidAt: new Date() },
      })
      await createCommission(payment.id)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object
    await prisma.payment.updateMany({
      where: { stripePaymentId: pi.id },
      data: { status: 'FAILED' },
    })
  }

  return NextResponse.json({ received: true })
}
