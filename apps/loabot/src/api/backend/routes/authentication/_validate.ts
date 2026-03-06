import { Context, Next } from 'hono'
import { deleteCookie, getCookie } from 'hono/cookie'
import RouteBuilder from '../../../builders/route-builder'
import UserRepository from '../../../../repositories/user-repository'
import { RepositoryObj } from '../../../../repositories/services-registration'
import { getUserData } from '../../../utils/discord'

export default class Validate extends RouteBuilder<Promise<Response | void>> {
  private readonly userRepository: UserRepository
  constructor({ userRepository }: RepositoryObj) {
    super({
      path: '/',
      method: 'use'
    })
    this.userRepository = userRepository
  }

  public async event(c: Context, next: Next): Promise<Response | void> {
    if (c.req.path === '/api/auth/discord/redirect') return await next()
    if (c.req.path === '/static/osu.svg') return await next()

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