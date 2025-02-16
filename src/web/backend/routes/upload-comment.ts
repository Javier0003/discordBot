import { Context } from 'hono'
import RouteBuilder from '../utils/route-handler/route-builder'
import { db } from '../../../utils/db'
import { comments } from '../../../../drizzle/schemas/schema'

export default class UploadComment extends RouteBuilder<Promise<Response> | Response> {
  constructor() {
    super('/comment/upload/:id', 'post')
  }

  public async event(c: Context): Promise<Response> {
    try {
      const data = await c.req.formData()
      const comment = data.get('comment') as string
      if (!comment) return c.json({ error: 'No comment provided' }, 400)

      await db.insert(comments).values({  
        mapId: Number(c.req.param('id')), 
        uId: c.userData.id, 
        comment: comment,
        date: new Date().toISOString()
      })

      return c.redirect(`/mapa/${c.req.param('id')}`)
    } catch (error) {
      console.log(error)
    }
    return c.redirect('/')
  }
}