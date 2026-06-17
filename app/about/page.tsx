import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">{process.env.NEXT_PUBLIC_APP_NAME || 'Agency'}</Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
            <Link href="/about" className="text-brand-600 font-medium">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="/login" className="btn-secondary text-sm">Sign In</Link>
            <Link href="/register/client" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            We are a full-service digital marketing agency dedicated to helping businesses grow online.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: 'Our Mission', body: 'To deliver measurable results and real business growth for every client we work with.' },
              { title: 'Our Approach', body: 'Data-driven strategies tailored to your specific industry, audience, and goals.' },
              { title: 'Our Team', body: 'Experienced marketers, designers, and strategists who are passionate about client success.' },
            ].map(item => (
              <div key={item.title} className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h2>
                <p className="text-gray-500 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="bg-brand-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to grow?</h2>
            <Link href="/register/client" className="btn-primary text-lg px-8 py-3">Get Started Today</Link>
          </div>
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
