import { Hono } from 'hono'
import { UserData } from '../utils/discord'
import { serve } from '@hono/node-server'
import env from '../../env'
import { RepositoryObj } from '../../repositories/services-registration'
import FrontendRouter from './routers/frontend-router'
import BackendRouter from './routers/backend-router'

declare module 'hono' {
  interface Context {
    userData: UserData
    repositories: RepositoryObj
  }
}



class CustomHonoApp extends Hono {
  private repositories: RepositoryObj
  private readonly frontendRouter: FrontendRouter
  private readonly backendRouter: BackendRouter

  constructor(repositories: RepositoryObj) {
    super()
    this.repositories = repositories
    this.backendRouter = new BackendRouter(this)
    this.frontendRouter = new FrontendRouter(this)

    this.init()
  }

  public getRepositories(): RepositoryObj {
    return this.repositories
  }

  private init() {
    serve(
      {
        fetch: this.fetch,
        port: 42069
      },
      (info) => {
        console.log(`Server is running on port ${env.DOMAIN ?? "http://localhost:"}${info.port}`)
      }
    )
  }
}


export default CustomHonoApp