import { serve } from 'https://deno.land/std@0.90.0/http/server.ts'
import { compression } from './mod.ts'

const s = serve({ port: 3000 })

for await (const req of s) {
  await compression({
    path: 'README.md',
    compression: ['gzip', 'deflate']
  })(req)
}
