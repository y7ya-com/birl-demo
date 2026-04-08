interface OutputValueProps {
  value: unknown
  compact?: boolean
}

function formatLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function isLongText(value: string) {
  return value.includes('\n') || value.length > 120
}

export function OutputValue({ value, compact = false }: OutputValueProps) {
  if (value === null || value === undefined || value === '') {
    return <div className="text-sm text-gray-400">No value</div>
  }

  if (typeof value === 'string') {
    if (isLongText(value)) {
      return <div className="rounded-md border border-gray-200 bg-white p-3 text-sm leading-relaxed whitespace-pre-wrap">{value}</div>
    }

    return <div className="text-sm">{value}</div>
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return <div className="text-sm">{String(value)}</div>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <div className="text-sm text-gray-400">No items</div>
    }

    const onlyPrimitiveItems = value.every(
      (item) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean',
    )

    if (onlyPrimitiveItems) {
      return (
        <ul className="grid gap-2 text-sm">
          {value.map((item, index) => (
            <li key={index} className="rounded-md border border-gray-200 p-3">
              {String(item)}
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="grid gap-2">
        {value.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-md border border-gray-200 p-3">
            <div className="text-xs font-medium uppercase tracking-wider text-gray-400">Item {index + 1}</div>
            <OutputValue value={item} compact={true} />
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>)

    if (entries.length === 0) {
      return <div className="text-sm text-gray-400">No fields</div>
    }

    return (
      <div className="grid gap-2">
        {entries.map(([key, nestedValue]) => (
          <div key={key} className={`grid gap-1 ${compact ? '' : 'rounded-md border border-gray-200 p-3'}`}>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-400">{formatLabel(key)}</div>
            <OutputValue value={nestedValue} compact={true} />
          </div>
        ))}
      </div>
    )
  }

  return <div className="text-sm">{String(value)}</div>
}
