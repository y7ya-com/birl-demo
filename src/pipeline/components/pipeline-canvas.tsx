import { Fragment, useEffect, useRef } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { useStore } from '@tanstack/react-form'

import { useWorkflowBuilder } from '../form/context'
import { PipelineStepCard } from './pipeline-step-card'

function StepConnector() {
  return (
    <div className="flex shrink-0 items-center text-gray-300" aria-hidden="true">
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <path d="M0 6h20m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function PipelineCanvas() {
  const { form } = useWorkflowBuilder()
  const steps = useStore(form.store, (state) => state.values.steps)
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevLengthRef = useRef(steps.length)

  useEffect(() => {
    if (steps.length > prevLengthRef.current && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
    prevLengthRef.current = steps.length
  }, [steps.length])

  return (
    <Droppable droppableId="pipeline" direction="horizontal">
      {(provided, snapshot) => (
        <div
          ref={(el) => {
            provided.innerRef(el)
            ;(scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          }}
          data-pipeline-dropzone
          className={`overflow-x-auto rounded-md border p-4 transition-colors sm:p-5 ${snapshot.isDraggingOver ? 'border-gray-300 bg-gray-50' : 'border-dashed border-gray-300'}`}
          {...provided.droppableProps}
        >
          <div className={`flex items-center gap-3 ${steps.length > 0 ? 'w-max' : 'w-full justify-center'}`}>
            {steps.map((step, index) => (
              <Fragment key={step.id}>
                {index > 0 && <StepConnector />}
                <PipelineStepCard step={step} index={index} />
              </Fragment>
            ))}

            {provided.placeholder}

            {steps.length === 0 && (
              <div className="mx-auto w-full max-w-sm rounded-md border border-dashed border-gray-300 px-6 py-8 text-center">
                <p className="text-base font-medium text-gray-900">Add a function</p>
                <p className="mt-1 text-sm text-gray-400">Drag or click a function from the library.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  )
}
