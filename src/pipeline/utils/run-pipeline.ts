import * as v from 'valibot'
import { enrichStepSchema } from '../../functions-section/enrich/schema'
import { generateStepSchema } from '../../functions-section/generate/schema'
import { transformStepSchema } from '../../functions-section/transform/schema'

export const stepSchema = v.variant('type', [enrichStepSchema, generateStepSchema, transformStepSchema])

export const runRequestSchema = v.object({
  input: v.pipe(v.string(), v.trim(), v.minLength(1, 'Input is required')),
  steps: v.pipe(v.array(stepSchema), v.minLength(1, 'Add at least one step')),
})

export type WorkflowStep = v.InferOutput<typeof stepSchema>

export type WorkflowTraceEntry = {
  stepId: string
  stepName: string
  stepType: WorkflowStep['type']
  input: unknown
  output: unknown
}

export type WorkflowStreamEvent =
  | { type: 'step'; data: WorkflowTraceEntry }
  | { type: 'success'; data: { output: unknown } }
  | { type: 'error'; data: { error: string } }

function parseEventBlock(block: string) {
  const dataLine = block.split('\n').find((line) => line.startsWith('data: '))
  if (!dataLine) {
    return null
  }

  return JSON.parse(dataLine.slice(6)) as WorkflowStreamEvent
}

async function getResponseError(response: Response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const payload = (await response.json()) as { error?: string }
    return payload.error ?? `Request failed with status ${response.status}`
  }

  const text = await response.text()
  return text || `Request failed with status ${response.status}`
}

async function* readEventStream(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const blocks = buffer.split('\n\n')
      buffer = blocks.pop() ?? ''

      for (const block of blocks) {
        const event = parseEventBlock(block)
        if (event) {
          yield event
        }
      }
    }

    buffer += decoder.decode()
    const trailingEvent = parseEventBlock(buffer)
    if (trailingEvent) {
      yield trailingEvent
    }
  } finally {
    reader.releaseLock()
  }
}

export async function* runPipeline(input: string, steps: WorkflowStep[]) {
  const request = v.parse(runRequestSchema, { input, steps })

  const response = await fetch('/api/run', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(await getResponseError(response))
  }

  if (!response.body) {
    throw new Error('No response body')
  }

  yield* readEventStream(response.body)
}
