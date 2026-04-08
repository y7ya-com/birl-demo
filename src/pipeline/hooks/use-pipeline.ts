import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { runPipeline } from '../utils/run-pipeline'
import type { WorkflowStep, WorkflowTraceEntry } from '../utils/run-pipeline'

export type PipelineRunResult = {
  trace: WorkflowTraceEntry[]
  output: unknown
}

function createEmptyResult() {
  const result: PipelineRunResult = { trace: [], output: undefined }
  return result
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The run failed'
}

export function usePipeline() {
  const [currentResult, setCurrentResult] = useState<PipelineRunResult | null>(null)

  const mutation = useMutation({
    mutationKey: ['runPipeline'],
    onMutate: () => {
      setCurrentResult(createEmptyResult())
    },
    onSuccess: () => {
      setCurrentResult(null)
    },
    mutationFn: async ({ input, steps }: { input: string; steps: WorkflowStep[] }) => {
      let nextResult = createEmptyResult()

      try {
        for await (const chunk of runPipeline(input, steps)) {
          if (chunk.type === 'step') {
            nextResult = {
              ...nextResult,
              trace: [...nextResult.trace, chunk.data],
            }
            setCurrentResult(nextResult)
            continue
          }

          if (chunk.type === 'success') {
            nextResult = {
              ...nextResult,
              output: chunk.data.output,
            }
            setCurrentResult(nextResult)
            return nextResult
          }

          throw new Error(chunk.data.error)
        }

        return nextResult
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
  })

  return {
    ...mutation,
    result: mutation.data ?? currentResult,
  }
}
