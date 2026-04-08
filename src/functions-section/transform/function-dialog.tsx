import React from 'react'
import { useState } from 'react'

import { Dialog } from '../../components/dialog'
import { FieldError } from '../../components/field-error'
import { useWorkflowBuilder } from '../../pipeline/form/context'
import { createSampleField } from '../../sample-input'
import { normalizeFieldKey } from '../../pipeline/utils/helpers'
import type { WorkflowStep } from '../../pipeline/utils/run-pipeline'

function TransformDialogBody({ stepIndex, step }: { stepIndex: number; step: Extract<WorkflowStep, { type: 'transform' }> }) {
  const { form } = useWorkflowBuilder()

  return (
    <div className="grid gap-6 items-start md:grid-cols-[1fr_250px]">
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
          name={`steps[${stepIndex}].instructions` as const}
          children={(field) => (
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-700">Instructions</span>
              <textarea
                rows={2}
                className="rounded-md border border-gray-300 p-2 text-sm outline-none transition-colors focus:border-gray-400"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError error={field.state.meta.errors[0]} />
            </label>
          )}
        />

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Fields</span>
            <button className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700" type="button" onClick={() => form.pushFieldValue(`steps[${stepIndex}].fields` as const, createSampleField('New field'))}>
              Add field
            </button>
          </div>

          <div className="grid gap-3">
            {step.fields.map((field, fieldIndex) => {
              return (
                <div key={field.id} className="grid gap-2 rounded-md border border-gray-200 p-3">
                  <div className="flex gap-2">
                    <form.Field
                      name={`steps[${stepIndex}].fields[${fieldIndex}].label` as const}
                      children={(labelField) => (
                        <div className="flex-1 grid gap-1">
                          <input
                            className="rounded-md border border-gray-300 p-1.5 text-sm font-medium outline-none transition-colors focus:border-gray-400"
                            placeholder="Field Label"
                            value={labelField.state.value}
                            onBlur={() => {
                              labelField.handleBlur()
                              form.setFieldValue(`steps[${stepIndex}].fields[${fieldIndex}].key` as const, normalizeFieldKey(labelField.state.value) || field.key)
                            }}
                            onChange={(event) => labelField.handleChange(event.target.value)}
                          />
                          <FieldError error={labelField.state.meta.errors[0]} />
                        </div>
                      )}
                    />

                    <form.Field
                      name={`steps[${stepIndex}].fields[${fieldIndex}].type` as const}
                      children={(typeField) => (
                        <select className="w-24 rounded-md border border-gray-300 p-1.5 text-sm outline-none transition-colors focus:border-gray-400" value={typeField.state.value} onBlur={typeField.handleBlur} onChange={(event) => typeField.handleChange(event.target.value as typeof field.type)}>
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="list">List</option>
                        </select>
                      )}
                    />

                    <button className="rounded-md px-2 py-1 text-sm text-gray-400 transition-colors hover:text-red-600" type="button" onClick={() => void form.removeFieldValue(`steps[${stepIndex}].fields` as const, fieldIndex)}>
                      X
                    </button>
                  </div>

                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-600">Advanced</summary>
                    <div className="mt-2 grid gap-2 border-l-2 border-gray-200 pl-3">
                      <form.Field
                        name={`steps[${stepIndex}].fields[${fieldIndex}].required` as const}
                        children={(requiredField) => (
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={requiredField.state.value} onBlur={requiredField.handleBlur} onChange={(event) => requiredField.handleChange(event.target.checked)} />
                            <span>Required</span>
                          </label>
                        )}
                      />

                      <form.Field
                        name={`steps[${stepIndex}].fields[${fieldIndex}].instructions` as const}
                        children={(guidanceField) => (
                          <label className="grid gap-1">
                            <span>Guidance</span>
                            <input className="w-full rounded-md border border-gray-300 p-1.5 text-sm outline-none transition-colors focus:border-gray-400" value={guidanceField.state.value} onBlur={guidanceField.handleBlur} onChange={(event) => guidanceField.handleChange(event.target.value)} />
                            <FieldError error={guidanceField.state.meta.errors[0]} />
                          </label>
                        )}
                      />

                      <form.Field
                        name={`steps[${stepIndex}].fields[${fieldIndex}].key` as const}
                        children={(keyField) => (
                          <label className="grid gap-1">
                            <span>Key</span>
                            <input className="w-full rounded-md border border-gray-300 p-1.5 text-sm outline-none transition-colors focus:border-gray-400" value={keyField.state.value} onBlur={keyField.handleBlur} onChange={(event) => keyField.handleChange(normalizeFieldKey(event.target.value))} />
                            <FieldError error={keyField.state.meta.errors[0]} />
                          </label>
                        )}
                      />
                    </div>
                  </details>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="sticky top-0 grid gap-3 rounded-md border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Live Preview</h3>
        <div className="grid gap-3 text-sm">
          {step.fields.map((field) => (
            <div key={field.id} className="grid gap-0.5">
              <span className="text-sm font-medium text-gray-700">{field.label || 'Unnamed'}:</span>
              <span className="text-gray-400">
                {field.type === 'boolean' && 'Yes'}
                {field.type === 'number' && '150'}
                {field.type === 'list' && <React.Fragment>&bull; Value 1<br />&bull; Value 2</React.Fragment>}
                {field.type === 'text' && 'Sample text value...'}
              </span>
            </div>
          ))}
          {step.fields.length === 0 && <span className="italic text-gray-400">Add fields to see a preview</span>}
        </div>
      </div>
    </div>
  )
}

export function TransformFunctionDialog({ stepIndex, step }: { stepIndex: number; step: Extract<WorkflowStep, { type: 'transform' }> }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700" onClick={() => setOpen(true)}>
        Configure
      </button>
      <Dialog open={open} onOpenChange={setOpen} title="Configure transform" popupClassName="max-w-[1100px]">
        <TransformDialogBody stepIndex={stepIndex} step={step} />
      </Dialog>
    </>
  )
}
