import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function AdminPartners() {
  const partners = await prisma.partner.findMany({
    include: { user: true, _count: { select: { clients: true, commissions: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
      </div>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Slug</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Clients</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{p.user.name}</td>
                <td className="py-3 px-4 text-gray-500">{p.user.email}</td>
                <td className="py-3 px-4 text-brand-600 font-mono text-xs">{p.slug}</td>
                <td className="py-3 px-4">{p._count.clients}</td>
                <td className="py-3 px-4">
                  <span className={p.isActive ? 'badge-green' : 'badge-gray'}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400">{formatDate(p.createdAt)}</td>
                <td className="py-3 px-4">
                  <Link href={`/admin/partners/${p.id}`} className="text-brand-600 hover:underline text-xs">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-400">No partners yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
