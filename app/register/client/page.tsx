import { Suspense } from 'react'
import ClientRegisterForm from './ClientRegisterForm'

export default function ClientRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
      <ClientRegisterForm />
    </Suspense>
  )
}
