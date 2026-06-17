'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function TogglePartnerStatus({ partnerId, isActive }: { partnerId: string; isActive: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    await fetch(`/api/admin/partners/${partnerId}/toggle`, { method: 'POST' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading} className={isActive ? 'btn-danger' : 'btn-primary'}>
      {loading ? '...' : isActive ? 'Deactivate' : 'Activate'}
    </button>
  )
}
