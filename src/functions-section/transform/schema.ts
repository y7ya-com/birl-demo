import * as v from 'valibot'

export const fieldTypes = ['text', 'number', 'boolean', 'list'] as const
export type FieldType = (typeof fieldTypes)[number]

export const fieldSchema = v.object({
  id: v.string(),
  key: v.pipe(v.string(), v.trim(), v.minLength(1, 'Field key is required')),
  label: v.pipe(v.string(), v.trim(), v.minLength(1, 'Field label is required')),
  type: v.picklist(fieldTypes),
  required: v.boolean(),
  instructions: v.string(),
})

export const transformStepSchema = v.object({
  id: v.string(),
  type: v.literal('transform'),
  name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Step name is required')),
  instructions: v.string(),
  fields: v.pipe(v.array(fieldSchema), v.minLength(1, 'Add at least one field')),
})
