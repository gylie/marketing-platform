import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import NewRequestForm from './NewRequestForm'

export default async function ClientRequests() {
  const session = await getSession()
  if (!session) redirect('/login')

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id },
    include: { changeRequests: { orderBy: { createdAt: 'desc' } } },
  })
  if (!client) redirect('/login')

  const statusColor: Record<string, string> = {
    OPEN: 'badge-yellow',
    IN_PROGRESS: 'badge-blue',
    RESOLVED: 'badge-green',
    CLOSED: 'badge-gray',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Requests</h1>

      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Submit New Request</h2>
        <NewRequestForm />
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Title</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Submitted</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {client.changeRequests.map(r => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{r.title}</td>
                <td className="py-3 px-4"><span className={statusColor[r.status] || 'badge-gray'}>{r.status.replace('_', ' ')}</span></td>
                <td className="py-3 px-4 text-gray-400">{formatDate(r.createdAt)}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{r.adminNote || '-'}</td>
              </tr>
            ))}
            {client.changeRequests.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No requests yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
