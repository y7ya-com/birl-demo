import * as v from 'valibot'

export const generateStepSchema = v.object({
  id: v.string(),
  type: v.literal('generate'),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Step name is required')),
  prompt: v.pipe(v.string(), v.trim(), v.minLength(1, 'Instructions are required')),
})
