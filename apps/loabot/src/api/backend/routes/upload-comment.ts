import { Context } from 'hono'
import RouteBuilder from '../../builders/route-builder'
import { RepositoryObj } from '../../../repositories/services-registration'

export default class UploadComment extends RouteBuilder<Promise<Response> | Response> {
  private readonly commentRepository: RepositoryObj['commentRepository']
  constructor({commentRepository}: RepositoryObj) {
    super({
      path: '/comment/upload/:id',
      method: 'post',
    })
    this.commentRepository = commentRepository
  }

  public async event(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id')
      const data = await c.req.formData()
      const comment = data.get('comment') as string

      if (!comment) return c.json({ error: 'No comment provided' }, 400)

      await this.commentRepository.create({  
        mapId: Number(id), 
        uId: c.userData.id, 
        comment: comment,
        date: new Date().toISOString()
      })

      return c.redirect(`/mapas/${id}`)
    } catch (error) {
      console.log(error)
    }
    return c.redirect('/')
  }
}