import { Hono } from 'hono'
import { readdirSync } from 'fs'
import { join } from 'path'

export default function routeHandler(honoApp: Hono){
  const path = join(__dirname, '../../routes')
  const routes = readdirSync(path).sort((e) => e.startsWith('_') ? -1 : 1)

  for (const filePath of routes){
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const route = require(`${path}/${filePath}`).default

    const routeInstance = new route()

    if (!routeInstance.path || !routeInstance.method) return

    if(routeInstance.method === 'use'){
      honoApp.use((c, next) => {
        return routeInstance.event(c, next)
      })
      continue
    }

    // @ts-expect-error I don't know the type for this
    honoApp[routeInstance.method.toLowerCase()](`/api${routeInstance.path}`, (c) => {
      return routeInstance.event(c)
    })
  }
}