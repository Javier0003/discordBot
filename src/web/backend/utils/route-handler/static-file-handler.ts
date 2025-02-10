import { serveStatic } from '@hono/node-server/serve-static'
import { readdirSync } from 'fs'
import { Hono } from 'hono'
import { join } from 'path'

export default function staticFileHandler(honoApp: Hono) {
  const path = join('src/web/backend/static')
  const files = readdirSync(path)

  for(const file of files){
    honoApp.use(`/static/${file}`, serveStatic({ path: `src/web/backend/static/${file}` }));
  }
}