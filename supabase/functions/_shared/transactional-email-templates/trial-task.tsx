import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'

interface Props {
  subject?: string
  body?: string
  first_name?: string
}

// Minimal, "organic" Gmail-style email: no Body backgroundColor, no Container,
// no borders. Just plain paragraphs so mobile clients render it like a normal
// personal email rather than wrapping it in a styled card.
const Email = ({ subject = 'Your AdChefs trial task', body = '' }: Props) => {
  const paragraphs = (body || '').split(/\n{2,}/)
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{subject}</title>
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <div style={{ display: 'none', overflow: 'hidden', lineHeight: 1, opacity: 0, maxHeight: 0, maxWidth: 0 }}>
          {subject}
        </div>
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.5', color: '#222' }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ margin: '0 0 14px 0', whiteSpace: 'pre-wrap' }}>{p}</p>
          ))}
        </div>
      </body>
    </html>
  )
}

export const template = {
  component: Email,
  subject: (data: Props) => data?.subject || 'Your AdChefs trial task',
  displayName: 'Trial task invitation',
  previewData: { subject: 'Your AdChefs trial task', body: 'Hi Jane,\n\nHere is your trial task...', first_name: 'Jane' },
} satisfies TemplateEntry