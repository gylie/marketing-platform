'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Setting { id: string; key: string; value: string; encrypted: boolean; label: string; group: string }

export default function SettingsForm({ settings }: { settings: Setting[] }) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map(s => [s.key, s.value]))
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const groups = [...new Set(settings.map(s => s.group))]

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: settings.map(s => ({ key: s.key, value: values[s.key], encrypted: s.encrypted })) }),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
    setSaving(false)
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {groups.map(group => (
        <div key={group} className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{group} Settings</h2>
          <div className="space-y-4">
            {settings.filter(s => s.group === group).map(s => (
              <div key={s.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {s.label}
                  {s.encrypted && <span className="ml-2 text-xs text-gray-400">🔒 encrypted</span>}
                </label>
                <input
                  type={s.encrypted ? 'password' : 'text'}
                  value={values[s.key] || ''}
                  onChange={e => setValues(v => ({...v, [s.key]: e.target.value}))}
                  className="input"
                  placeholder={s.encrypted ? '••••••••' : ''}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Settings'}</button>
        {saved && <span className="text-green-600 text-sm">Settings saved!</span>}
      </div>
    </form>
  )
}
