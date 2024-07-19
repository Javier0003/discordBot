import { Message } from 'discord.js'
import Event_Builder, {
  EventCommand
} from '../../structures/event-builder'

export default class Troll extends Event_Builder implements EventCommand {
  private static howManyToTrigger = 0

  constructor() {
    super({ type: 'messageCreate' })
  }

  public event(message: Message) {
    if (message.author.bot) return
    const r = Math.floor(Math.random() * 1000)
    Troll.howManyToTrigger++

    if (r === 500) {
      console.log(`Ha tardado: ${Troll.howManyToTrigger} intentos en activarse`)
      message.reply('CALLATEEEEEEEE GILIPOLLAS !!!!!!!!!!!!!!!!😡😡😡😡😡')
      Troll.resetTrigger()
    }
  }

  private static resetTrigger() {
    Troll.howManyToTrigger = 0
  }
}
