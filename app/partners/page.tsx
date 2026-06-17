import Link from 'next/link'

const earnings = [
  { clients: 2, monthly: '$299', annual: '$3,588', label: 'Side income' },
  { clients: 5, monthly: '$748', annual: '$8,970', label: 'Nice supplement' },
  { clients: 10, monthly: '$1,495', annual: '$17,940', label: 'Part-time income' },
  { clients: 20, monthly: '$2,990', annual: '$35,880', label: 'Full-time replacement' },
  { clients: 50, monthly: '$7,475', annual: '$89,700', label: 'Agency-level income' },
]

const steps = [
  {
    n: '01',
    title: 'Sign up free',
    body: 'Create your partner account in under 2 minutes. No fees, no contracts, no catch.',
  },
  {
    n: '02',
    title: 'Share your link',
    body: 'You get a personal referral link. Share it on social media, via email, text — any way you like.',
  },
  {
    n: '03',
    title: 'We close & deliver',
    body: 'When someone signs up through your link, we handle onboarding, service delivery, and all client support.',
  },
  {
    n: '04',
    title: 'You get paid',
    body: '25% of every payment hits your dashboard automatically. Withdraw to PayPal anytime you hit $250.',
  },
]

const faqs = [
  {
    q: 'Do I need marketing experience?',
    a: 'Not at all. You refer — we deliver. No technical skills, no marketing degree required. If you know people who run businesses, you qualify.',
  },
  {
    q: 'How exactly does the commission work?',
    a: 'You earn 25% of every payment your referred client makes — including their monthly retainer, setup fees, and any add-on services. The commission continues as long as they stay a client.',
  },
  {
    q: 'Is there a cap on how much I can earn?',
    a: 'Zero cap. Refer 2 clients or 200 clients — the math scales the same way. There is no ceiling, no tiered reduction, no fine print.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'Commission is credited to your account the moment a client payment clears. Once your balance hits $250, you can request a withdrawal to PayPal — usually processed within 2 business days.',
  },
  {
    q: 'What services do clients actually get?',
    a: 'We offer SEO, social media management, paid advertising, reputation management, and more. You can see the full list on our Services page. These are real, high-quality services that businesses need and pay for every month.',
  },
  {
    q: 'What do I have to do after making a referral?',
    a: 'Nothing — unless you want to stay involved. Once the client signs up through your link, we take care of everything: onboarding, strategy, execution, reporting, and support. You just watch the commissions roll in.',
  },
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
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
            <Link href="/register/partner" className="btn-primary text-sm">Apply Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-brand-950 to-brand-900 text-white py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/30 border border-brand-500/40 text-brand-300 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            Partner Program — Free to Join
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Earn 25% on every client.<br />
            <span className="text-brand-400">We do all the work.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Refer businesses to our digital marketing services and collect recurring commissions every month — with no cap, no experience required, and zero service delivery on your end.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/partner" className="bg-brand-500 hover:bg-brand-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors">
              Start Earning — It's Free
            </Link>
            <a href="#how-it-works" className="border border-white/30 text-white px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors">
              See How It Works
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-6">No fees. No contracts. No experience needed.</p>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-10 text-sm text-gray-500">
          <div className="flex items-center gap-2"><span className="text-2xl font-bold text-gray-900">25%</span> flat commission on every payment</div>
          <div className="w-px h-6 bg-gray-300 hidden sm:block" />
          <div className="flex items-center gap-2"><span className="text-2xl font-bold text-gray-900">$0</span> cost to become a partner</div>
          <div className="w-px h-6 bg-gray-300 hidden sm:block" />
          <div className="flex items-center gap-2"><span className="text-2xl font-bold text-gray-900">∞</span> no cap on earnings</div>
          <div className="w-px h-6 bg-gray-300 hidden sm:block" />
          <div className="flex items-center gap-2"><span className="text-2xl font-bold text-gray-900">0</span> services to deliver yourself</div>
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Four steps stand between you and a recurring income stream.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(step => (
              <div key={step.n} className="relative">
                <div className="text-5xl font-black text-brand-100 mb-4">{step.n}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings calculator */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What could you actually make?</h2>
            <p className="text-gray-500 text-lg">
              Based on our average client retainer of <strong>$597/month</strong>. Your 25% commission = <strong>$149/month per client</strong>.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Clients referred</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Monthly commission</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Annual commission</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">What that looks like</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((row, i) => (
                  <tr key={row.clients} className={`border-b border-gray-100 ${i === 3 ? 'bg-brand-50' : ''}`}>
                    <td className="py-4 px-4">
                      <span className={`text-2xl font-bold ${i === 3 ? 'text-brand-600' : 'text-gray-900'}`}>{row.clients}</span>
                      <span className="text-gray-400 text-sm ml-1">clients</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xl font-bold ${i === 3 ? 'text-brand-600' : 'text-gray-900'}`}>{row.monthly}</span>
                      <span className="text-gray-400 text-sm">/mo</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xl font-bold ${i === 3 ? 'text-brand-600' : 'text-gray-900'}`}>{row.annual}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${i === 3 ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'}`}>
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Commission continues every month as long as the client is active. No ceiling — the table above goes as far as you take it.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The cleanest side business you can run</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              No inventory. No overhead. No client calls at midnight. Just refer and earn.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Zero service delivery',
                body: 'We handle onboarding, strategy, execution, and monthly reporting for every client you refer. Your only job is the introduction.',
              },
              {
                icon: '🛡️',
                title: 'We own all support',
                body: "Client questions, revisions, account changes — all handled by our team. You'll never be stuck between an unhappy client and a deadline.",
              },
              {
                icon: '📈',
                title: 'Recurring commissions',
                body: 'This isn\'t a one-time finder\'s fee. You earn 25% of every invoice — month after month, for as long as the client stays. Refer once, earn forever.',
              },
              {
                icon: '🔗',
                title: 'One link does it all',
                body: 'Your unique referral link tracks every signup automatically. Share it anywhere — Instagram bio, LinkedIn, email signature, text message.',
              },
              {
                icon: '💳',
                title: 'Transparent dashboard',
                body: 'See every client you\'ve referred, every commission earned, and your current balance — all in real time inside your partner portal.',
              },
              {
                icon: '💰',
                title: 'Fast withdrawals',
                body: 'Hit $250 in your balance and request a payout to PayPal. We process withdrawals fast — no waiting 60 days for a check.',
              },
            ].map(item => (
              <div key={item.title} className="border border-gray-200 rounded-xl p-6 hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-20 px-6 bg-brand-950 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Who is this perfect for?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🧑‍💼', role: 'Freelancers', desc: 'Already working with business owners? Add a revenue stream without adding to your workload.' },
              { icon: '📱', role: 'Social media creators', desc: "If your audience includes entrepreneurs or local businesses, you're sitting on untapped income." },
              { icon: '🏢', role: 'Consultants & coaches', desc: 'Your clients need marketing. Now you have a vetted agency to refer them to — and get paid for it.' },
              { icon: '🤝', role: 'Networkers', desc: "You know people. That's the only skill you need. Every business owner in your network is a potential commission." },
              { icon: '💻', role: 'Remote workers', desc: 'Looking for income that doesn\'t trade time for money? Referral commissions run 24/7, even when you\'re offline.' },
              { icon: '🌱', role: 'Anyone who wants more', desc: "Side hustle, second income, or something that grows into full-time — the opportunity scales exactly as fast as you want it to." },
            ].map(item => (
              <div key={item.role} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-bold text-white mb-2">{item.role}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map(faq => (
              <div key={faq.q} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to start earning?</h2>
          <p className="text-brand-200 text-xl mb-10">
            Create your free partner account today. Your referral link will be live in minutes.
          </p>
          <Link
            href="/register/partner"
            className="inline-block bg-white text-brand-700 font-bold text-xl px-10 py-5 rounded-2xl hover:bg-brand-50 transition-colors shadow-xl"
          >
            Create My Partner Account — Free
          </Link>
          <p className="text-brand-300 text-sm mt-6">No credit card. No monthly fee. Just sign up and share your link.</p>
        </div>
      </section>

      {/* Footer */}
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
