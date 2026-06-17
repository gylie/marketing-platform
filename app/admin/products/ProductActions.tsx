'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'

interface Product { id: string; name: string; monthlyPrice: string; setupFee: string; isActive: boolean; description: string; features: string }

export default function ProductActions({ product }: { product: Product }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState(product)
  const [saving, setSaving] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setEditOpen(false)
    router.refresh()
    setSaving(false)
  }

  async function toggle() {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !product.isActive }),
    })
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={() => setEditOpen(true)} className="text-brand-600 hover:underline text-xs">Edit</button>
        <button onClick={toggle} className="text-gray-400 hover:text-gray-600 text-xs">{product.isActive ? 'Disable' : 'Enable'}</button>
      </div>
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Service">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price</label>
              <input type="number" step="0.01" value={form.monthlyPrice} onChange={e => setForm(f => ({...f, monthlyPrice: e.target.value}))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setup Fee</label>
              <input type="number" step="0.01" value={form.setupFee} onChange={e => setForm(f => ({...f, setupFee: e.target.value}))} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="input" rows={2} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </Modal>
    </>
  )
}
