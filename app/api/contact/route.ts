import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { getSetting } from '@/lib/settings'

export async function POST(req: Request) {
  const { name, email, message } = await req.json()
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  try {
    const adminEmail =
      process.env.ADMIN_EMAIL ||
      (await getSetting('email_from')) ||
      'contact@businessmold.com'

    await sendEmail({
      to: adminEmail,
      subject: `Contact form: ${name}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    })
  } catch {}

  return NextResponse.json({ success: true })
}
