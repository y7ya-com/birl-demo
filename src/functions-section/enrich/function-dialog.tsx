import { useState } from 'react'

import { FieldError } from '../../components/field-error'
import { Dialog } from '../../components/dialog'
import { useWorkflowBuilder } from '../../pipeline/form/context'
import type { WorkflowStep } from '../../pipeline/utils/run-pipeline'

function EnrichDialogBody({ stepIndex, referenceFileName }: { stepIndex: number; referenceFileName?: string }) {
  const { form } = useWorkflowBuilder()

  return (
    <div className="grid gap-4">
      <form.Field
        name={`steps[${stepIndex}].name` as const}
        children={(field) => (
          <label className="grid gap-1">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input className="rounded-md border border-gray-300 p-2 text-sm outline-none transition-colors focus:border-gray-400" value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} />
            <FieldError error={field.state.meta.errors[0]} />
          </label>
        )}
      />

      <form.Field
        name={`steps[${stepIndex}].prompt` as const}
        children={(field) => (
          <label className="grid gap-1">
            <span className="text-sm font-medium text-gray-700">Prompt</span>
            <textarea
              rows={4}
              className="rounded-md border border-gray-300 p-2 text-sm outline-none transition-colors focus:border-gray-400"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldError error={field.state.meta.errors[0]} />
          </label>
        )}
      />

      <div className="grid gap-1 rounded-md border border-gray-200 bg-gray-50 p-4">
        <span className="text-sm font-medium text-gray-700">Reference Data (Optional)</span>
        <p className="mb-2 text-xs text-gray-400">Upload context to enrich the input with (e.g. brand pricing guidelines, size charts)</p>

        {referenceFileName ? (
          <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-2">
            <span className="truncate text-sm">{referenceFileName}</span>
            <button
              className="rounded-md px-2 text-xs font-medium text-gray-400 transition-colors hover:text-red-600"
              type="button"
              onClick={() => {
                form.setFieldValue(`steps[${stepIndex}].referenceData` as const, undefined)
                form.setFieldValue(`steps[${stepIndex}].referenceFileName` as const, undefined)
              }}
            >
              Remove
            </button>
          </div>
        ) : (
          <input
            type="file"
            className="text-sm"
            accept=".txt,.csv,.json"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return

              const text = await file.text()

              form.setFieldValue(`steps[${stepIndex}].referenceData` as const, text)
              form.setFieldValue(`steps[${stepIndex}].referenceFileName` as const, file.name)
            }}
          />
        )}
      </div>
    </div>
  )
}

export function EnrichFunctionDialog({ stepIndex, step }: { stepIndex: number; step: Extract<WorkflowStep, { type: 'enrich' }> }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700" onClick={() => setOpen(true)}>
        Configure
      </button>
      <Dialog open={open} onOpenChange={setOpen} title="Configure enrich">
        <EnrichDialogBody stepIndex={stepIndex} referenceFileName={step.referenceFileName} />
      </Dialog>
    </>
  )
}
