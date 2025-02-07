import { Context, Next } from 'hono'
import RouteBuilder from '../utils/route-handler/route-builder'
import { deleteCookie, getCookie } from 'hono/cookie'
import { getUserData } from '../utils/discord'

export default class Validate extends RouteBuilder<Promise<Response | void>> {
  constructor() {
    super('/', 'use')
  }

  public async event(c: Context, next: Next): Promise<Response | void> {
    if (c.req.path === '/api/auth/discord/redirect') return await next()

    const cookie = getCookie(c, 'token')
    if (c.req.path === '/' && !cookie) return await next()
    
    const userData = await getUserData(cookie!)

    if (!userData) {
      deleteCookie(c, 'token')
      return c.redirect('/')
    }

    c.userData = userData
    await next()
  }
}