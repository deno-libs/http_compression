# compression

Deno HTTP compression middleware.

## Features

- Detects supported encodings with `Accept-Encoding` header
- Supports chaining algorithms (e.g. `gzip` -> `br`)
- Creates a `Content-Encoding` header with applied compression
- Send `409 Not Acceptable` if encoding is not supported

## Example

```ts
import { serve } from 'https://deno.land/std@0.90.0/http/server.ts'
import { compression } from 'https://deno.land/x/compression/mod.ts'

const s = serve({ port: 3000 })

for await (const req of s) {
  await compression({
    path: 'README.md',
    // Apply all algos in a queue
    compression: ['gzip', 'deflate']
  })(req)
}
```
