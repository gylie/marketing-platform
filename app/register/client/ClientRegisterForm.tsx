'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ClientRegisterForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', phone: '', referralSlug: '' })
  const [partnerName, setPartnerName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const refSlug = params.get('ref') || getCookie('referral_slug') || ''
    if (refSlug) {
      setForm(f => ({...f, referralSlug: refSlug}))
      fetch(`/api/partner/by-slug/${refSlug}`).then(r => r.ok ? r.json() : null).then(d => {
        if (d?.name) setPartnerName(d.name)
      })
    }
  }, [])

  function getCookie(name: string): string {
    return document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1] || ''
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/register/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/login?registered=client')
    } else {
      const d = await res.json()
      setError(d.error || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Client Account</h1>
          {partnerName && <p className="text-sm text-brand-600 mt-1">Referred by {partnerName}</p>}
        </div>
        <form onSubmit={submit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'password', label: 'Password', type: 'password', required: true },
            { key: 'company', label: 'Company (optional)', type: 'text' },
            { key: 'phone', label: 'Phone (optional)', type: 'tel' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                required={field.required}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(f => ({...f, [field.key]: e.target.value}))}
                className="input"
              />
            </div>
          ))}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-brand-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
