import { CacheType, CommandInteraction, EmbedBuilder, InteractionResponse, Message } from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import DbConnection from '../../structures/db-connection'

export default class OsuRank extends Command_Builder{
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed:EmbedBuilder = new EmbedBuilder().setTitle('osu! Rank').setDescription('Espera un momento')

  constructor(){
    super({
      name: 'osu-rank',
      description: 'osu!',
    })
  }
  public async command(interaction: CommandInteraction<CacheType>): Promise<void>{
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })

      const db = DbConnection.db
      const user = await db.user.findMany({
        orderBy: {
          completados: 'desc'
        }
      })

      const users = user.map((val, index) =>{
        return `${index + 1}. ${val.nombre} - ${val.completados} completados`
      }).join('\n')

      this.embed.setDescription(users).setColor('Random')
      this.reply = (await this.reply).edit({ embeds: [this.embed]})

    } catch (error) {
      console.log(error)
    }
  }
}