import { Message } from 'discord.js'
import Event_Builder from '../../structures/event-builder'

export default class Tony_Padalec
  extends Event_Builder<'messageCreate'>
{
  constructor() {
    super({ type: 'messageCreate' })
  }
  public event(message: Message) {
    try {
      if (message.author.bot) return
      if (message.content.toLowerCase() === 'tony padalec') {
        let randomComic
        do {
          randomComic = Math.floor(Math.random() * 469000)
        } while (randomComic <= 100000)

        message.reply(`https://nhentai.net/g/${randomComic}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
