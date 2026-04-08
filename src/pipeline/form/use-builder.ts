import type * as v from 'valibot'
import { useForm } from '@tanstack/react-form'

import { createFunctionStep, createSampleSteps, sampleInput } from '../../sample-input'
import { usePipeline } from '../hooks/use-pipeline'
import { runRequestSchema, type WorkflowStep } from '../utils/run-pipeline'

type RunRequest = v.InferOutput<typeof runRequestSchema>

function createDefaultValues(): RunRequest {
  return {
    input: sampleInput,
    steps: createSampleSteps(),
  }
}

function createEmptyValues(): RunRequest {
  return {
    input: '',
    steps: [],
  }
}

export function useCreateWorkflowBuilder() {
  const pipeline = usePipeline()
  const form = useForm({
    defaultValues: createEmptyValues(),
    validators: {
      onChange: runRequestSchema,
      onSubmit: runRequestSchema,
    },
    onSubmit: async ({ value }) => {
      await pipeline.mutateAsync(value)
    },
  })

  const resetBuilder = (values: RunRequest) => {
    pipeline.reset()
    form.reset(values, { keepDefaultValues: true })
  }

  const removeStep = async (stepId: string) => {
    const stepIndex = form.state.values.steps.findIndex((step) => step.id === stepId)

    if (stepIndex < 0) {
      return
    }

    await form.removeFieldValue('steps', stepIndex)
  }

  return {
    form,
    pipeline,
    appendStep: (type: WorkflowStep['type']) => form.pushFieldValue('steps', createFunctionStep(type)),
    insertStep: (type: WorkflowStep['type'], index: number) => form.insertFieldValue('steps', index, createFunctionStep(type)),
    removeStep,
    moveStep: (startIndex: number, finishIndex: number) => {
      if (startIndex !== finishIndex) {
        form.moveFieldValues('steps', startIndex, finishIndex)
      }
    },
    restoreStarterFlow: () => resetBuilder(createDefaultValues()),
    clearWorkspace: () => {
      if (window.confirm('Clear?')) {
        resetBuilder(createEmptyValues())
      }
    },
  }
}

export type WorkflowBuilderState = ReturnType<typeof useCreateWorkflowBuilder>
