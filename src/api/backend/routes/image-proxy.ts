import { Context } from 'hono'
import RouteBuilder from '../../builders/route-builder'

export default class ImageProxy extends RouteBuilder<Promise<Response>> {
  constructor() {
    super({
      path: '/image-proxy',
      method: 'get'
    })
  }

  public async event(c: Context): Promise<Response> {
    const url = c.req.query('url')
    if (!url) return c.json({ success: false, message: 'Missing url' }, 400)

    let parsed: URL
    try {
      parsed = new URL(url)
    } catch (err) {
      return c.json({ success: false, message: 'Invalid url' }, 400)
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return c.json({ success: false, message: 'Invalid protocol' }, 400)
    }

    try {
      const res = await fetch(parsed.toString(), { redirect: 'follow' })
      if (!res.ok) return c.json({ success: false, message: 'Failed to fetch image' })

      const contentType = res.headers.get('content-type') || 'application/octet-stream'
      const buffer = await res.arrayBuffer()

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (err) {
      console.error(err)
      return c.json({ success: false, message: 'Error fetching image' }, 500)
    }
  }
}
