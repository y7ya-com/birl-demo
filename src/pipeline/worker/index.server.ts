/// <reference types="@cloudflare/workers-types" />
import * as v from 'valibot'
import { runRequestSchema } from '../utils/run-pipeline'
import { streamPipeline } from './pipeline.server'

export type Env = {
  ASSETS?: Fetcher
  AI?: {
    run(
      model: string,
      input: {
        messages: Array<{ role: string; content: string }>
        temperature?: number
        max_tokens?: number
      }
    ): Promise<{ response?: string }>
  }
}

async function handleRunRequest(request: Request, env: Env) {
  const { input, steps } = v.parse(runRequestSchema, await request.json())
  return streamPipeline(input, steps, env)
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname === '/api/run') {
      try {
        return await handleRunRequest(request, env)
      } catch (error) {
        return new Response(
          JSON.stringify({ status: 'error', error: error instanceof Error ? error.message : 'The run failed' }),
          { status: 500, headers: { 'content-type': 'application/json' } }
        )
      }
    }

    if (env.ASSETS) return env.ASSETS.fetch(request)
    return new Response('Not found', { status: 404 })
  },
}
