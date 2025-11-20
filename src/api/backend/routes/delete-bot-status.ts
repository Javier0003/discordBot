import { Context } from 'hono'
import RouteBuilder from '../utils/route-handler/route-builder'
import { db } from '../../../utils/db'
import { botStatus } from '../../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'

export default class DeleteBotStatus extends RouteBuilder<Promise<Response> | Response> {
    constructor() {
        super({
            path: '/bot/status/:id',
            method: 'delete',
            devOnly: true
        })
    }

    public async event(c: Context): Promise<Response> {
        try {
            await db.delete(botStatus).where(eq(botStatus.id, Number(c.req.param('id'))))
            return c.json({ success: true })
        } catch (error) {
            console.log(error)
            return c.json({ success: false })
        }
    }
}