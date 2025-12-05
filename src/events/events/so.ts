import { Message, OmitPartialGroupDMChannel } from 'discord.js'
import Event_Builder from '../../builders/event-builder'
import SoTryhard from '../commands/so-tryhard'

// Assumes the whole message string, unsplitted
const regex = /(\b([qQ]+[uU]*[eE][uUeEqQ]*)|^[¿?]+|\b[hH]*[mM]+[hHmM]*[¿?]+|\b[kK]+[hH]*[eE]*|\b[wW]+[hH]*[aAuUtT]+|\b[pP]+[oO]+[rR]+[qQkK]+[uUhHeE]*|\b[qQ]+)[¿?]*$/

const regexTryhard = /(\b[qQ]+[uU]*[eE][uUeEqQ]*\b)|(^[¿?]+)|(\b[hH]*[mM]+[hHmM]*[¿?]+\B)|(\b[kK]+[hH]*[eE]*\b)|(\b[wW]+[hH]*[aAoOuUtT]+\b)|(\b[pP]+[oO]+[rR]+[qQkK]+[uUhHeE]*[¿?]\B|\b[qQ]+\b)+/

const estaRegex = /\b([cC]+[oO]+[mM]+[oO]+[¿?]*)+$/

const so = [
  'so',
  'soo',
  'sooo',
  'SO',
  'SOO',
  'sOOOOOOO XDDDDDDDDDDDDDDDDD',
  'so por si acaso',
  '<:image:1236702569989017671>...'
]

export default class So extends Event_Builder<'messageCreate'> {
  constructor() {
    super({ eventType: 'messageCreate', type: 'on', name: 'so' })
  }

  public event(message: OmitPartialGroupDMChannel<Message<boolean>>): void {
    try {
      if (message.author.bot) return
      let mensaje = SoTryhard.soTryhard 
      ? soTryhard(message.content.toLowerCase())! 
      : soNormal(message.content.toLowerCase())! 

      if (!mensaje)
        mensaje = esta(message.content)!

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
    if (isRegexTrue) return so[Math.floor(Math.random() * so.length)]
  } catch (error) {
    console.log(error)
  }
}

function soTryhard(mensaje: string){
  try {
    const isRegexTrue = regexTryhard.test(mensaje)
    if (isRegexTrue) return so[Math.floor(Math.random() * so.length)]
  } catch (error) {
    console.log(error)
  }
}

function esta(mensaje: string){
  try {
    if (estaRegex.test(mensaje))
      return 'ESTAAA'
  } catch (error) {
    console.log(error)
  }
}