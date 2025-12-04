import { Message, OmitPartialGroupDMChannel } from 'discord.js'
import Event_Builder from '../../builders/event-builder'
import SoTryhard from '../commands/so-tryhard'

const regex = /(\b[qQ]+[uU]*[eE][uUeEqQ]*\b)|(^[¿?]+)|(\b[hH]*[mM]+[hHmM]*[¿?]+\B)|(\b[kK]+[hH]*[eE]*\b)|(\b[wW]+[hH]*[aAoOuUtT]+\b)|(\b[pP]+[oO]+[rR]+[qQkK]+[uUhHeE]*[¿?]\B)+/g

export default class So extends Event_Builder<'messageCreate'> {
  constructor() {
    super({ eventType: 'messageCreate', type: 'on', name: 'so' })
  }

  public event(message: OmitPartialGroupDMChannel<Message<boolean>>): void {
    try {
      if (message.author.bot) return
      const mensaje = SoTryhard.soTryhard 
      ? soTryhard(message.content.toLowerCase())! 
      : soNormal(message.content.toLowerCase())! 

      if (!mensaje) return

      message.reply(mensaje)
    } catch (error) {
      console.log(error)
    }
  }
}

function soNormal(mensaje: string){
  try {
    const isRegexTrue = regex.test(mensaje)
    if (isRegexTrue) return 'so'
  } catch (error) {
    console.log(error)
  }
}

function soTryhard(mensaje: string){
  try {
    const regex2 = /que|[?¿]|^q$|^k$|q$|k$|^k|^q/g

    const isRegexTrue = regex.test(mensaje) && regex2.test(mensaje)
    if (isRegexTrue) return 'so'
  } catch (error) {
    console.log(error)
  }
}