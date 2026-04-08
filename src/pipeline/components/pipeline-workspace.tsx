import { useEffect, useRef, useState } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { Tabs } from '@base-ui/react/tabs'
import { useStore } from '@tanstack/react-form'

import { FunctionLibrarySection } from '../../functions-section'
import { InputSection } from '../../input-section'
import { OutputSection } from '../../output-section/components/output-section'
import { useWorkflowBuilder } from '../form/context'
import type { WorkflowStep } from '../utils/run-pipeline'
import { PipelineSection } from './pipeline-section'

export default function PipelineWorkspace() {
  const { form, pipeline, moveStep, insertStep } = useWorkflowBuilder()
  const input = useStore(form.store, (state) => state.values.input)
  const pipelineErrorMessage = pipeline.error?.message || ''

  const [activeTab, setActiveTab] = useState<string | number>('build')
  const wasRunning = useRef(false)

  useEffect(() => {
    if (pipeline.isPending && !wasRunning.current) {
      setActiveTab('output')
    }
    wasRunning.current = pipeline.isPending
  }, [pipeline.isPending])

  const handleDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (!destination) {
      return
    }

    if (source.droppableId === 'pipeline' && destination.droppableId === 'pipeline') {
      moveStep(source.index, destination.index)
      return
    }

    if (source.droppableId === 'function-library' && destination.droppableId === 'pipeline') {
      void insertStep(draggableId as WorkflowStep['type'], destination.index)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full w-full">
        <FunctionLibrarySection />

        <Tabs.Root
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex min-w-0 flex-1 flex-col"
        >
          <div className="flex shrink-0 items-center border-b border-gray-200 bg-white px-5">
            <Tabs.List className="flex">
              <Tabs.Tab
                value="build"
                className="border-b-2 px-4 py-3 text-sm font-medium transition-colors data-[active]:border-gray-900 data-[active]:text-gray-900 not-data-[active]:border-transparent not-data-[active]:text-gray-400 not-data-[active]:hover:text-gray-600"
              >
                Build
              </Tabs.Tab>
              <Tabs.Tab
                value="output"
                className="border-b-2 px-4 py-3 text-sm font-medium transition-colors data-[active]:border-gray-900 data-[active]:text-gray-900 not-data-[active]:border-transparent not-data-[active]:text-gray-400 not-data-[active]:hover:text-gray-600"
              >
                Output
              </Tabs.Tab>
            </Tabs.List>
          </div>

          <Tabs.Panel value="build" className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex w-full max-w-5xl flex-1 flex-col gap-5 p-5">
              <InputSection />
              <PipelineSection
                runErrorMessage={pipelineErrorMessage}
                isRunning={pipeline.isPending}
              />
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="output" className="flex-1 overflow-y-auto">
            <div className="w-full max-w-5xl p-5">
              <OutputSection input={input} result={pipeline.result} error={pipeline.error} isIdle={pipeline.isIdle} isRunning={pipeline.isPending} />
            </div>
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </DragDropContext>
  )
}
