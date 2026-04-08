import { useEffect, useState } from 'react'
import { Tabs } from '@base-ui/react/tabs'

import type { PipelineRunResult } from '../../pipeline/hooks/use-pipeline'
import type { WorkflowTraceEntry } from '../../pipeline/utils/run-pipeline'
import { OutputValue } from './output-value'

type ValueStage = {
  kind: 'value'
  id: string
  title: string
  eyebrow: string
  value: unknown
}

type TraceStage = {
  kind: 'trace'
  id: string
  title: string
  eyebrow: string
  input: unknown
  output: unknown
}

interface OutputSectionProps {
  input: string
  result: PipelineRunResult | null
  error: Error | null
  isIdle: boolean
  isRunning: boolean
}

function getStageEyebrow(_item: WorkflowTraceEntry, index: number) {
  return `Step ${index + 1}`
}

function getStages(input: string, result: PipelineRunResult | null) {
  if (!result) {
    return []
  }

  const traceStages = result.trace.map((item, index) => ({
    kind: 'trace',
    id: item.stepId,
    title: item.stepName,
    eyebrow: getStageEyebrow(item, index),
    input: item.input,
    output: item.output,
  }) satisfies TraceStage)

  const stages = [
    { kind: 'value', id: 'input', title: 'Original Data', eyebrow: 'Start', value: input } satisfies ValueStage,
    ...traceStages,
    { kind: 'value', id: 'final', title: 'Final Result', eyebrow: 'End', value: result.output } satisfies ValueStage,
  ]

  return stages
}

function getDefaultStageId(result: PipelineRunResult | null) {
  if (!result || result.output !== undefined) {
    return 'final'
  }

  return result.trace[result.trace.length - 1]?.stepId ?? 'input'
}

function StageContent({ stage }: { stage: ValueStage | TraceStage }) {
  if (stage.kind === 'trace') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid content-start min-w-0 gap-2">
          <div className="text-xs font-medium uppercase tracking-wider text-gray-400">Input</div>
          <div className="min-w-0 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4">
            <OutputValue value={stage.input} />
          </div>
        </div>

        <div className="grid content-start min-w-0 gap-2">
          <div className="text-xs font-medium uppercase tracking-wider text-gray-400">Output</div>
          <div className="min-w-0 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4">
            <OutputValue value={stage.output} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-w-0 gap-2">
      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">Value</div>
      <div className="min-w-0 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4">
        <OutputValue value={stage.value} />
      </div>
    </div>
  )
}

export function OutputSection({ input, result, error, isIdle, isRunning }: OutputSectionProps) {
  const statusMessage = error?.message || (isRunning ? 'Generating...' : '')

  const stages = getStages(input, result)
  const latestStageId = getDefaultStageId(result)

  const [activeStageId, setActiveStageId] = useState<string | number>(latestStageId)
  const [isAutoFollowing, setIsAutoFollowing] = useState(true)

  useEffect(() => {
    if (isAutoFollowing) {
      setActiveStageId(latestStageId)
    }
  }, [latestStageId, isAutoFollowing])

  useEffect(() => {
    if (isRunning) {
      setIsAutoFollowing(true)
    }
  }, [isRunning])

  const handleTabChange = (value: string | number) => {
    setActiveStageId(value)
    setIsAutoFollowing(false)
  }

  return (
    <section tabIndex={-1} className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">Output</h2>
        {!isIdle && !error && stages.length > 0 && (
          <span className="text-xs font-medium text-gray-400">{Math.max(stages.length - 2, 0)} steps</span>
        )}
      </div>

      {isIdle ? (
        <div className="rounded-md border border-dashed border-gray-300 px-6 py-10 text-center">
          <p className="text-base font-medium text-gray-900">No data to inspect</p>
          <p className="mt-1 text-sm text-gray-400">Run the pipeline to inspect the outputs at each step.</p>
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-base font-medium text-gray-900">Pipeline failed</p>
          <p className="mt-1 text-sm text-gray-500">{statusMessage}</p>
        </div>
      ) : isRunning && (!result || (result.trace.length === 0 && result.output === undefined)) ? (
        <div className="rounded-md border border-dashed border-gray-300 px-6 py-10 text-center">
          <p className="text-base font-medium text-gray-900">Generating...</p>
          <p className="mt-1 text-sm text-gray-400">Run is in progress...</p>
        </div>
      ) : (
        <Tabs.Root value={activeStageId} onValueChange={handleTabChange}>
          <Tabs.List className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
            {stages.map((stage) => (
              <Tabs.Tab
                key={stage.id}
                value={stage.id}
                className="shrink-0 border-b-2 px-3 py-2 text-left transition-colors data-[active]:border-gray-900 data-[active]:text-gray-900 not-data-[active]:border-transparent not-data-[active]:text-gray-400 not-data-[active]:hover:text-gray-600"
              >
                <div className="text-xs font-medium uppercase tracking-wider">{stage.eyebrow}</div>
                <div className="text-sm font-medium">{stage.title}</div>
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {stages.map((stage) => (
            <Tabs.Panel key={stage.id} value={stage.id} className="pt-4">
              <StageContent stage={stage} />
            </Tabs.Panel>
          ))}
        </Tabs.Root>
      )}
    </section>
  )
}
