import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ReferralCard from './ReferralCard'

export default async function PartnerReferrals() {
  const session = await getSession()
  if (!session) redirect('/login')

  const partner = await prisma.partner.findUnique({ where: { userId: session.user.id } })
  if (!partner) redirect('/login')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const referralUrl = `${appUrl}/ref/${partner.slug}`

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Referral Link</h1>
      <ReferralCard referralUrl={referralUrl} slug={partner.slug} />
      <div className="card p-6 mt-6">
        <h2 className="font-semibold text-gray-900 mb-2">How it works</h2>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>Share your unique referral link with potential clients</li>
          <li>When they sign up and subscribe to services, you earn 25% commission</li>
          <li>Commission is credited when their payment is confirmed</li>
          <li>Request withdrawals once you reach the $250 minimum balance</li>
        </ol>
      </div>
    </div>
  )
}
