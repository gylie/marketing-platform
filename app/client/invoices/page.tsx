import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function ClientInvoices() {
  const session = await getSession()
  if (!session) redirect('/login')

  const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
  if (!client) redirect('/login')

  const payments = await prisma.payment.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Invoices & Payments</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Description</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{p.description || 'Service payment'}</td>
                <td className="py-3 px-4 font-medium">{formatCurrency(p.amount.toString())}</td>
                <td className="py-3 px-4">
                  <span className={p.status === 'PAID' ? 'badge-green' : p.status === 'PENDING' ? 'badge-yellow' : 'badge-red'}>{p.status}</span>
                </td>
                <td className="py-3 px-4 text-gray-400">{formatDate(p.paidAt || p.createdAt)}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No payments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
