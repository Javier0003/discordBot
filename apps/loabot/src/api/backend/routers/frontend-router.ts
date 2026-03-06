import CustomHonoApp from "..";
import { readdirSync } from "fs";
import Page from "../../builders/page-builder";
import { join } from "path";


export default class FrontendRouter {
    private readonly honoApp: CustomHonoApp;

    constructor(honoApp: CustomHonoApp) {
        this.honoApp = honoApp;
        this.pageHandler();
    }


    private getLayout(path: string, pages: string[]) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const Layout = require(`${path}/${pages.filter((page) =>
                page.startsWith('Layout')
            )}`).default

            return Layout
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return null
        }
    }

    private pageHandler() {
        const path = join(__dirname, '../../frontend')
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
        this.honoApp[PageInstance.method.toLowerCase()](PageInstance.path, (c) => {
            return PageInstance.event(c)
        })

        const routes = pages.filter((page) => !page.endsWith('.tsx') && !page.endsWith('.js'))

        for (const route of routes) {
            this.subFolderPathHandler(`${path}/${route}`)
        }
    }

    private subFolderPathHandler(path: string) {
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

            const Layout = this.getLayout(path, pages)


            let pathRoute = path.split('frontend/').pop()!

            if (pathRoute.includes('[:id]')) {
                if (pathRoute.endsWith('/[:id]')) {
                    pathRoute = pathRoute.replace('/[:id]', '/:id')
                } else {
                    pathRoute = pathRoute.replace('[:id]', '/:id')
                }
            }


            const PageInstance = Layout ? new Page(HomePage, pathRoute, Layout) : new Page(HomePage, pathRoute)

            if (!PageInstance.path || !PageInstance.method) return

            // @ts-expect-error I don't know the type for this
            this.honoApp[PageInstance.method.toLowerCase()](PageInstance.path, (c) => {
                return PageInstance.event(c)
            })

            const routes = pages.filter((page) => !page.endsWith('.tsx') && !page.endsWith('.js'))

            for (const route of routes) {
                this.subFolderPathHandler(`${path}/${route}`)
            }
        } catch (error) {
            console.log(error)
        }
    }
}