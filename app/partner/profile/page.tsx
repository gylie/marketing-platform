import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function PartnerProfile() {
  const session = await getSession()
  if (!session) redirect('/login')

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  })
  if (!partner) redirect('/login')

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      <ProfileForm
        initialData={{
          name: partner.user.name,
          phone: partner.user.phone || '',
          bio: partner.bio || '',
          company: partner.company || '',
          website: partner.website || '',
          paypalEmail: partner.paypalEmail || '',
          photoUrl: partner.photoUrl || '',
        }}
      />
    </div>
  )
}
