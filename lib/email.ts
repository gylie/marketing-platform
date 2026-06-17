import { getSetting } from './settings'

interface EmailPayload {
  to: string
  subject: string
  html: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const provider = await getSetting('email_provider')
  const from = (await getSetting('email_from')) || 'noreply@example.com'

  if (provider === 'resend') {
    const apiKey = await getSetting('resend_api_key')
    if (!apiKey) throw new Error('Resend API key not configured')
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    await resend.emails.send({ from, to: payload.to, subject: payload.subject, html: payload.html })
  } else {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: await getSetting('smtp_host'),
      port: parseInt((await getSetting('smtp_port')) || '587'),
      secure: false,
      auth: {
        user: await getSetting('smtp_user'),
        pass: await getSetting('smtp_password'),
      },
    })
    await transporter.sendMail({ from, ...payload })
  }
}

export function partnerWelcomeEmail(name: string, loginUrl: string): string {
  return `<h2>Welcome, ${name}!</h2><p>Your partner account is ready. <a href="${loginUrl}">Log in here</a>.</p>`
}

export function clientWelcomeEmail(name: string, loginUrl: string): string {
  return `<h2>Welcome, ${name}!</h2><p>Your client account is ready. <a href="${loginUrl}">Log in here</a>.</p>`
}

export function commissionEarnedEmail(partnerName: string, amount: string): string {
  return `<h2>Commission Earned!</h2><p>Hi ${partnerName}, you earned $${amount} in commission.</p>`
}

export function withdrawalApprovedEmail(partnerName: string, amount: string): string {
  return `<h2>Withdrawal Approved</h2><p>Hi ${partnerName}, your withdrawal of $${amount} has been approved.</p>`
}

export function withdrawalRejectedEmail(partnerName: string, amount: string, note: string): string {
  return `<h2>Withdrawal Update</h2><p>Hi ${partnerName}, your withdrawal of $${amount} was not approved. Reason: ${note}</p>`
}

export function changeRequestUpdateEmail(clientName: string, title: string, status: string): string {
  return `<h2>Request Update</h2><p>Hi ${clientName}, your request "${title}" status changed to: ${status}.</p>`
}
