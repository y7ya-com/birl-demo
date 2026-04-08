import type { InferOutput } from 'valibot'

import { enrichStepSchema } from './functions-section/enrich/schema'
import { generateStepSchema } from './functions-section/generate/schema'
import { fieldSchema, type FieldType, transformStepSchema } from './functions-section/transform/schema'
import { slugify } from './pipeline/utils/helpers'
import type { WorkflowStep } from './pipeline/utils/run-pipeline'

export const sampleInput =
  "Brand: Levi's, Item: jacket, Size: L, Notes: missing 2 buttons on the front, slight fade."

export const sampleCatalogCSV = `brand,category,original_price,material
Acne Studios,blazer,650,"100% Wool"
Acne Studios,sweater,350,"100% Wool"
Levi's,jacket,98,"100% Cotton Denim"
Levi's,jeans,90,"100% Cotton Denim"`

export function createSampleField(label = 'Title', type: FieldType = 'text') {
  const field: InferOutput<typeof fieldSchema> = {
    id: crypto.randomUUID(),
    key: slugify(label) || 'field',
    label,
    type,
    required: true,
    instructions: '',
  }

  return field
}

export function createEnrichStep(
  prompt = 'Look up the brand and material details based on the item type.',
  referenceFileName?: string,
  referenceData?: string,
) {
  const step: InferOutput<typeof enrichStepSchema> = {
    id: crypto.randomUUID(),
    type: 'enrich',
    name: 'Enrich',
    prompt,
    referenceFileName,
    referenceData,
  }

  return step
}

export function createGenerateStep() {
  const step: InferOutput<typeof generateStepSchema> = {
    id: crypto.randomUUID(),
    type: 'generate',
    name: 'Generate',
    prompt:
      'Write a product title and a short 2-3 sentence resale description. ' +
      'Include the brand, item type, size, material, and condition honestly. ' +
      'Mention visible faults briefly. Do not include the price in the copy. ' +
      'Keep it concise and professional.',
  }

  return step
}

export function createTransformStep() {
  const step: InferOutput<typeof transformStepSchema> = {
    id: crypto.randomUUID(),
    type: 'transform',
    name: 'Transform',
    instructions: 'Extract the fields from the generated content. For the price, use the estimated resale price if available, otherwise estimate based on the original price.',
    fields: [
      createSampleField('Title'),
      createSampleField('Description'),
      { ...createSampleField('Price', 'number'), instructions: 'The resale price in GBP as a whole number. Use the estimated resale price from the enriched data.' },
      createSampleField('Defects', 'list'),
    ],
  }

  return step
}

export function createFunctionStep(type: WorkflowStep['type']) {
  if (type === 'enrich') return createEnrichStep()
  if (type === 'generate') return createGenerateStep()
  return createTransformStep()
}

export function createSampleSteps() {
  const steps: WorkflowStep[] = [
    createEnrichStep(
      'Use the reference catalog below to add missing details for the item. ' +
        'Preserve the original facts exactly, especially condition notes and visible faults. ' +
        'Add material, original_price, and an estimated resale price at 40% of the original_price when a match is available. ' +
        'Return a concise structured summary that still includes the original defects.',
      'brand_catalog.csv',
      sampleCatalogCSV,
    ),
    createGenerateStep(),
    createTransformStep(),
  ]

  return steps
}
