import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import type { Role } from '@prisma/client'

export async function requireRole(...roles: Role[]) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')
  if (!roles.includes(session.user.role as Role)) redirect('/login')
  return session
}

export async function getSession() {
  return getServerSession(authOptions)
}
