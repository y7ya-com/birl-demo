import type * as v from 'valibot'

import type { enrichStepSchema } from './schema'

interface EnrichPipelineStepMetaProps {
  step: v.InferOutput<typeof enrichStepSchema>
}

export function EnrichPipelineStepMeta({ step }: EnrichPipelineStepMetaProps) {
  if (!step.referenceFileName) {
    return null
  }

  return (
    <span className="text-xs text-gray-400 truncate flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
      {step.referenceFileName}
    </span>
  )
}
