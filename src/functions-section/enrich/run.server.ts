import * as v from 'valibot'

import { runAiText } from '../../pipeline/worker/ai.server'
import { enrichStepSchema } from './schema'

function asText(value: unknown) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

export async function runEnrich(input: unknown, step: v.InferOutput<typeof enrichStepSchema>) {
  const source = asText(input)

  const referenceBlock =
    step.referenceData && step.referenceFileName
      ? `Reference Data:\nFilename: ${step.referenceFileName}\n${step.referenceData}`
      : ''

  try {
    const output = await runAiText(
      [
        {
          role: 'system',
          content: `You enrich content using the input plus any inline reference data provided in the prompt. If a Reference Data section is present, treat it as available context and use it directly. Do not say the file is missing or ask the user to attach it again. Return ONLY the enriched data as plain key-value pairs. No preamble, no introduction, no "Here is" prefix. Start directly with the first field. Use GBP (£) for all prices.`,
        },
        {
          role: 'user',
          content: `Instructions:\n${step.prompt}\n\n${referenceBlock ? `${referenceBlock}\n\n` : ''}Input:\n${source}`,
        },
      ],
    )

    return output || source
  } catch {
    return source
  }
}
