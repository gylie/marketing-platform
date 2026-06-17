import { prisma } from './prisma'
import { encrypt, decrypt } from './encryption'

export async function getSetting(key: string): Promise<string> {
  const row = await prisma.systemSetting.findUnique({ where: { key } })
  if (!row) return ''
  return row.encrypted ? decrypt(row.value) : row.value
}

export async function setSetting(key: string, value: string, encrypted = false): Promise<void> {
  const stored = encrypted ? encrypt(value) : value
  await prisma.systemSetting.upsert({
    where: { key },
    update: { value: stored, encrypted },
    create: { key, value: stored, encrypted },
  })
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await prisma.systemSetting.findMany()
  const result: Record<string, string> = {}
  for (const row of rows) {
    result[row.key] = row.encrypted ? '••••••••' : row.value
  }
  return result
}
