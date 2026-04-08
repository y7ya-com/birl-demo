const MODEL = '@cf/meta/llama-3.1-8b-instruct-fast'

type AiBinding = {
  run(
    model: string,
    input: {
      messages: Array<{ role: string; content: string }>
      temperature?: number
      max_tokens?: number
    }
  ): Promise<{ response?: string }>
}

let ai: AiBinding | undefined

export function setAiBinding(env: { AI?: AiBinding }) {
  ai = env.AI
}

export function clearAiBinding() {
  ai = undefined
}

export async function runAiText(messages: Array<{ role: string; content: string }>) {
  if (!ai) {
    throw new Error('AI is not available')
  }

  return (
    await ai.run(MODEL, {
      messages,
      temperature: 0.1,
      max_tokens: 500,
    })
  ).response?.trim() ?? ''
}
