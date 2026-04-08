import * as v from 'valibot'

export const enrichStepSchema = v.object({
  id: v.string(),
  type: v.literal('enrich'),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Step name is required')),
  prompt: v.pipe(v.string(), v.trim(), v.minLength(1, 'Instructions are required')),
  referenceData: v.optional(v.string()),
  referenceFileName: v.optional(v.string()),
})
