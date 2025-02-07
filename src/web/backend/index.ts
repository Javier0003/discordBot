import { Hono } from 'hono'
import { UserData } from './utils/discord'
import routeHandler from './utils/route-handler/route-handler'
import pageHandler from './utils/frontend-router/router/page-handler'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import env from '../../env'

declare module 'hono' {
  interface Context {
    userData: UserData
  }
}
const honoApp = new Hono()

honoApp.use('/static/*', serveStatic({ path: 'src/web/backend/static/logo.ico' }));

routeHandler(honoApp)
pageHandler(honoApp)

export function startServer() {
  serve(
    {
      fetch: honoApp.fetch,
      port: 42069
    },
    (info) => {
      console.log(`Server is running on port ${env.DOMAIN ?? "http://localhost:"}${info.port}`)
    }
  )
}

export default honoApp