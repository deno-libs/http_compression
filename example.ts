import { serve } from 'https://deno.land/std@0.99.0/http/server.ts'
import { compression } from './mod.ts'

const s = serve({ port: 3000 })

for await (const req of s) {
  await compression({
    path: 'README.md',
    compression: ['br', 'gzip', 'deflate']
  })(req)
}
