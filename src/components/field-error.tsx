interface FieldErrorProps {
  error?: unknown
}

export function getValidationMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (Array.isArray(error)) {
    for (const item of error) {
      const message = getValidationMessage(item)

      if (message) {
        return message
      }
    }

    return ''
  }

  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }

    for (const value of Object.values(error)) {
      const message = getValidationMessage(value)

      if (message) {
        return message
      }
    }
  }

  return ''
}

export function FieldError({ error }: FieldErrorProps) {
  const message = getValidationMessage(error)

  if (!message) {
    return null
  }

  return (
    <p className="text-xs text-red-600" role="alert">
      {message}
    </p>
  )
}
