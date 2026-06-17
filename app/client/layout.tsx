import { requireRole } from '@/lib/auth'
import ClientSidebar from '@/components/client/ClientSidebar'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  await requireRole('CLIENT')
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClientSidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
