import { FieldError } from '../components/field-error'
import { useWorkflowBuilder } from '../pipeline/form/context'

export function InputSection() {
  const { form } = useWorkflowBuilder()

  return (
    <form.Field
      name="input"
      children={(field) => (
        <section className="grid gap-2 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">Input</h2>
          <textarea
            className="w-full rounded-md border border-gray-300 p-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400"
            rows={2}
            placeholder="Paste raw item data here..."
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
          />
          <FieldError error={field.state.meta.errors[0]} />
        </section>
      )}
    />
  )
}
