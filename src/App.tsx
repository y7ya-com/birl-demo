import PipelineWorkspace from './pipeline/components/pipeline-workspace'
import { WorkflowBuilderProvider } from './pipeline/form/context'
import { useCreateWorkflowBuilder } from './pipeline/form/use-builder'

export default function App() {
  const workflow = useCreateWorkflowBuilder()

  return (
    <WorkflowBuilderProvider value={workflow}>
      <div className="flex h-screen flex-col bg-gray-50">
        <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 py-2.5">
          <span className="text-sm font-semibold text-gray-900">Demo</span>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50" type="button" onClick={workflow.restoreStarterFlow}>
              Use example data
            </button>
            <button className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-red-600" type="button" onClick={workflow.clearWorkspace}>
              Clear everything
            </button>
          </div>
        </header>

        <form
          className="flex min-h-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            void workflow.form.handleSubmit()
          }}
        >
          <PipelineWorkspace />
        </form>
      </div>
    </WorkflowBuilderProvider>
  )
}
