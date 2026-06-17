import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import WithdrawalActions from './WithdrawalActions'

export default async function AdminWithdrawals() {
  const withdrawals = await prisma.withdrawalRequest.findMany({
    include: { partner: { include: { user: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const statusColor: Record<string, string> = {
    PENDING: 'badge-yellow',
    APPROVED: 'badge-blue',
    PAID: 'badge-green',
    REJECTED: 'badge-red',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdrawal Requests</h1>
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Partner</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Amount</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">PayPal</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Requested</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(w => (
              <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{w.partner.user.name}</td>
                <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(w.amount.toString())}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{w.paypalEmail}</td>
                <td className="py-3 px-4"><span className={statusColor[w.status] || 'badge-gray'}>{w.status}</span></td>
                <td className="py-3 px-4 text-gray-400">{formatDate(w.createdAt)}</td>
                <td className="py-3 px-4">
                  {w.status === 'PENDING' && <WithdrawalActions withdrawalId={w.id} />}
                </td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">No withdrawal requests</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
