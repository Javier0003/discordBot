import { Context } from 'hono'
import RouteBuilder from '../utils/route-handler/route-builder'
import { setCookie } from 'hono/cookie'
import { db } from '../../../utils/db'
import { sessionTable } from '../../../../drizzle/schemas/schema'
import { checkGuild, createToken, DiscordTokenResponse, getUserData, UserData } from '../utils/discord'

export default class auth extends RouteBuilder<Promise<Response> | Response> {
  constructor() {
    super('/auth/discord/redirect', 'get')
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

      await insertSession(userRes, data)

      setCookie(c, 'token', accessToken, { expires: new Date(Date.now() + data.expires_in * 1000) })
    } catch (error) {
      console.log(error)
    }
    return c.redirect('/')
  }
}

async function insertSession(userRes: UserData, data: DiscordTokenResponse) {
  try {
    await db.insert(sessionTable).values({ id: userRes.id, refreshToken: data.refresh_token })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log("session already exists")
  }
}