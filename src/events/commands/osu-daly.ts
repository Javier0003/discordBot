import { CacheType, CommandInteraction, EmbedBuilder, InteractionResponse, Message } from 'discord.js'
import Command_Builder from '../../structures/command-builder'

export default class OsuDaly extends Command_Builder{
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed:EmbedBuilder = new EmbedBuilder().setTitle('osu! Daly map').setDescription('Espera un momento')

  constructor(){
    super({
      name: 'osu-daly',
      description: 'osu!',
    })
  }
  public async command(interaction: CommandInteraction<CacheType>): Promise<void>{
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })
      console.log('osu-daly')
    } catch (error) {
      console.log(error)
    }
  }
}