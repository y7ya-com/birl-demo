import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import type { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  children: ReactNode
  popupClassName?: string
}

export function Dialog({ open, onOpenChange, title, children, popupClassName }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-black/25" />
        <BaseDialog.Viewport className="fixed inset-0 grid overflow-y-auto p-4">
          <BaseDialog.Popup className={`m-auto w-[800px] max-w-[90vw] rounded-lg border border-gray-200 bg-white shadow-xl ${popupClassName ?? ''}`}>
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
              <BaseDialog.Title className="text-base font-semibold text-gray-900">{title}</BaseDialog.Title>
              <BaseDialog.Close className="rounded-md px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">Close</BaseDialog.Close>
            </div>
            <div className="px-5 py-4">{children}</div>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
