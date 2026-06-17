'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FormData { name: string; phone: string; company: string; address: string; city: string; state: string; zip: string }

export default function ClientSettingsForm({ initialData }: { initialData: FormData }) {
  const router = useRouter()
  const [form, setForm] = useState(initialData)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/client/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="card p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
        <input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="input" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} className="input" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))} className="input" maxLength={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
          <input value={form.zip} onChange={e => setForm(f => ({...f, zip: e.target.value}))} className="input" />
        </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        {saved && <span className="text-green-600 text-sm">Saved!</span>}
      </div>
    </form>
  )
}
