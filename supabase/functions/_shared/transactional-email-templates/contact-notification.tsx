import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  company?: string
  email?: string
  message?: string
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', color: '#1A1A1A', margin: '0 0 12px' }
const text = { fontSize: '14px', color: '#1A1A1A', lineHeight: '1.6', margin: '0 0 8px' }
const label = { fontSize: '11px', color: '#75726B', letterSpacing: '1.5px', margin: '16px 0 2px' }
const hr = { borderColor: '#EEEDE8', margin: '20px 0' }

const Email = ({ name, company, email, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact request from {name || 'adchefs.com'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New contact request</Heading>
        <Text style={text}>A new message came in through the contact form on adchefs.com.</Text>
        <Hr style={hr} />
        <Text style={label}>NAME</Text>
        <Text style={text}>{name || '—'}</Text>
        <Text style={label}>COMPANY</Text>
        <Text style={text}>{company || '—'}</Text>
        <Text style={label}>EMAIL</Text>
        <Text style={text}>{email || '—'}</Text>
        <Text style={label}>MESSAGE</Text>
        <Text style={{ ...text, whiteSpace: 'pre-line' }}>{message || '—'}</Text>
        <Hr style={hr} />
        <Text style={{ ...text, color: '#75726B', fontSize: '12px' }}>
          Reply directly to {email || 'the sender'} to respond.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data?: Props) => `New contact request from ${data?.name || 'adchefs.com'}`,
  displayName: 'Contact form notification',
  previewData: {
    name: 'Jane Doe',
    company: 'Acme',
    email: 'jane@acme.com',
    message: 'We spend $20k/mo on Meta and need more creative volume.',
  },
  to: 'jonas@adchefs.com',
} satisfies TemplateEntry
