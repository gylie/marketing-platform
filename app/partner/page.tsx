import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { getPartnerBalance } from '@/lib/commission'
import StatCard from '@/components/ui/StatCard'

export default async function PartnerDashboard() {
  const session = await getSession()
  if (!session) redirect('/login')

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    include: {
      _count: { select: { clients: true, commissions: true } },
      commissions: { take: 5, orderBy: { createdAt: 'desc' }, include: { payment: true } },
    },
  })
  if (!partner) redirect('/login')

  const balance = await getPartnerBalance(partner.id)
  const totalEarned = await prisma.commission.aggregate({
    where: { partnerId: partner.id },
    _sum: { amount: true },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Partner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Available Balance" value={formatCurrency(balance.toString())} color="green" />
        <StatCard label="Total Earned" value={formatCurrency(totalEarned._sum.amount?.toString() || '0')} color="purple" />
        <StatCard label="Active Clients" value={partner._count.clients} color="blue" />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Commissions</h2>
        {partner.commissions.length === 0 ? (
          <p className="text-gray-400 text-sm">No commissions yet. Share your referral link to get started!</p>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500 font-medium">Amount</th>
              <th className="text-left py-2 text-gray-500 font-medium">Payment</th>
              <th className="text-left py-2 text-gray-500 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {partner.commissions.map(c => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="py-2 text-green-600 font-medium">{formatCurrency(c.amount.toString())}</td>
                  <td className="py-2 text-gray-500">{formatCurrency(c.payment.amount.toString())}</td>
                  <td className="py-2"><span className={c.isPaid ? 'badge-green' : 'badge-yellow'}>{c.isPaid ? 'Paid' : 'Pending'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
