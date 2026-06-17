'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Partner { id: string; name: string }

export default function AssignPartnerForm({ clientId, currentPartnerId, partners }: {
  clientId: string; currentPartnerId: string | null; partners: Partner[]
}) {
  const router = useRouter()
  const [value, setValue] = useState(currentPartnerId || '')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/clients/${clientId}/assign-partner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId: value || null }),
    })
    router.refresh()
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-3">
      <select value={value} onChange={e => setValue(e.target.value)} className="input max-w-xs">
        <option value="">Direct (no partner)</option>
        {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
    </div>
  )
}
