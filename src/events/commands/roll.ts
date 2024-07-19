import { CacheType, CommandInteraction } from 'discord.js'
import Command_Builder from '../../structures/command-builder'

export default class Roll extends Command_Builder {
  constructor() {
    super({
      name: 'roll',
      description: 'roll',
      devOnly: false,
      testOnly: false,
      options: [],
      deleted: false
    })
  }
  public async command(interaction: CommandInteraction<CacheType>) {
    let random = Math.floor(Math.random() * 100)
    if (random === 69) {
      interaction.reply(`😎😎 ${random}`)
    } else {
      interaction.reply(`roll ${random}`)
    }
  }
}
