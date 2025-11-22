import { serveStatic } from '@hono/node-server/serve-static'
import { readdirSync } from 'fs'
import { Hono } from 'hono'
import { join } from 'path'

const BASE_STATIC_PATH = 'src/api/backend/static'

export default function staticFileHandler(honoApp: Hono) {
  const files: string[] = []

  files.push(...exploreFolder(BASE_STATIC_PATH))

  for(const file of files){
    honoApp.use(`/static/${file}`, serveStatic({ path: join(BASE_STATIC_PATH, file) }));
  }
}

function exploreFolder(folderPath: string, basePath = BASE_STATIC_PATH) {
  const staticFolder = readdirSync(folderPath)
  const files: string[] = []

  staticFolder.forEach(file => {
    const fullPath = join(folderPath, file)
    if (!file.includes('.')) {
      files.push(...exploreFolder(fullPath, basePath))
    } else {
      files.push(fullPath.replace(basePath + '/', ''))
    }
  })

  return files
}