import { superdeno } from 'https://deno.land/x/superdeno@4.6.0/mod.ts'
import { describe, it, run } from 'https://deno.land/x/tincan@0.2.2/mod.ts'
import { compression } from './mod.ts'

describe('options', () => {
  it('does not apply compression if "Accept-Encoding" is "identity"', async () => {
    const request = superdeno(compression({ path: 'LICENSE', compression: ['gzip'] }))

    await request
      .get('/')
      .set('Accept-Encoding', 'identity')
      .expect(200)
      .expect('Content-Encoding', 'identity')
      .expect('Content-Length', '1071')
  })
  it('applies compression to a file', async () => {
    const request = superdeno(
      compression({
        path: 'LICENSE',
        compression: ['br', 'gzip', 'deflate']
      })
    )
    await request
      .get('/')
      .set('Accept-Encoding', 'br, gzip, deflate')
      .expect('Content-Length', '628')
      .expect('Content-Encoding', 'br, gzip, deflate')
  })
  it('applies compression to a string', async () => {
    const bodyText = await Deno.readTextFile('LICENSE')
    const request = superdeno(compression({ bodyText, compression: ['br', 'gzip', 'deflate'] }))

    await request
      .get('/')
      .set('Accept-Encoding', 'br, gzip, deflate')
      .expect('Content-Length', '628')
      .expect('Content-Encoding', 'br, gzip, deflate')
  })
  it('applies compression to a byte array', async () => {
    const bodyBinary = await Deno.readFile('LICENSE')
    const request = superdeno(compression({ bodyBinary, compression: ['br', 'gzip', 'deflate'] }))

    await request
      .get('/')
      .set('Accept-Encoding', 'br, gzip, deflate')
      .expect('Content-Length', '628')
      .expect('Content-Encoding', 'br, gzip, deflate')
  })
})

run()
