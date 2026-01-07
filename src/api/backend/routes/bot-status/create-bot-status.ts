import { Context } from 'hono'
import RouteBuilder from '../../../builders/route-builder'
import { RepositoryObj } from '../../../../repositories/services-registration'

export default class CreateBotStatus extends RouteBuilder<Promise<Response> | Response> {
    private readonly botStatusRepository: RepositoryObj['botStatusRepository']
    constructor({ botStatusRepository }: RepositoryObj) {
        super({
            path: '/bot/status',
            method: 'post',
            devOnly: true
        })
        this.botStatusRepository = botStatusRepository
    }

    public async event(c: Context): Promise<Response> {
        try {
            const body = await c.req.json<{
                name: string
                type: number
                url: string | undefined
            }>()

            if (body.name.length > 256 || (body.url && body.url.length > 256) || (body.type < 0 || body.type > 5)) {
                return c.json({ success: false, message: "Invalid body" }, 400)
            }

            await this.botStatusRepository.create({
                statusMessage: body.name,
                type: body.type,
                url: body.url ?? undefined,
            })
            return c.json({ success: true, body })
        } catch (error) {
            console.log(error)
            return c.json({ success: false })
        }
    }
}