'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface FormData {
  name: string; phone: string; bio: string; company: string; website: string; paypalEmail: string; photoUrl: string
}

export default function ProfileForm({ initialData }: { initialData: FormData }) {
  const router = useRouter()
  const [form, setForm] = useState(initialData)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState(initialData.photoUrl)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => formData.append(k, v))
    if (photoFile) formData.append('photo', photoFile)

    const res = await fetch('/api/partner/profile', { method: 'PATCH', body: formData })
    if (res.ok) {
      const data = await res.json()
      if (data.photoUrl) setForm(f => ({...f, photoUrl: data.photoUrl}))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="card p-6 space-y-5">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">👤</div>
          )}
        </div>
        <div>
          <label className="btn-secondary text-sm cursor-pointer">
            Change Photo
            <input type="file" accept="image/*" onChange={onPhotoChange} className="hidden" />
          </label>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG or WebP. Max 5MB.</p>
        </div>
      </div>

      {[
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'phone', label: 'Phone', type: 'tel' },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'website', label: 'Website', type: 'url' },
        { key: 'paypalEmail', label: 'PayPal Email (for withdrawals)', type: 'email' },
      ].map(field => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}{field.required && ' *'}</label>
          <input
            type={field.type}
            required={field.required}
            value={form[field.key as keyof FormData]}
            onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))}
            className="input"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))} className="input" rows={3} />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Profile'}</button>
        {saved && <span className="text-green-600 text-sm">Saved!</span>}
      </div>
    </form>
  )
}
