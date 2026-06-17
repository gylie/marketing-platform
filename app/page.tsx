import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 6,
  })

  return (
    <div className="min-h-screen">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">
            {process.env.NEXT_PUBLIC_APP_NAME || 'Agency'}
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
            <Link href="/register/client" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Grow Your Business with<br />Expert Digital Marketing
          </h1>
          <p className="text-xl text-brand-200 mb-10 max-w-2xl mx-auto">
            We handle your SEO, ads, social media, and more — so you can focus on running your business.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register/client" className="bg-white text-brand-700 font-semibold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors">
              Start Today
            </Link>
            <Link href="/services" className="border border-white/40 text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              View Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Services</h2>
          {products.length === 0 ? (
            <p className="text-center text-gray-400">Services coming soon</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(p => (
                <div key={p.id} className="card p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{p.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{p.description}</p>
                  <div className="text-2xl font-bold text-brand-600">
                    ${Number(p.monthlyPrice).toLocaleString()}<span className="text-sm font-normal text-gray-400">/mo</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/services" className="btn-primary">See All Services</Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Partner</h2>
          <p className="text-gray-600 mb-8">Earn 25% commission on every payment from clients you refer. No cap on earnings.</p>
          <Link href="/register/partner" className="btn-primary text-lg px-8 py-3">Apply to Partner Program</Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
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
