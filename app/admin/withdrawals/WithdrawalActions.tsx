'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function WithdrawalActions({ withdrawalId }: { withdrawalId: string }) {
  const router = useRouter()
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function action(status: 'APPROVED' | 'REJECTED' | 'PAID') {
    setLoading(true)
    await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNote: note }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => action('APPROVED')} disabled={loading} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">Approve</button>
      <button onClick={() => action('PAID')} disabled={loading} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Mark Paid</button>
      <button onClick={() => action('REJECTED')} disabled={loading} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">Reject</button>
    </div>
  )
}
