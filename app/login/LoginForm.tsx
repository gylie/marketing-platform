'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const registered = params.get('registered')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/session')
    const session = await res.json()
    const role = session?.user?.role

    if (role === 'MASTER_ADMIN') router.push('/admin')
    else if (role === 'PARTNER') router.push('/partner')
    else if (role === 'CLIENT') router.push('/client')
    else router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{process.env.NEXT_PUBLIC_APP_NAME || 'Agency'}</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">
            Account created! You can now sign in.
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input" autoComplete="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className="input" autoComplete="current-password" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>New partner? <Link href="/register/partner" className="text-brand-600 hover:underline">Apply here</Link></p>
          <p className="mt-1">New client? <Link href="/register/client" className="text-brand-600 hover:underline">Register here</Link></p>
        </div>
      </div>
    </div>
  )
}
