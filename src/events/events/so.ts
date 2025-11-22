import { Message, OmitPartialGroupDMChannel } from 'discord.js'
import Event_Builder from '../../builders/event-builder'
import SoTryhard from '../commands/so-tryhard'

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
  '¿?',
  'qeu'
]

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
    if (que.indexOf(mensaje) !== -1) {
      return 'so'
    }
  } catch (error) {
    console.log(error)
  }
}

function soTryhard(mensaje: string){
  try {
    const splitted: string[] = mensaje.split(' ')

    const regex = /que|[?¿]|^q$|^k$|q$|k$|^k|^q/g

    for(let i = 0; i < splitted.length; i++){
      const isRegexTrue = regex.test(splitted[i])
      if (isRegexTrue) return 'so'
    }
  } catch (error) {
    console.log(error)
  }
}