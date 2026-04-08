import * as v from 'valibot'

import { runAiText } from '../../pipeline/worker/ai.server'
import { generateStepSchema } from './schema'

function asText(value: unknown) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

export async function runGenerate(input: unknown, step: v.InferOutput<typeof generateStepSchema>) {
  const source = asText(input)

  try {
    const output = await runAiText(
      [
        {
          role: 'system',
          content: `You generate polished resale listing copy based on the provided instruction. Return plain text only. No markdown, no bold, no asterisks, no headers. Use GBP (£) for all prices. Do not include the price in the generated copy. Write in a professional, concise tone suitable for a resale marketplace listing.`,
        },
        {
          role: 'user',
          content: `Instructions:\n${step.prompt}\n\nInput Data:\n${source}`,
        },
      ],
    )

    return output || source
  } catch {
    return source
  }
}
