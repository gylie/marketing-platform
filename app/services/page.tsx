import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default async function ServicesPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">{process.env.NEXT_PUBLIC_APP_NAME || 'Agency'}</Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/services" className="text-brand-600 font-medium">Services</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="/partners" className="text-brand-600 font-medium hover:text-brand-700">Earn with Us</Link>
            <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
            <Link href="/register/client" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">Our Services</h1>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          Everything you need to grow your online presence and drive results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => {
            const features = p.features ? p.features.split('\n').filter(Boolean) : []
            return (
              <div key={p.id} className="card p-6 hover:shadow-md transition-shadow flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{p.description}</p>
                {features.length > 0 && (
                  <ul className="space-y-1 mb-6 flex-1">
                    {features.map((f, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto">
                  <div className="text-3xl font-bold text-brand-600 mb-1">
                    {formatCurrency(p.monthlyPrice.toString())}<span className="text-sm font-normal text-gray-400">/mo</span>
                  </div>
                  {Number(p.setupFee) > 0 && (
                    <p className="text-xs text-gray-400 mb-4">+ {formatCurrency(p.setupFee.toString())} one-time setup</p>
                  )}
                  <Link href="/register/client" className="btn-primary w-full block text-center">Get Started</Link>
                </div>
              </div>
            )
          })}
          {products.length === 0 && (
            <p className="col-span-3 text-center text-gray-400 py-16">Services coming soon!</p>
          )}
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white font-bold">{process.env.NEXT_PUBLIC_APP_NAME || 'Agency'}</div>
          <div className="flex gap-6 text-sm">
            <Link href="/services" className="hover:text-white">Services</Link>
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/partners" className="hover:text-white">Become a Partner</Link>
            <Link href="/login" className="hover:text-white">Login</Link>
          </div>
          <div className="text-xs">&copy; {new Date().getFullYear()} All rights reserved</div>
        </div>
      </footer>
    </div>
  )
}
