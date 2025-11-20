import Event_Builder from '../../builders/event-builder'
import LoaSingleton from '../../structures/loa-client'
import { db } from '../../utils/db'
import { botStatus } from '../../../drizzle/schemas/schema'

export default class Status extends Event_Builder<'ready'> {
  constructor() {
    super({ eventType: 'ready', type: 'on', name: 'status' })
  }

  public event() {
    try {
      // setInterval(async () => {
      //   const statusdb = await db.select().from(botStatus)

      //   const random = Math.floor(Math.random() * statusdb.length)

      //   const selected = statusdb[random]

      //   LoaSingleton.LoA.user?.setActivity({
      //     name: selected?.statusMessage ?? "",
      //     url: selected?.url ?? undefined,
      //     type: selected?.type ?? 1,
      //   })
      // }, 10000)
    } catch (error) {
      console.log(error)
    }
  }
}