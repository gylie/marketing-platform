import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getPartnerBalance } from '@/lib/commission'
import TogglePartnerStatus from './TogglePartnerStatus'

export default async function AdminPartnerDetail({ params }: { params: { id: string } }) {
  const partner = await prisma.partner.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      clients: { include: { user: true, subscriptions: { include: { product: true } } } },
      commissions: { include: { payment: true }, orderBy: { createdAt: 'desc' }, take: 10 },
      withdrawals: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })

  if (!partner) notFound()

  const balance = await getPartnerBalance(partner.id)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        {partner.photoUrl && (
          <img src={partner.photoUrl} alt={partner.user.name} className="w-16 h-16 rounded-full object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{partner.user.name}</h1>
          <p className="text-gray-500">{partner.user.email}</p>
        </div>
        <div className="ml-auto">
          <TogglePartnerStatus partnerId={partner.id} isActive={partner.isActive} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4"><div className="text-xs text-gray-500">Balance</div><div className="text-xl font-bold text-green-600">{formatCurrency(balance.toString())}</div></div>
        <div className="card p-4"><div className="text-xs text-gray-500">Clients</div><div className="text-xl font-bold">{partner.clients.length}</div></div>
        <div className="card p-4"><div className="text-xs text-gray-500">Referral Slug</div><div className="text-sm font-mono text-brand-600">{partner.slug}</div></div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Commissions</h2>
        {partner.commissions.length === 0 ? <p className="text-gray-400 text-sm">None yet</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-medium">Amount</th>
              <th className="text-left py-2 text-gray-500 font-medium">Date</th>
              <th className="text-left py-2 text-gray-500 font-medium">Paid</th>
            </tr></thead>
            <tbody>
              {partner.commissions.map(c => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="py-2 text-green-600 font-medium">{formatCurrency(c.amount.toString())}</td>
                  <td className="py-2 text-gray-400">{formatDate(c.createdAt)}</td>
                  <td className="py-2"><span className={c.isPaid ? 'badge-green' : 'badge-yellow'}>{c.isPaid ? 'Paid' : 'Pending'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Clients</h2>
        {partner.clients.length === 0 ? <p className="text-gray-400 text-sm">No clients</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-medium">Name</th>
              <th className="text-left py-2 text-gray-500 font-medium">Email</th>
              <th className="text-left py-2 text-gray-500 font-medium">Services</th>
            </tr></thead>
            <tbody>
              {partner.clients.map(c => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="py-2">{c.user.name}</td>
                  <td className="py-2 text-gray-500">{c.user.email}</td>
                  <td className="py-2">{c.subscriptions.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
