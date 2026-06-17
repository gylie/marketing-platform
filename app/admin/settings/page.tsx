import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import SettingsForm from './SettingsForm'

export default async function AdminSettings() {
  const rows = await prisma.systemSetting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] })
  const settings = rows.map(r => ({
    id: r.id,
    key: r.key,
    value: r.encrypted ? decrypt(r.value) : r.value,
    encrypted: r.encrypted,
    label: r.label || r.key,
    group: r.group || 'general',
  }))

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
