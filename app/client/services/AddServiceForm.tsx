'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

interface Product { id: string; name: string; monthlyPrice: string; setupFee: string; description: string }

export default function AddServiceForm({ products }: { products: Product[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function add(productId: string) {
    setLoading(true)
    setError('')
    const res = await fetch('/api/client/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    if (res.ok) {
      setSuccess('Service request submitted! Our team will be in touch.')
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed')
    }
    setLoading(false)
  }

  return (
    <div>
      {success && <div className="badge-green mb-4 p-3">{success}</div>}
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p.id} className={`border rounded-lg p-4 cursor-pointer transition-colors ${selected === p.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => setSelected(p.id)}>
            <div className="font-medium text-gray-900">{p.name}</div>
            <div className="text-sm text-gray-500 mt-1">{p.description}</div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(p.monthlyPrice)}/mo</span>
                {parseFloat(p.setupFee) > 0 && <span className="text-xs text-gray-400 ml-2">+ {formatCurrency(p.setupFee)} setup</span>}
              </div>
              {selected === p.id && (
                <button onClick={e => { e.stopPropagation(); add(p.id) }} disabled={loading} className="btn-primary text-sm">
                  {loading ? '...' : 'Add'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
