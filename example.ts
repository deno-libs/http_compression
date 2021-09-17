import { compression } from './mod.ts'
import { Server } from 'https://deno.land/std@0.107.0/http/server.ts'

const s = new Server({
  handler: async (req) => {
    return await compression({
      path: 'README.md',
      compression: ['br', 'gzip', 'deflate']
    })(req)
  },
  addr: ':3000'
})

s.listenAndServe()
