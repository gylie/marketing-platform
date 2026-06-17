'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewRequestForm() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/client/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: '', description: '' })
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Request Title *</label>
        <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="input" placeholder="e.g. Update homepage banner" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea required value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="input" rows={4} placeholder="Describe what you need changed..." />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit Request'}</button>
    </form>
  )
}
