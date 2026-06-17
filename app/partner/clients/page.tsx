import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function PartnerClients() {
  const session = await getSession()
  if (!session) redirect('/login')

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    include: {
      clients: {
        include: {
          user: true,
          subscriptions: { include: { product: true } },
          payments: { where: { status: 'PAID' }, take: 1, orderBy: { paidAt: 'desc' } },
        },
      },
    },
  })
  if (!partner) redirect('/login')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Clients ({partner.clients.length})</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Services</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Monthly Value</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {partner.clients.map(c => {
              const monthly = c.subscriptions.reduce((sum, s) => sum + parseFloat(s.monthlyPrice.toString()), 0)
              return (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{c.user.name}</td>
                  <td className="py-3 px-4 text-gray-500">{c.user.email}</td>
                  <td className="py-3 px-4">{c.subscriptions.length}</td>
                  <td className="py-3 px-4 text-green-600">{formatCurrency(monthly.toString())}</td>
                  <td className="py-3 px-4 text-gray-400">{formatDate(c.createdAt)}</td>
                </tr>
              )
            })}
            {partner.clients.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">No clients yet. Share your referral link!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
