import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'partners')

export async function savePartnerPhoto(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const ext = path.extname(file.name) || '.jpg'
  const allowed = ['.jpg', '.jpeg', '.png', '.webp']
  if (!allowed.includes(ext.toLowerCase())) throw new Error('Invalid file type')

  const filename = `${uuidv4()}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filepath, buffer)

  return `/uploads/partners/${filename}`
}

export async function deletePartnerPhoto(url: string): Promise<void> {
  if (!url || !url.startsWith('/uploads/partners/')) return
  const filepath = path.join(process.cwd(), 'public', url)
  await fs.unlink(filepath).catch(() => {})
}
