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
      deleted: false,
      notUpdated: true
    })
  }
  public async command(interaction: CommandInteraction<CacheType>) {
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
