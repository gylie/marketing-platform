import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  const { name, email, message } = await req.json()
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || (await import('@/lib/settings').then(m => m.getSetting('email_from')))
    await sendEmail({
      to: adminEmail,
      subject: `Contact form: ${name}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    })
  } catch {}

  return NextResponse.json({ success: true })
}
