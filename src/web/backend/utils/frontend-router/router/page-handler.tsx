import { readdirSync } from 'fs'
import { join } from 'path'
import { Hono } from 'hono'
import Page from './page-builder'
import { subFolderPathHandler } from './subfolder-handler'

export default function pageHandler(honoApp: Hono) {
  const path = join(__dirname, '../../../../frontend')
  const pages = readdirSync(path)

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const HomePage = require(`${path}/${pages.filter((page) =>
    page.startsWith('page')
  )}`).default
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Layout = require(`${path}/${pages.filter((page) =>
    page.startsWith('Layout')
  )}`).default
  Page.LayoutDefault = Layout

  const PageInstance = new Page(HomePage, '')
  if (!PageInstance.path || !PageInstance.method) return

  // @ts-expect-error I don't know the type for this
  honoApp[PageInstance.method.toLowerCase()](PageInstance.path, (c) => {
    return PageInstance.event(c)
  })

  const routes = pages.filter((page) => !page.endsWith('.tsx'))

  for (const route of routes) {
    subFolderPathHandler(`${path}/${route}`, honoApp)
  }
}