import { Context } from 'hono'
import { setCookie } from 'hono/cookie'
import RouteBuilder from '../../../builders/route-builder'
import SessionRepository from '../../../../repositories/session-repository'
import { RepositoryObj } from '../../../../repositories/services-registration'
import { checkGuild, createToken, getUserData } from '../../../utils/discord'

export default class auth extends RouteBuilder<Promise<Response> | Response> {
  private readonly sessionRepository: SessionRepository

  constructor({sessionRepository}: RepositoryObj) {
    super({
      path: '/auth/discord/redirect',
      method: 'get'
    })
    this.sessionRepository = sessionRepository
  }

  public async event(c: Context): Promise<Response> {
    try {

      const code = c.req.query('code')
      if (!code) return c.redirect('/')

      const data = await createToken(code)
      if (!data) return c.redirect('/')


      const accessToken = data.access_token

      if (!await checkGuild(accessToken)) return c.redirect('/')

      const userRes = await getUserData(accessToken)
      if (!userRes) return c.redirect('/')
        
      await this.sessionRepository.createSession(userRes.id, data.refresh_token)

      setCookie(c, 'token', accessToken, { expires: new Date(Date.now() + data.expires_in * 1000) })
    } catch (error) {
      console.log(error)
    }
    return c.redirect('/')
  }

}
