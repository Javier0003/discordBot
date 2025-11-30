import { Context } from 'hono'
import RouteBuilder from '../../builders/route-builder'
import { RepositoryObj } from '../../../repositories/services-registration'

export default class DeleteBotStatus extends RouteBuilder<Promise<Response> | Response> {
    private readonly botStatusRepository: RepositoryObj['botStatusRepository']
    constructor({ botStatusRepository }: RepositoryObj) {
        super({
            path: '/bot/status/:id',
            method: 'delete',
            devOnly: true
        })
        this.botStatusRepository = botStatusRepository
    }

    public async event(c: Context): Promise<Response> {
        try {
            await this.botStatusRepository.delete(Number(c.req.param('id')))
            return c.json({ success: true })
        } catch (error) {
            console.log(error)
            return c.json({ success: false })
        }
    }
}