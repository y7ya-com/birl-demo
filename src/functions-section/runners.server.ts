import { runEnrich } from './enrich/run.server'
import { runGenerate } from './generate/run.server'
import { runTransform } from './transform/run.server'
import type { WorkflowStep } from '../pipeline/utils/run-pipeline'

export const stepRunners: Record<WorkflowStep['type'], (input: unknown, step: never) => Promise<unknown>> = {
  enrich: runEnrich,
  generate: runGenerate,
  transform: runTransform,
}
