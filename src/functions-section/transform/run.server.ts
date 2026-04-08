import * as v from 'valibot'

import { runAiText } from '../../pipeline/worker/ai.server'
import { fieldSchema, transformStepSchema } from './schema'

const MAX_ATTEMPTS = 3

function asText(value: unknown) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

function codeFencesRemoved(value: string) {
  return value.replace(/```json/g, '').replace(/```/g, '').trim()
}

function emptyValue(field: v.InferOutput<typeof fieldSchema>) {
  if (field.type === 'number') return 0
  if (field.type === 'boolean') return false
  if (field.type === 'list') return []
  return ''
}

function fallbackTransform(input: unknown, fields: v.InferOutput<typeof fieldSchema>[]) {
  const source = asText(input)

  return Object.fromEntries(
    fields.map((field) => {
      if (field.type === 'text') return [field.key, source]
      if (field.type === 'list') return [field.key, source ? [source] : []]
      return [field.key, emptyValue(field)]
    }),
  )
}

function schemaForField(field: v.InferOutput<typeof fieldSchema>) {
  let schema: any

  if (field.type === 'number') {
    schema = v.number()
  } else if (field.type === 'boolean') {
    schema = v.boolean()
  } else if (field.type === 'list') {
    schema = v.array(v.string())
  } else {
    schema = v.string()
  }

  return field.required ? schema : v.optional(schema)
}

function createTransformSchema(fields: v.InferOutput<typeof fieldSchema>[]) {
  const entries: Record<string, any> = {}

  for (const field of fields) {
    entries[field.key] = schemaForField(field)
  }

  return v.object(entries)
}

function parseJson(raw: string) {
  let cleaned = codeFencesRemoved(raw)
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end >= start) {
    cleaned = cleaned.substring(start, end + 1)
  }
  return JSON.parse(cleaned) as unknown
}

function buildMessages(input: unknown, step: v.InferOutput<typeof transformStepSchema>, previousErrors: Array<{ response: string; error: string }>) {
  const fieldInstructions = step.fields.map((field) => {
    const details = [field.label, `key: ${field.key}`, `type: ${field.type}`, field.required ? 'required' : 'optional']
    if (field.instructions.trim()) details.push(field.instructions.trim())
    return `- ${details.join(' | ')}`
  })

  const messages = [
    {
      role: 'system',
      content: `You convert content into structured JSON. Return JSON only. No markdown. No explanation.`,
    },
    {
      role: 'user',
      content: `${step.instructions || 'Map the content into the requested fields.'}\n\nFields:\n${fieldInstructions.join('\n')}\n\nInput:\n${asText(input)}\n\nReturn JSON only.`,
    },
  ]

  for (const { response, error } of previousErrors) {
    messages.push({ role: 'assistant', content: response })
    messages.push({
      role: 'user',
      content: `That response caused an error:\n${error}\n\nPlease fix the issue and try again. Return ONLY valid JSON matching the exact fields requested.`,
    })
  }

  return messages
}

export async function runTransform(input: unknown, step: v.InferOutput<typeof transformStepSchema>) {
  const schema = createTransformSchema(step.fields)

  const previousErrors: Array<{ response: string; error: string }> = []

  try {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const raw = await runAiText(buildMessages(input, step, previousErrors))

      try {
        return v.parse(schema, parseJson(raw))
      } catch (error) {
        previousErrors.push({
          response: raw,
          error: error instanceof Error ? error.message : 'The response did not match the requested fields.',
        })
      }
    }

    throw new Error(`Cloudflare AI could not produce a valid transform response after ${MAX_ATTEMPTS} attempts. Last error: ${previousErrors[previousErrors.length - 1]?.error}`)
  } catch {
    return v.parse(schema, fallbackTransform(input, step.fields))
  }
}
