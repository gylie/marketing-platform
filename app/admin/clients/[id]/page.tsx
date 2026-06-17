import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import AssignPartnerForm from './AssignPartnerForm'

export default async function AdminClientDetail({ params }: { params: { id: string } }) {
  const [client, partners] = await Promise.all([
    prisma.client.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        partner: { include: { user: true } },
        subscriptions: { include: { product: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
        changeRequests: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    }),
    prisma.partner.findMany({ include: { user: true }, where: { isActive: true } }),
  ])

  if (!client) notFound()

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{client.user.name}</h1>
      <p className="text-gray-500 mb-6">{client.user.email}</p>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Assign Partner</h2>
        <AssignPartnerForm clientId={client.id} currentPartnerId={client.partnerId} partners={partners.map(p => ({ id: p.id, name: p.user.name }))} />
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Active Services</h2>
        {client.subscriptions.length === 0 ? <p className="text-gray-400 text-sm">No services</p> : (
          <div className="space-y-2">
            {client.subscriptions.map(s => (
              <div key={s.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span>{s.product.name}</span>
                <span className="font-medium text-gray-700">{formatCurrency(s.monthlyPrice.toString())}/mo</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Payment History</h2>
        {client.payments.length === 0 ? <p className="text-gray-400 text-sm">No payments</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500">Amount</th>
              <th className="text-left py-2 text-gray-500">Status</th>
              <th className="text-left py-2 text-gray-500">Date</th>
            </tr></thead>
            <tbody>
              {client.payments.map(p => (
                <tr key={p.id} className="border-b border-gray-100">
                  <td className="py-2">{formatCurrency(p.amount.toString())}</td>
                  <td className="py-2"><span className={p.status === 'PAID' ? 'badge-green' : 'badge-yellow'}>{p.status}</span></td>
                  <td className="py-2 text-gray-400">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Change Requests</h2>
        {client.changeRequests.length === 0 ? <p className="text-gray-400 text-sm">No requests</p> : (
          <div className="space-y-2">
            {client.changeRequests.map(r => (
              <div key={r.id} className="flex justify-between py-2 border-b border-gray-100">
                <span>{r.title}</span>
                <span className={r.status === 'RESOLVED' ? 'badge-green' : r.status === 'OPEN' ? 'badge-yellow' : 'badge-blue'}>{r.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
