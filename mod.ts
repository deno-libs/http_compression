import { readAll } from 'https://deno.land/std@0.181.0/streams/read_all.ts'
import { compress as brotli } from 'https://deno.land/x/brotli@0.1.7/mod.ts'
import { Foras } from 'https://deno.land/x/foras@2.0.8/src/deno/mod.ts'
import { Accepts } from 'https://deno.land/x/accepts@2.1.1/mod.ts'

await Foras.initBundledOnce()

const funcs = {
  br: brotli,
  gzip: (body: Uint8Array) => Foras.gzip(body, undefined),
  deflate: (body: Uint8Array) => Foras.deflate(body, undefined),
}

/**
 * Supported compression algorithms
 */
type Compression = 'gzip' | 'br' | 'deflate'

export type CompressionOptions = Partial<{
  /**
   * Path to file
   */
  path: string

  /**
   * Body as a byte array (as returned from Deno.readFile methods)
   */
  bodyBinary: Uint8Array

  /**
   * Body as a string (as returned from Deno.readTextFile)
   */
  bodyText: string
}>

/**
 * HTTP Compression middleware.
 * @param {CompressionOptions} opts
 *
 * @example
 * ```ts
import { compression } from 'https://deno.land/x/http_compression/mod.ts'
import { Server } from 'https://deno.land/std@0.181.0/http/server.ts'

new Server({
  handler: async (req) => {
    return await compression({ path, compression: ['br', 'gzip', 'deflate'] })(req)
  }, port: 3000
}).listenAndServe()
 * ```
 */
export const compression =
  (opts: CompressionOptions) => async (req: Request): Promise<Response> => {
    const acceptHeader = req.headers.get('Accept-Encoding')

    const accepts = new Accepts(req.headers)

    const encodings = accepts.encodings()

    let buf: Uint8Array
    if (opts.bodyBinary) {
      buf = opts.bodyBinary
    } else if (opts.bodyText) {
      const encoder = new TextEncoder()
      buf = encoder.encode(opts.bodyText)
    } else if (opts.path) {
      const file = await Deno.open(opts.path)
      buf = await readAll(file)
      file.close()
    } else {
      throw Error('Must specify either bodyBinary, bodyText, or path.')
    }

    if (
      !acceptHeader || acceptHeader === 'identity' ||
      (Array.isArray(encodings) && encodings[0] === 'identity')
    ) {
      return new Response(buf, {
        status: 200,
        headers: new Headers({
          'Content-Encoding': 'identity',
        }),
      })
    } else if (acceptHeader === '*') {
      const compressed = funcs.gzip(buf)

      return new Response(compressed, {
        headers: new Headers({
          'Content-Encoding': 'gzip',
        }),
      })
    } else {
      if (Array.isArray(encodings)) {
        let compressed: Uint8Array = buf
        const encs: string[] = []

        for (let enc of encodings.filter((x) => x !== 'identity')) {
          if (enc === 'brotli') enc = 'br'

          if (Object.keys(funcs).includes(enc as string)) {
            compressed = funcs[enc as Compression](compressed)
            encs.push(enc)
          }
        }

        return new Response(compressed, {
          headers: new Headers({
            'Content-Encoding': encs.join(', '),
          }),
        })
      } else {
        return Object.keys(funcs).includes(encodings as string)
          ? new Response(funcs[encodings as Compression](buf), {
            headers: new Headers({
              'Content-Encoding': encodings as string,
            }),
          })
          : new Response('Not Acceptable', {
            status: 406,
          })
      }
    }
  }
