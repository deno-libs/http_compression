# compression

[![GitHub release (latest by date)][releases]][releases-page] [![][docs-badge]][docs]

Deno HTTP compression middleware.

## Features

- Detects supported encodings with `Accept-Encoding` header
- Supports chaining algorithms (e.g. `gzip` -> `deflate`)
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

[releases]: https://img.shields.io/github/v/release/deno-libs/compression?style=flat-square
[docs-badge]: https://img.shields.io/github/v/release/deno-libs/compression?color=yellow&label=Documentation&logo=deno&style=flat-square
[docs]: https://doc.deno.land/https/deno.land/x/compression/mod.ts
[releases-page]: https://github.com/deno-libs/compression/releases
