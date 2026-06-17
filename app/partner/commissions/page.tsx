import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getPartnerBalance } from '@/lib/commission'
import { getSetting } from '@/lib/settings'
import WithdrawForm from './WithdrawForm'

export default async function PartnerCommissions() {
  const session = await getSession()
  if (!session) redirect('/login')

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    include: {
      commissions: {
        orderBy: { createdAt: 'desc' },
        include: { payment: { include: { client: { include: { user: true } } } } },
      },
      withdrawals: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!partner) redirect('/login')

  const balance = await getPartnerBalance(partner.id)
  const minWithdrawal = parseFloat((await getSetting('withdrawal_minimum')) || '250')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Commissions & Withdrawals</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <div className="text-sm text-gray-500 mb-1">Available Balance</div>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(balance.toString())}</div>
          <div className="text-xs text-gray-400 mt-1">Min withdrawal: {formatCurrency(minWithdrawal.toString())}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-gray-500 mb-1">Request Withdrawal</div>
          {balance.gte(minWithdrawal)
            ? <WithdrawForm partnerId={partner.id} paypalEmail={partner.paypalEmail || ''} maxAmount={balance.toString()} />
            : <p className="text-sm text-gray-400 mt-2">Reach {formatCurrency(minWithdrawal.toString())} to unlock withdrawals.</p>
          }
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Commission History</h2>
        {partner.commissions.length === 0 ? <p className="text-gray-400 text-sm">No commissions yet</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500">Client</th>
              <th className="text-left py-2 text-gray-500">Payment</th>
              <th className="text-left py-2 text-gray-500">Commission</th>
              <th className="text-left py-2 text-gray-500">Date</th>
              <th className="text-left py-2 text-gray-500">Status</th>
            </tr></thead>
            <tbody>
              {partner.commissions.map(c => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="py-2">{c.payment.client.user.name}</td>
                  <td className="py-2 text-gray-500">{formatCurrency(c.payment.amount.toString())}</td>
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
        <h2 className="font-semibold text-gray-900 mb-4">Withdrawal History</h2>
        {partner.withdrawals.length === 0 ? <p className="text-gray-400 text-sm">No withdrawals yet</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200">
              <th className="text-left py-2 text-gray-500">Amount</th>
              <th className="text-left py-2 text-gray-500">Status</th>
              <th className="text-left py-2 text-gray-500">Requested</th>
              <th className="text-left py-2 text-gray-500">Note</th>
            </tr></thead>
            <tbody>
              {partner.withdrawals.map(w => (
                <tr key={w.id} className="border-b border-gray-100">
                  <td className="py-2 font-medium">{formatCurrency(w.amount.toString())}</td>
                  <td className="py-2">
                    <span className={w.status === 'PAID' ? 'badge-green' : w.status === 'PENDING' ? 'badge-yellow' : w.status === 'APPROVED' ? 'badge-blue' : 'badge-red'}>
                      {w.status}
                    </span>
                  </td>
                  <td className="py-2 text-gray-400">{formatDate(w.createdAt)}</td>
                  <td className="py-2 text-gray-500 text-xs">{w.adminNote || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
