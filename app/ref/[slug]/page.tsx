import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import PartnerReferralCard from './PartnerReferralCard'

export default async function ReferralPage({ params }: { params: { slug: string } }) {
  const partner = await prisma.partner.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { user: true },
  })
  if (!partner) notFound()

  cookies().set('referral_slug', params.slug, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false,
    sameSite: 'lax',
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <PartnerReferralCard
        name={partner.user.name}
        company={partner.company || ''}
        bio={partner.bio || ''}
        photoUrl={partner.photoUrl || ''}
        slug={params.slug}
      />
    </div>
  )
}
