import { Context } from 'hono'
import RouteBuilder from '../utils/route-handler/route-builder'
import { db } from '../../../utils/db'
import { serverUsers } from '../../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'

export default class ToggleUserRole extends RouteBuilder<Promise<Response> | Response> {
  constructor() {
    super({
      path: '/user/:id/role',
      method: 'patch',
      devOnly: true
    })
  }

  public async event(c: Context): Promise<Response> {
    try {
      const userId = c.req.param('id')
      const body = await c.req.json<{ isDev: string }>()

      const [user] = await db.select().from(serverUsers).where(eq(serverUsers.idServerUser, userId)).limit(1)

      if (!user) {
        await db.insert(serverUsers).values({ idServerUser: userId, isDev: body.isDev, isVCBan: '0' })
      } else {
        await db.update(serverUsers).set({ isDev: body.isDev }).where(eq(serverUsers.idServerUser, userId))
      }

      return c.json({ success: true, user: { ...user, isDev: body.isDev } })
    } catch (error) {
      console.log(error)
      return c.json({ success: false })
    }
  }
}