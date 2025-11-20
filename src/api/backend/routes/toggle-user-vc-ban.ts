import { Context } from 'hono'
import RouteBuilder from '../utils/route-handler/route-builder'
import { db } from '../../../utils/db'
import { serverUsers } from '../../../../drizzle/schemas/schema'
import { and, eq } from 'drizzle-orm'

export default class ToggleUserVCBan extends RouteBuilder<Promise<Response> | Response> {
  constructor() {
    super({
      path: '/user/:id/vcban',
      method: 'patch',
      devOnly: true
    })
  }

  public async event(c: Context): Promise<Response> {
    try {
      const userId = c.req.param('id')
      const body = await c.req.json<{ isVCBan: string }>()

      const [user] = await db.select().from(serverUsers).where(eq(serverUsers.idServerUser, userId)).limit(1)

      if (!user) {
        await db.insert(serverUsers).values({ idServerUser: userId, isDev: '0', isVCBan: body.isVCBan })
      } else {
        await db.update(serverUsers).set({ isVCBan: body.isVCBan }).where(eq(serverUsers.idServerUser, userId))
      }

      return c.json({ success: true, user: {...user, isVCBan: body.isVCBan} })
    } catch (error) {
      console.log(error)
      return c.json({ success: false })
    }
  }
}