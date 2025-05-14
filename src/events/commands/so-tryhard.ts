import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../structures/command-builder'

export default class SoTryhard extends Command{
  public static soTryhard: boolean = false
  constructor(){
    super({
      name: 'so-tryhard',
      description: 'So tryhard',
      devOnly: false,
      testOnly: false,
      deleted: false,
      notUpdated: false,
    })
  }

  async command(interaction: ChatInputCommandInteraction<CacheType>){
    SoTryhard.soTryhard = !SoTryhard.soTryhard
    await interaction.reply(`So tryhard: ${SoTryhard.soTryhard? 'Activado' : 'Desactivado'}`)
  }
}