import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import ProductActions from './ProductActions'
import AddProductForm from './AddProductForm'

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { subscriptions: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products / Services</h1>
      </div>

      <div className="card mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Monthly</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Setup</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Subscriptions</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{p.name}</td>
                <td className="py-3 px-4">{formatCurrency(p.monthlyPrice.toString())}</td>
                <td className="py-3 px-4">{formatCurrency(p.setupFee.toString())}</td>
                <td className="py-3 px-4">{p._count.subscriptions}</td>
                <td className="py-3 px-4">
                  <span className={p.isActive ? 'badge-green' : 'badge-gray'}>{p.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="py-3 px-4">
                  <ProductActions product={{ id: p.id, name: p.name, monthlyPrice: p.monthlyPrice.toString(), setupFee: p.setupFee.toString(), isActive: p.isActive, description: p.description || '', features: p.features || '' }} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-gray-400">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Add New Service</h2>
        <AddProductForm />
      </div>
    </div>
  )
}
