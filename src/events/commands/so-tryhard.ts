import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import OptionBuilder from '../../structures/option-builder'

const options = new OptionBuilder().build()

export default class SoTryhard extends Command_Builder{
  public static soTryhard: boolean = false
  constructor(){
    super({
      name: 'so-tryhard',
      description: 'So tryhard',
      devOnly: false,
      testOnly: false,
      options: options,
      deleted: false,
      notUpdated: false,
    })
  }

  async command(interaction: ChatInputCommandInteraction<CacheType>){
    SoTryhard.soTryhard = !SoTryhard.soTryhard
    await interaction.reply(`So tryhard: ${SoTryhard.soTryhard? 'Activado' : 'Desactivado'}`)
  }
}