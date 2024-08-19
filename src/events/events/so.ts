import { Message } from 'discord.js'
import Event_Builder, { EventCommand } from '../../structures/event-builder'

const que = [
  'qe',
  'que',
  'qué',
  'què',
  'quee',
  'queee',
  'queeee',
  'que?',
  'quee?',
  'por que?',
  'por que',
  'porque?',
  'porque',
  'porke?',
  'porke',
  'm?',
  'mm?',
  'mmm?',
  'mmmm?',
  'mmm',
  'wt',
  'wt?',
  'wot',
  'wat',
  'wot?',
  'wat?',
  'ke',
  'khe',
  'ke?',
  'khe?',
  'hm?',
  'hmm?',
  'hmmm?',
  'so?',
  '?',
  '??',
  '???',
  '????',
  '?????',
  '??????',
  '???????',
  '????????',
  '?????????',
  '??????????',
  '???????????',
  '¿',
  '¿¿',
  '¿¿¿',
  '?¿',
  '¿?'
]

export default class So extends Event_Builder implements EventCommand {
  constructor() {
    super({ type: 'messageCreate' })
  }

  public event(message: Message<boolean>) {
    try {
      if (message.author.bot) return

      if (que.indexOf(message.content.toLowerCase()) !== -1) {
        message.reply('so')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
