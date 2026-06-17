import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ClientSettingsForm from './ClientSettingsForm'

export default async function ClientSettings() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
  if (!user || !client) redirect('/login')

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
      <ClientSettingsForm initialData={{ name: user.name, phone: user.phone || '', company: client.company || '', address: client.address || '', city: client.city || '', state: client.state || '', zip: client.zip || '' }} />
    </div>
  )
}
