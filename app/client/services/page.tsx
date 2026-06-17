import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import AddServiceForm from './AddServiceForm'

export default async function ClientServices() {
  const session = await getSession()
  if (!session) redirect('/login')

  const client = await prisma.client.findUnique({ where: { userId: session.user.id } })
  if (!client) redirect('/login')

  const [subscriptions, availableProducts] = await Promise.all([
    prisma.clientSubscription.findMany({
      where: { clientId: client.id },
      include: { product: true },
      orderBy: { startDate: 'desc' },
    }),
    prisma.product.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ])

  const activeProductIds = subscriptions.filter(s => s.status === 'active').map(s => s.productId)
  const addable = availableProducts.filter(p => !activeProductIds.includes(p.id))

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Services</h1>
      <div className="card mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Service</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Monthly</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map(s => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{s.product.name}</td>
                <td className="py-3 px-4">{formatCurrency(s.monthlyPrice.toString())}</td>
                <td className="py-3 px-4"><span className={s.status === 'active' ? 'badge-green' : 'badge-gray'}>{s.status}</span></td>
                <td className="py-3 px-4 text-gray-400">{formatDate(s.startDate)}</td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No services yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {addable.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Add a Service</h2>
          <AddServiceForm products={addable.map(p => ({ id: p.id, name: p.name, monthlyPrice: p.monthlyPrice.toString(), setupFee: p.setupFee.toString(), description: p.description || '' }))} />
        </div>
      )}
    </div>
  )
}
