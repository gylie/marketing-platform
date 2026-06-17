'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/client', label: 'Dashboard', icon: '📊' },
  { href: '/client/services', label: 'My Services', icon: '🛠️' },
  { href: '/client/requests', label: 'Change Requests', icon: '📝' },
  { href: '/client/invoices', label: 'Invoices', icon: '🧾' },
  { href: '/client/settings', label: 'Settings', icon: '⚙️' },
]

export default function ClientSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="text-lg font-bold text-brand-400">Client Portal</div>
        <div className="text-xs text-gray-500 mt-1">{process.env.NEXT_PUBLIC_APP_NAME}</div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === item.href
                ? 'bg-brand-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="w-full text-left text-gray-400 hover:text-white text-sm px-3 py-2">Sign Out</button>
      </div>
    </aside>
  )
}
