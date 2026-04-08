import { createContext, useContext, type ReactNode } from 'react'

import type { WorkflowBuilderState } from './use-builder'

const WorkflowBuilderContext = createContext<WorkflowBuilderState | null>(null)

export function WorkflowBuilderProvider({ value, children }: { value: WorkflowBuilderState; children: ReactNode }) {
  return <WorkflowBuilderContext.Provider value={value}>{children}</WorkflowBuilderContext.Provider>
}

export function useWorkflowBuilder() {
  const value = useContext(WorkflowBuilderContext)

  if (!value) {
    throw new Error('WorkflowBuilderProvider is missing')
  }

  return value
}
