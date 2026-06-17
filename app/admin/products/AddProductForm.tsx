'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddProductForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', description: '', monthlyPrice: '', setupFee: '0', features: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ name: '', description: '', monthlyPrice: '', setupFee: '0', features: '' })
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
        <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input" placeholder="e.g. SEO Management" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price *</label>
        <input required type="number" step="0.01" value={form.monthlyPrice} onChange={e => setForm(f => ({...f, monthlyPrice: e.target.value}))} className="input" placeholder="499.00" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Setup Fee</label>
        <input type="number" step="0.01" value={form.setupFee} onChange={e => setForm(f => ({...f, setupFee: e.target.value}))} className="input" />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="input" rows={2} />
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
        <textarea value={form.features} onChange={e => setForm(f => ({...f, features: e.target.value}))} className="input" rows={3} placeholder="Keyword research&#10;Monthly reports&#10;Link building" />
      </div>
      {error && <p className="col-span-2 text-red-600 text-sm">{error}</p>}
      <div className="col-span-2">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Adding...' : 'Add Service'}</button>
      </div>
    </form>
  )
}
