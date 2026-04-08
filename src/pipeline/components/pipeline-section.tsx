import { useStore } from '@tanstack/react-form'

import { getValidationMessage } from '../../components/field-error'
import { useWorkflowBuilder } from '../form/context'
import { PipelineCanvas } from './pipeline-canvas'

interface PipelineSectionProps {
  runErrorMessage: string
  isRunning: boolean
}

export function PipelineSection({ runErrorMessage, isRunning }: PipelineSectionProps) {
  const { form } = useWorkflowBuilder()
  const [canSubmit, validationError] = useStore(form.store, (state) => [
    state.canSubmit,
    state.errorMap.onChange ?? state.errorMap.onSubmit,
  ])
  const errorMessage = getValidationMessage(validationError) || runErrorMessage

  return (
    <section className="grid gap-3 rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">Pipeline</h2>
        <div className="flex items-center gap-3">
          {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
          <button
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${isRunning ? 'cursor-not-allowed bg-gray-400 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'} ${!canSubmit ? 'cursor-not-allowed opacity-50' : ''}`}
            type="submit"
            disabled={isRunning}
            aria-disabled={!canSubmit}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      <PipelineCanvas />
    </section>
  )
}
