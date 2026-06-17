import { prisma } from '@/lib/prisma'
import StatCard from '@/components/ui/StatCard'
import { formatCurrency } from '@/lib/utils'

export default async function AdminDashboard() {
  const [partnerCount, clientCount, totalRevenue, pendingWithdrawals] = await Promise.all([
    prisma.partner.count({ where: { isActive: true } }),
    prisma.client.count({ where: { isActive: true } }),
    prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
    prisma.withdrawalRequest.aggregate({ where: { status: 'PENDING' }, _sum: { amount: true } }),
  ])

  const recentPayments = await prisma.payment.findMany({
    where: { status: 'PAID' },
    orderBy: { paidAt: 'desc' },
    take: 5,
    include: { client: { include: { user: true } } },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Active Partners" value={partnerCount} color="blue" />
        <StatCard label="Active Clients" value={clientCount} color="green" />
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue._sum.amount?.toString() || '0')} color="purple" />
        <StatCard label="Pending Withdrawals" value={formatCurrency(pendingWithdrawals._sum.amount?.toString() || '0')} color="yellow" />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Client</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Amount</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments.map(p => (
              <tr key={p.id} className="border-b border-gray-100">
                <td className="py-2 px-3">{p.client.user.name}</td>
                <td className="py-2 px-3 text-green-600 font-medium">{formatCurrency(p.amount.toString())}</td>
                <td className="py-2 px-3 text-gray-400">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
            {recentPayments.length === 0 && (
              <tr><td colSpan={3} className="py-6 text-center text-gray-400">No payments yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
