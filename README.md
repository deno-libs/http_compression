<div align="center">

# compression

[![nest badge][nest-badge]](https://nest.land/package/compress) [![GitHub Workflow Status][gh-actions-img]][github-actions]
[![Codecov][cov-badge]][cov] [![][docs-badge]][docs] [![][code-quality-img]][code-quality]

</div>

Deno HTTP compression middleware.

## Features

- `gzip`, `deflate` and `brotli` support
- Detects supported encodings with `Accept-Encoding` header
- Respects encodings order (depending on `Accept-Encoding` value)
- Creates a `Content-Encoding` header with applied compression
- Send `409 Not Acceptable` if encoding is not supported

## Example

```ts
import { compression } from 'https://deno.land/x/compression/mod.ts'
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
```

Now try to send a `HEAD` request with `curl`:

```sh
$ curl localhost:3000 --head -H "Accept-Encoding: br, gzip, deflate" --compressed
HTTP/1.1 200 OK
content-length: 550
content-encoding: br, gzip, deflate
```

[docs-badge]: https://img.shields.io/github/v/release/deno-libs/compress?label=Docs&logo=deno&style=for-the-badge&color=DD3FAA
[docs]: https://doc.deno.land/https/deno.land/x/compress/mod.ts
[gh-actions-img]: https://img.shields.io/github/workflow/status/deno-libs/compress/CI?style=for-the-badge&logo=github&label=&color=DD3FAA
[github-actions]: https://github.com/deno-libs/compress/actions
[cov]: https://coveralls.io/github/deno-libs/compress
[cov-badge]: https://img.shields.io/coveralls/github/deno-libs/compress?style=for-the-badge&color=DD3FAA
[nest-badge]: https://img.shields.io/badge/publushed%20on-nest.land-DD3FAA?style=for-the-badge
[code-quality-img]: https://img.shields.io/codefactor/grade/github/deno-libs/compress?style=for-the-badge&color=DD3FAA
[code-quality]: https://www.codefactor.io/repository/github/deno-libs/compress
