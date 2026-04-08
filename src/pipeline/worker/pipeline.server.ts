import { stepRunners } from '../../functions-section/runners.server'
import { clearAiBinding, setAiBinding } from './ai.server'
import type { WorkflowStep, WorkflowStreamEvent, WorkflowTraceEntry } from '../utils/run-pipeline'
import type { Env } from './index.server'

const encoder = new TextEncoder()

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The run failed'
}

function encodeEvent(event: WorkflowStreamEvent) {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
}

function runStep(input: unknown, step: WorkflowStep) {
  return stepRunners[step.type](input, step as never)
}

async function* executePipeline(input: string, steps: WorkflowStep[], env: Env) {
  let currentValue: unknown = input
  setAiBinding(env)

  try {
    for (const step of steps) {
      const stepInput = currentValue
      currentValue = await runStep(currentValue, step)

      const traceEntry: WorkflowTraceEntry = {
        stepId: step.id,
        stepName: step.name,
        stepType: step.type,
        input: stepInput,
        output: currentValue,
      }

      yield { type: 'step', data: traceEntry } satisfies WorkflowStreamEvent
    }

    yield { type: 'success', data: { output: currentValue } } satisfies WorkflowStreamEvent
  } finally {
    clearAiBinding()
  }
}

export function streamPipeline(input: string, steps: WorkflowStep[], env: Env) {
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of executePipeline(input, steps, env)) {
          controller.enqueue(encodeEvent(event))
        }
      } catch (error) {
        controller.enqueue(encodeEvent({ type: 'error', data: { error: getErrorMessage(error) } }))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive',
    },
  })
}
