import { Message, OmitPartialGroupDMChannel } from 'discord.js'
import Event_Builder from '../../builders/event-builder'
import { RepositoryObj } from '../../repositories/services-registration'
import RandomReplyRepository from '../../repositories/random-reply-repository'

export default class Troll extends Event_Builder<'messageCreate'> {
  private static howManyToTrigger = 0
  private readonly randomReplyRepository: RandomReplyRepository

  constructor({randomReplyRepository}: RepositoryObj) {
    super({ eventType: 'messageCreate', type: 'on', name: 'troll' })
    this.randomReplyRepository = randomReplyRepository
  }

  public async event(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
      if (message.author.bot) return
      const r = Math.floor(Math.random() * 1000)
      Troll.howManyToTrigger++

      if (r === 500) {
        console.log(
          `Ha tardado: ${Troll.howManyToTrigger} intentos en activarse`
        )
        const reply = await this.randomReplyRepository.getRandomReply();
        message.reply(`${reply ? reply : '<:caracol:1155233128940568587>'}`)
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
