import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command_Builder from '../../structures/command-builder'

export default class Hello extends Command_Builder {
  constructor() {
    super({
      name: 'hello',
      description: 'Hello',
      devOnly: true,
      testOnly: false,
      options: [],
      deleted: false,
      notUpdated: true
    })
  }
  public async command(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      interaction.reply('hello')
      
    } catch (error) {
      console.log(error)
    }
  }
}
