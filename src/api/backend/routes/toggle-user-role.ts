import { Context } from 'hono'
import RouteBuilder from '../../builders/route-builder'
import { RepositoryObj } from '../../../repositories/services-registration'

export default class ToggleUserRole extends RouteBuilder<Promise<Response> | Response> {
  private readonly serverUsersRepository: RepositoryObj['serverUsersRepository']

  constructor({ serverUsersRepository }: RepositoryObj) {
    super({
      path: '/user/:id/role',
      method: 'patch',
      devOnly: true
    })

    this.serverUsersRepository = serverUsersRepository
  }

  public async event(c: Context): Promise<Response> {
    try {
      const userId = c.req.param('id')
      const body = await c.req.json<{ isDev: string }>()

      const user = await this.serverUsersRepository.getById(userId)

      if (!user) {
        await this.serverUsersRepository.create({ idServerUser: userId, isDev: body.isDev, isVCBan: '0' })
      } else {
        await this.serverUsersRepository.update(userId,{ isDev: body.isDev })
      }

      return c.json({ success: true, user: { ...user, isDev: body.isDev } })
    } catch (error) {
      console.log(error)
      return c.json({ success: false })
    }
  }
}