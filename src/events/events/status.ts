import Event_Builder from '../../builders/event-builder'
import LoaSingleton from '../../structures/loa-client'
import { RepositoryObj } from '../../repositories/services-registration'

export default class Status extends Event_Builder<'ready'> {
  private readonly botStatusRepository: RepositoryObj['botStatusRepository']
  constructor({botStatusRepository}: RepositoryObj) {
    super({ eventType: 'ready', type: 'on', name: 'status' })
    this.botStatusRepository = botStatusRepository
  }

  public event() {
    try {
      setInterval(async () => {
        const statusdb = await this.botStatusRepository.getAll()

        const random = Math.floor(Math.random() * statusdb.length)

        const selected = statusdb[random]

        LoaSingleton.LoA.user?.setActivity({
          name: selected?.statusMessage ?? "",
          url: selected?.url ?? undefined,
          type: selected?.type ?? 1,
        })
      }, 30000)
    } catch (error) {
      console.log(error)
    }
  }
}