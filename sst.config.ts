/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      home: 'cloudflare',
      name: 'birl',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
    }
  },
  async run() {
    const site = new sst.cloudflare.Worker('BirlSite', {
      handler: 'src/pipeline/worker/index.server.ts',
      assets: {
        directory: './dist',
      },
      transform: {
        worker(args) {
          args.bindings = [
            {
              type: 'ai',
              name: 'AI',
            },
          ]
        },
      },
      url: true,
    })

    return {
      url: site.url,
    }
  },
})
