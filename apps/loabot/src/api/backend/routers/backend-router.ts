import { serveStatic } from '@hono/node-server/serve-static'
import { join } from "path";
import CustomHonoApp from "..";
import { readdirSync } from "fs";
import { Context } from 'hono';
import RouteBuilder from '../../builders/route-builder';

const BASE_STATIC_PATH = 'src/api/backend/static'

export default class BackendRouter {
    private readonly honoApp: CustomHonoApp;
    constructor(honoApp: CustomHonoApp) {
        this.honoApp = honoApp
        this.routeBuilder()
        this.staticFileHandler()
    }

    private routeBuilder() {
        const path = join(__dirname, '../routes')
        const firstCheck = readdirSync(path)

        const folders: string[] = []
        const routes: string[] = []

        firstCheck.forEach(file => {
            if(!file.includes('.')) {
                folders.push(file)
            } else {
                routes.push(file)
            }
        })

        for (const folder of folders) {
            routes.push(... this.subFolderPathHandler(`${path}/${folder}`))
        }
        const sortedRoutes = routes.sort((e) => e.includes('_') ? -1 : 1)

        for (const filePath of sortedRoutes) {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const route = require(`${path}/${filePath}`).default

            const routeInstance = new route(this.honoApp.getRepositories()) as RouteBuilder<Promise<Response>>

            if (!routeInstance.path || !routeInstance.method) return

            if (routeInstance.method === 'use') {
                this.honoApp.use((c, next) => {
                    c.repositories = this.honoApp.getRepositories()
                    return routeInstance.event(c, next)
                })
                continue
            }

            console.log(`Registering route: [${routeInstance.method.toUpperCase()}] /api${routeInstance.path}`)
            // @ts-expect-error I don't know the type for this
            this.honoApp[routeInstance.method.toLowerCase()](`/api${routeInstance.path}`, async (c: Context) => {
                c.repositories = this.honoApp.getRepositories()
                try {
                    console.log(`Handling ${routeInstance.method.toUpperCase()} request for ${routeInstance.path}`)

                    if (c.userData) {
                        console.log(`username: ${c.userData.username}`)
                        console.log(`id: ${c.userData.id}`)
                    }

                    if (routeInstance.devOnly) {
                        console.log('dev only route')
                        const dev = await this.honoApp.getRepositories().serverUsersRepository.getById(c.userData.id)

                        if (dev?.isDev !== '1') {
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

    private subFolderPathHandler(path: string): string[] {
        const pages = readdirSync(path)

        return pages.reduce<string[]>((acc, page) => {
            const fullPath = `${path}/${page}`

            if (!page.includes('.')) {
                acc.push(...this.subFolderPathHandler(fullPath))
            } else {
                acc.push(fullPath.replace(join(__dirname, '../routes/') , ''))
            }

            return acc
        }, [])
    }

    private staticFileHandler() {
        const files: string[] = []

        files.push(...this.exploreFolder(BASE_STATIC_PATH))

        for (const file of files) {
            this.honoApp.use(`/static/${file}`, serveStatic({ path: join(BASE_STATIC_PATH, file) }));
        }
    }

    private exploreFolder(folderPath: string, basePath = BASE_STATIC_PATH) {
        const staticFolder = readdirSync(folderPath)
        const files: string[] = []

        staticFolder.forEach(file => {
            const fullPath = join(folderPath, file)
            if (!file.includes('.')) {
                files.push(...this.exploreFolder(fullPath, basePath))
            } else {
                files.push(fullPath.replace(basePath + '/', ''))
            }
        })

        return files
    }
}