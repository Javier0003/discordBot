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
            const body = await c.req.parseBody()

            const message = body.statusMessage as string
            const type = parseInt(body.type as string)
            const url = body.url as string | undefined

            if (message.length > 256 || (url && url.length > 256) || (type < 0 || type > 5)) {
                return c.json({ success: false, message: "Invalid body" }, 400)
            }

            await this.botStatusRepository.create({
                statusMessage: message,
                type: type,
                url: url ?? undefined,
            })
            return c.redirect('/bot/status')
        } catch (error) {
            console.log(error)
            return c.json({ success: false })
        }
    }
}