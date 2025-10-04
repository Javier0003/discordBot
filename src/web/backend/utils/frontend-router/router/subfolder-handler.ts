import { Hono } from 'hono'
import { getLayout } from './get-layout'
import Page from './page-builder'
import { readdirSync } from 'fs'

export function subFolderPathHandler(path: string, honoApp: Hono) {
  try {
    if (path.endsWith('components')) return;
    if (path.endsWith('constants')) return;
    if (path.endsWith('styles')) return;
    if (path.endsWith('assets')) return;
    if (path.endsWith('hooks')) return;
    if (path.endsWith('api')) return;
    if (path.endsWith('utils')) return;
    if (path.endsWith('.ico')) return;

    const pages = readdirSync(path)

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const HomePage = require(`${path}/${pages.filter((page) =>
      page.startsWith('page')
    )}`).default

    const Layout = getLayout(path, pages)

    let pathRoute = path.split('frontend/').pop()!
    if(pathRoute.includes('[:id]')){
      pathRoute = pathRoute.replace('[:id]', '/:id')
    }

    const PageInstance = Layout ? new Page(HomePage, pathRoute, Layout) : new Page(HomePage, pathRoute)

    if (!PageInstance.path || !PageInstance.method) return

    // @ts-expect-error I don't know the type for this
    honoApp[PageInstance.method.toLowerCase()](PageInstance.path, (c) => {
      return PageInstance.event(c)
    })

    const routes = pages.filter((page) => !page.endsWith('.tsx') && !page.endsWith('.js'))

    for (const route of routes) {
      subFolderPathHandler(`${path}/${route}`, honoApp)
    }
  } catch (error) {
    console.log(error)
  }
}