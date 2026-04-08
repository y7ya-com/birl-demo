import { Draggable } from '@hello-pangea/dnd'

import { EnrichFunctionDialog } from '../../functions-section/enrich/function-dialog'
import { GenerateFunctionDialog } from '../../functions-section/generate/function-dialog'
import { EnrichPipelineStepMeta } from '../../functions-section/enrich/pipeline-step-meta'
import { TransformFunctionDialog } from '../../functions-section/transform/function-dialog'
import { useWorkflowBuilder } from '../form/context'
import type { WorkflowStep } from '../utils/run-pipeline'

interface PipelineStepCardProps {
  step: WorkflowStep
  index: number
}

export function PipelineStepCard({ step, index }: PipelineStepCardProps) {
  const { removeStep } = useWorkflowBuilder()

  return (
    <Draggable draggableId={step.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={`grid w-64 shrink-0 cursor-grab gap-2.5 rounded-lg border bg-white p-4 text-left transition-shadow ${snapshot.isDragging ? 'border-gray-300 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
          style={provided.draggableProps.style}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-gray-400">Step {index + 1}</span>
          </div>

          <div className="grid min-w-0 gap-1 text-left">
            <span className="w-full truncate text-base font-semibold text-gray-900">{step.name}</span>
            {step.type === 'enrich' && <EnrichPipelineStepMeta step={step} />}
          </div>

          <div className="flex items-center gap-1.5 border-t border-gray-100 pt-2">
            {step.type === 'enrich' && <EnrichFunctionDialog stepIndex={index} step={step} />}
            {step.type === 'generate' && <GenerateFunctionDialog stepIndex={index} />}
            {step.type === 'transform' && <TransformFunctionDialog stepIndex={index} step={step} />}
            <button type="button" className="rounded-md px-2.5 py-1 text-sm font-medium text-gray-400 transition-colors hover:text-red-600" onClick={() => void removeStep(step.id)} aria-label="Remove step">
              Remove
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}
