export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export function normalizeFieldKey(value: string) {
  return slugify(value)
}
