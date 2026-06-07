import { template as trialTask } from './trial-task.tsx'
import { template as trialFollowup } from './trial-followup.tsx'

export interface TemplateEntry {
  component: (props: any) => any
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'trial-task': trialTask,
  'trial-followup': trialFollowup,
}