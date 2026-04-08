import { Draggable } from '@hello-pangea/dnd'
import { Popover } from '@base-ui/react/popover'

type FunctionType = 'enrich' | 'transform' | 'generate'

interface FunctionExample {
  input: string
  output: string
  explanation: string
  referenceFile?: string
}

interface FunctionCardProps {
  type: FunctionType
  title: string
  description: string
  example: FunctionExample
  index: number
  onAdd: () => void
}

export function FunctionCard({ type, title, description, example, index, onAdd }: FunctionCardProps) {
  return (
    <Draggable draggableId={type} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={`cursor-grab rounded-md border px-3 py-2.5 text-left transition-all ${snapshot.isDragging ? 'border-gray-300 bg-white shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
          onClick={onAdd}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onAdd()
            }
          }}
          style={provided.draggableProps.style}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              <p className="mt-0.5 text-xs leading-tight text-gray-400">{description}</p>
            </div>

            <Popover.Root>
              <Popover.Trigger
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400 text-xs font-semibold text-gray-500 transition-colors hover:border-gray-500 hover:bg-gray-100 hover:text-gray-700"
                onClick={(event) => event.stopPropagation()}
              >
                ?
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner side="right" align="start" sideOffset={8}>
                  <Popover.Popup className="w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                    <Popover.Arrow className="fill-white [&>path:first-child]:fill-gray-200" />
                    <p className="text-sm text-gray-600">{example.explanation}</p>
                    {example.referenceFile && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500">
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="shrink-0 text-gray-400"><path d="M2 1.5A.5.5 0 0 1 2.5 1h5.086a.5.5 0 0 1 .353.146l1.915 1.915A.5.5 0 0 1 10 3.415V10.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-9Z" stroke="currentColor" strokeWidth="1"/></svg>
                        {example.referenceFile}
                      </div>
                    )}
                    <div className="mt-3 grid gap-2">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-gray-400">Input</div>
                        <div className="mt-0.5 rounded bg-gray-50 px-2 py-1.5 text-xs text-gray-600">{example.input}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-gray-400">Output</div>
                        <div className="mt-0.5 whitespace-pre-wrap rounded bg-gray-50 px-2 py-1.5 text-xs text-gray-600">{example.output}</div>
                      </div>
                    </div>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      )}
    </Draggable>
  )
}
