import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminClients() {
  const clients = await prisma.client.findMany({
    include: {
      user: true,
      partner: { include: { user: true } },
      _count: { select: { subscriptions: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Clients</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Partner</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Services</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{c.user.name}</td>
                <td className="py-3 px-4 text-gray-500">{c.user.email}</td>
                <td className="py-3 px-4 text-gray-500">{c.partner?.user.name || 'Direct'}</td>
                <td className="py-3 px-4">{c._count.subscriptions}</td>
                <td className="py-3 px-4">
                  <span className={c.isActive ? 'badge-green' : 'badge-gray'}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400">{formatDate(c.createdAt)}</td>
                <td className="py-3 px-4">
                  <Link href={`/admin/clients/${c.id}`} className="text-brand-600 hover:underline text-xs">View</Link>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-400">No clients yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
