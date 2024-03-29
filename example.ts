import { compression } from './mod.ts'
import { Server } from 'https://deno.land/std@0.181.0/http/server.ts'

const s = new Server({
  handler: async (req) => {
    return await compression({
      path: 'README.md',
    })(req)
  },
  port: 3000,
})

s.listenAndServe()
console.log(
  'Server available at http://localhost:3000. Set Accept-Encoding header to \'gzip\', for example, to get a compressed response.',
)
