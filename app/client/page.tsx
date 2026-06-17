import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import StatCard from '@/components/ui/StatCard'
import Link from 'next/link'

export default async function ClientDashboard() {
  const session = await getSession()
  if (!session) redirect('/login')

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      subscriptions: { include: { product: true }, where: { status: 'active' } },
      payments: { orderBy: { createdAt: 'desc' }, take: 3, where: { status: 'PAID' } },
      changeRequests: { orderBy: { createdAt: 'desc' }, take: 3 },
      partner: { include: { user: true } },
    },
  })
  if (!client) redirect('/login')

  const monthly = client.subscriptions.reduce((sum, s) => sum + parseFloat(s.monthlyPrice.toString()), 0)
  const openRequests = client.changeRequests.filter(r => r.status === 'OPEN').length

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {client.user.name.split(' ')[0]}!</h1>
      {client.partner && (
        <p className="text-sm text-gray-500 mb-6">Your account manager: <span className="font-medium">{client.partner.user.name}</span></p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Active Services" value={client.subscriptions.length} color="blue" />
        <StatCard label="Monthly Spend" value={formatCurrency(monthly.toString())} color="purple" />
        <StatCard label="Open Requests" value={openRequests} color="yellow" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">My Services</h2>
          {client.subscriptions.length === 0 ? (
            <p className="text-gray-400 text-sm">No services yet.</p>
          ) : (
            <div className="space-y-2">
              {client.subscriptions.map(s => (
                <div key={s.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span>{s.product.name}</span>
                  <span className="text-gray-500">{formatCurrency(s.monthlyPrice.toString())}/mo</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Requests</h2>
            <Link href="/client/requests" className="text-brand-600 text-xs hover:underline">View all</Link>
          </div>
          {client.changeRequests.length === 0 ? (
            <p className="text-gray-400 text-sm">No requests yet.</p>
          ) : (
            <div className="space-y-2">
              {client.changeRequests.map(r => (
                <div key={r.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="truncate mr-2">{r.title}</span>
                  <span className={r.status === 'RESOLVED' ? 'badge-green' : 'badge-yellow'}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
