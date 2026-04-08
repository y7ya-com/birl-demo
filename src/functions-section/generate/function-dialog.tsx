import { useState } from 'react'

import { FieldError } from '../../components/field-error'
import { Dialog } from '../../components/dialog'
import { useWorkflowBuilder } from '../../pipeline/form/context'

function GenerateDialogBody({ stepIndex }: { stepIndex: number }) {
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
    </div>
  )
}

export function GenerateFunctionDialog({ stepIndex }: { stepIndex: number }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700" onClick={() => setOpen(true)}>
        Configure
      </button>
      <Dialog open={open} onOpenChange={setOpen} title="Configure generate">
        <GenerateDialogBody stepIndex={stepIndex} />
      </Dialog>
    </>
  )
}
