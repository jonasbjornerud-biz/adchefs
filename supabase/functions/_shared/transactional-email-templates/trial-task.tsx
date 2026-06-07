import * as React from 'npm:react@18.3.1'
import { Body, Head, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  subject?: string
  body?: string
  first_name?: string
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  color: '#222222',
  margin: 0,
  padding: 0,
}
const para = {
  fontSize: '14px',
  lineHeight: '1.5',
  whiteSpace: 'pre-wrap' as const,
  margin: 0,
  color: '#222222',
}

const Email = ({ subject = 'Your AdChefs trial task', body = '' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Text style={para}>{body}</Text>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) => data?.subject || 'Your AdChefs trial task',
  displayName: 'Trial task invitation',
  previewData: { subject: 'Your AdChefs trial task', body: 'Hi Jane,\n\nHere is your trial task...', first_name: 'Jane' },
} satisfies TemplateEntry