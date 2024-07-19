import { CacheType, CommandInteraction } from 'discord.js'
import Command_Builder from '../../structures/command-builder'

export default class Hello extends Command_Builder {
  constructor() {
    super({
      name: 'hello',
      description: 'Hello',
      devOnly: false,
      testOnly: false,
      options: [],
      deleted: false
    })
  }
  public async command(interaction: CommandInteraction<CacheType>) {
    interaction.reply('hello')
  }
}
