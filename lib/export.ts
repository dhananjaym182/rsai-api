import { ChatSession } from '@/types'

export function exportChatAsMarkdown(session: ChatSession): string {
  const lines: string[] = []

  lines.push(`# ${session.title}`)
  lines.push('')
  lines.push(`**Created:** ${new Date(session.createdAt).toLocaleString()}`)
  lines.push(`**Updated:** ${new Date(session.updatedAt).toLocaleString()}`)
  if (session.model) {
    lines.push(`**Model:** ${session.model}`)
  }
  lines.push('')
  lines.push('---')
  lines.push('')

  for (const message of session.messages) {
    const role = message.role === 'user' ? '👤 User' : '🤖 Assistant'
    lines.push(`## ${role}`)
    lines.push('')
    lines.push(message.content)
    lines.push('')
  }

  return lines.join('\n')
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
