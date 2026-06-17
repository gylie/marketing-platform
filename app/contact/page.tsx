'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">{process.env.NEXT_PUBLIC_APP_NAME || 'Agency'}</Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/contact" className="text-brand-600 font-medium">Contact</Link>
            <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-500 mb-8">Have a question? We'd love to hear from you.</p>

        {sent ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Message sent!</h2>
            <p className="text-gray-500">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="card p-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} className="input" rows={5} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Message'}</button>
          </form>
        )}
      </div>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white font-bold">{process.env.NEXT_PUBLIC_APP_NAME || 'Agency'}</div>
          <div className="flex gap-6 text-sm">
            <Link href="/services" className="hover:text-white">Services</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/partners" className="hover:text-white">Become a Partner</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
          </div>
          <div className="text-xs">&copy; {new Date().getFullYear()} All rights reserved</div>
        </div>
      </footer>
    </div>
  )
}
