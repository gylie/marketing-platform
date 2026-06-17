'use client'
import { useState } from 'react'

export default function ReferralCard({ referralUrl, slug }: { referralUrl: string; slug: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card p-6">
      <p className="text-sm text-gray-500 mb-3">Share this link to earn 25% commission on every client payment:</p>
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
        <span className="text-brand-600 font-mono text-sm flex-1 truncate">{referralUrl}</span>
        <button onClick={copy} className="btn-primary text-sm whitespace-nowrap">
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Slug: <span className="font-mono">{slug}</span></p>
    </div>
  )
}
