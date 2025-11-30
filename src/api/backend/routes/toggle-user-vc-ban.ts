import { Context } from 'hono'
import RouteBuilder from '../../builders/route-builder'
import { RepositoryObj } from '../../../repositories/services-registration'

export default class ToggleUserVCBan extends RouteBuilder<Promise<Response> | Response> {
  private readonly serverUsersRepository: RepositoryObj['serverUsersRepository']
  constructor({ serverUsersRepository }: RepositoryObj) {
    super({
      path: '/user/:id/vcban',
      method: 'patch',
      devOnly: true
    })
    this.serverUsersRepository = serverUsersRepository
  }

  public async event(c: Context): Promise<Response> {
    try {
      const userId = c.req.param('id')
      const body = await c.req.json<{ isVCBan: string }>()

      const user = await this.serverUsersRepository.getById(userId)

      if (!user) {
        await this.serverUsersRepository.create({ idServerUser: userId, isDev: '0', isVCBan: body.isVCBan })
      } else {
        await this.serverUsersRepository.update(userId,{ isVCBan: body.isVCBan })
      }

      return c.json({ success: true, user: {...user, isVCBan: body.isVCBan} })
    } catch (error) {
      console.log(error)
      return c.json({ success: false })
    }
  }
}