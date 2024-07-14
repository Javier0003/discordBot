import { Message } from 'discord.js'
import Event_Builder, { EventCommand } from '../../structures/event-builder/event-builder'

export default class Tony_Padalec extends Event_Builder implements EventCommand {
  constructor() {
    super({ type: 'messageCreate' })
  }
  public event(message: Message) {
    if (message.author.bot) return
    if (message.content.toLowerCase() === 'tony padalec') {
      let randomComic
      do {
        randomComic = Math.floor(Math.random() * 469000)
      } while (randomComic <= 100000)
  
      message.reply(`https://nhentai.net/g/${randomComic}`)
    }
  }
}