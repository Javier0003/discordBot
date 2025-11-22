import { Context } from 'hono'
import RouteBuilder from '../utils/route-handler/route-builder'
import { db } from '../../../utils/db'
import { botStatus } from '../../../../drizzle/schemas/schema'

export default class CreateBotStatus extends RouteBuilder<Promise<Response> | Response> {
    constructor() {
        super({
            path: '/bot/status',
            method: 'post',
            devOnly: true
        })
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

            await db.insert(botStatus).values({
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