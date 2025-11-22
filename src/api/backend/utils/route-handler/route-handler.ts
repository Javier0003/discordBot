import { Hono } from 'hono'
import { readdirSync } from 'fs'
import { join } from 'path'
import { db } from '../../../../utils/db'
import { serverUsers } from '../../../../../drizzle/schemas/schema'
import { and, eq } from 'drizzle-orm'

export default function routeHandler(honoApp: Hono) {
  const path = join(__dirname, '../../routes')
  const routes = readdirSync(path).sort((e) => e.startsWith('_') ? -1 : 1)

  for (const filePath of routes) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const route = require(`${path}/${filePath}`).default

    const routeInstance = new route()

    if (!routeInstance.path || !routeInstance.method) return

    if (routeInstance.method === 'use') {
      honoApp.use((c, next) => {
        return routeInstance.event(c, next)
      })
      continue
    }

    // @ts-expect-error I don't know the type for this
    honoApp[routeInstance.method.toLowerCase()](`/api${routeInstance.path}`, async (c) => {
      try {
        console.log(`Handling ${routeInstance.method.toUpperCase()} request for ${routeInstance.path}`)

        if (c.userData) {
          console.log(`User data:`)
          console.log(`username: ${c.userData.username}`)
          console.log(`id: ${c.userData.id}`)
        }

        if (c.req.params) {
          console.log(`Request params:`)
          console.log(c.req.params)
        }

        if (routeInstance.devOnly) {
          console.log('dev only route')
          const [dev] = await db.select().from(serverUsers).where(and(eq(serverUsers.idServerUser, c.userData.id), eq(serverUsers.isDev, '1')))
          if (!dev) {
            return c.json({ success: false, message: "You are not authorized" }, 401)
          }
        }

        return await routeInstance.event(c)
      } catch (error) {
        console.log(error)
      }
    })
  }
}