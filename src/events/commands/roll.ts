import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../builders/command-builder'

export default class Roll extends Command {
  constructor() {
    super({
      name: 'roll',
      description: 'roll',
      devOnly: false,
      testOnly: false,
      deleted: false,
      notUpdated: true
    })
  }
  public async command(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const random = Math.floor(Math.random() * 100)
      if (random === 69) {
        interaction.reply(`😎😎 ${random}`)
      } else {
        interaction.reply(`roll ${random}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
