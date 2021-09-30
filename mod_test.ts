import { superdeno } from 'https://deno.land/x/superdeno@4.5.0/mod.ts'
import { describe, it, run } from 'https://deno.land/x/tincan@0.2.2/mod.ts'
import { compression } from './mod.ts'

describe('options', () => {
  it('does not apply compression if "Accept-Encoding" is "identity"', async () => {
    const request = superdeno(compression({ path: 'tests/example-file.md', compression: ['gzip'] }))

    await request
      .get('/')
      .set('Accept-Encoding', 'identity')
      .expect(200)
      .expect('Content-Encoding', 'identity')
      .expect('Content-Length', '2103')
  })
  it('applies compression to a file', async () => {
    const request = superdeno(compression({ path: 'tests/example-file.md', compression: ['br', 'gzip', 'deflate'] }))

    await request
      .get('/')
      .set('Accept-Encoding', 'br, gzip, deflate')
      .expect('Content-Length', '866')
      .expect('Content-Encoding', 'br, gzip, deflate')
  })
})

run()
