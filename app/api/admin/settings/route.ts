import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { setSetting } from '@/lib/settings'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'MASTER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { settings } = await req.json()
  for (const { key, value, encrypted } of settings) {
    if (value !== undefined) await setSetting(key, value, encrypted)
  }

  return NextResponse.json({ success: true })
}
