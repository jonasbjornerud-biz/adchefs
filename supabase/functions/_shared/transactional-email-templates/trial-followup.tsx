import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  subject?: string
  body?: string
  first_name?: string
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', color: '#0f0f17' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const para = { fontSize: '15px', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const, margin: '0 0 12px' }

const Email = ({ subject = 'Quick follow-up on your trial task', body = '' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={para}>{body}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Props) => data?.subject || 'Quick follow-up on your trial task',
  displayName: 'Trial task follow-up',
  previewData: { subject: 'Quick follow-up', body: 'Hi Jane, just checking in...', first_name: 'Jane' },
} satisfies TemplateEntry