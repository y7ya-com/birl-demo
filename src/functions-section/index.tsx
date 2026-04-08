import { Droppable } from '@hello-pangea/dnd'

import { useWorkflowBuilder } from '../pipeline/form/context'
import { FunctionCard } from './function-card'

export function FunctionLibrarySection() {
  const { appendStep } = useWorkflowBuilder()

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-gray-400">Functions</h2>
      </div>
      <Droppable droppableId="function-library" isDropDisabled>
        {(provided) => (
          <div ref={provided.innerRef} className="grid gap-1 px-3" {...provided.droppableProps}>
            <FunctionCard
              type="enrich"
              title="Enrich"
              description="Add context from reference data"
              example={{
                input: "Levi's jacket, Size L",
                output: "Levi's jacket, Size L — Material: 100% Cotton Denim, RRP: £98, Estimated resale: £39",
                explanation: 'Enriches the input by cross-referencing an uploaded reference file like a brand catalogue, price list, or size chart.',
                referenceFile: 'brand_catalog.csv',
              }}
              index={0}
              onAdd={() => appendStep('enrich')}
            />
            <FunctionCard
              type="transform"
              title="Transform"
              description="Extract structured fields"
              example={{
                input: "Levi's denim jacket, large, slight fade on front",
                output: "Brand: Levi's\nItem: Jacket\nSize: L\nCondition: Good\nDefects: Slight fade on front",
                explanation: 'Extracts structured fields from free-form text using AI. You define the field names and types — the output is a clean, structured record.',
              }}
              index={1}
              onAdd={() => appendStep('transform')}
            />
            <FunctionCard
              type="generate"
              title="Generate"
              description="Create polished content"
              example={{
                input: "Brand: Levi's, Item: Jacket, Condition: Good, Defects: slight fade",
                output: "Levi's Denim Jacket — Classic denim jacket in good condition. Features natural fading for a lived-in look.",
                explanation: 'Generates polished listing copy from structured data. Ideal for titles, descriptions, and marketing text.',
              }}
              index={2}
              onAdd={() => appendStep('generate')}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </aside>
  )
}
