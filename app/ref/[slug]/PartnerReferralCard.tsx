'use client'
import Link from 'next/link'
import { useEffect } from 'react'

export default function PartnerReferralCard({ name, company, bio, photoUrl, slug }: { name: string; company: string; bio: string; photoUrl: string; slug: string }) {
  useEffect(() => {
    const maxAge = 60 * 60 * 24 * 30
    document.cookie = `referral_slug=${slug}; path=/; max-age=${maxAge}; samesite=lax`
  }, [slug])
  return (
    <div className="card p-8 max-w-md w-full text-center">
      {photoUrl ? (
        <img src={photoUrl} alt={name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-4xl mx-auto mb-4">
          {name[0]}
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
      {company && <p className="text-gray-500 mt-1">{company}</p>}
      {bio && <p className="text-gray-600 mt-3 text-sm">{bio}</p>}

      <div className="mt-8 space-y-3">
        <p className="text-sm text-gray-500">Ready to grow your business?</p>
        <Link
          href={`/register/client?ref=${slug}`}
          className="block btn-primary text-center text-base py-3"
        >
          Get Started
        </Link>
        <Link href="/services" className="block text-brand-600 text-sm hover:underline">
          View our services
        </Link>
      </div>
    </div>
  )
}
