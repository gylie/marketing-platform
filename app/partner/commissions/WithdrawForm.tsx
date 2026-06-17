'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function WithdrawForm({ partnerId, paypalEmail, maxAmount }: { partnerId: string; paypalEmail: string; maxAmount: string }) {
  const router = useRouter()
  const [amount, setAmount] = useState(maxAmount)
  const [email, setEmail] = useState(paypalEmail)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/partner/withdrawal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), paypalEmail: email }),
    })
    if (res.ok) {
      setSuccess(true)
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed')
    }
    setLoading(false)
  }

  if (success) return <p className="text-green-600 text-sm mt-2">Withdrawal request submitted!</p>

  return (
    <form onSubmit={submit} className="space-y-3 mt-2">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Amount (max {formatCurrency(maxAmount)})</label>
        <input type="number" step="0.01" max={maxAmount} value={amount} onChange={e => setAmount(e.target.value)} className="input text-sm" required />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">PayPal Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input text-sm" required />
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary text-sm">{loading ? 'Submitting...' : 'Request Withdrawal'}</button>
    </form>
  )
}
