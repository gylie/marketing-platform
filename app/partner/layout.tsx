import { requireRole } from '@/lib/auth'
import PartnerSidebar from '@/components/partner/PartnerSidebar'

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  await requireRole('PARTNER')
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PartnerSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
