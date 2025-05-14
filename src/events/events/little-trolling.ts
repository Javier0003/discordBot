import { Message, OmitPartialGroupDMChannel } from 'discord.js'
import Event_Builder from '../../structures/event-builder'

export default class Troll extends Event_Builder<'messageCreate'> {
  private static howManyToTrigger = 0

  constructor() {
    super({ eventType: 'messageCreate', type: 'on', name: 'troll' })
  }

  public event(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      if (message.author.bot) return
      const r = Math.floor(Math.random() * 1000)
      Troll.howManyToTrigger++

      if (r === 500) {
        console.log(
          `Ha tardado: ${Troll.howManyToTrigger} intentos en activarse`
        )
        message.reply('CALLATEEEEEEEE GILIPOLLAS !!!!!!!!!!!!!!!!😡😡😡😡😡')
        Troll.resetTrigger()
      }
    } catch (error) {
      console.log(error)
    }
  }

  private static resetTrigger() {
    Troll.howManyToTrigger = 0
  }
}
