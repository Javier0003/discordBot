import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
  User
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import DbConnection from '../../structures/db-connection'
import { users, Users } from '../../../drizzle/schemas/schema'
import { desc } from 'drizzle-orm'

export default class OsuRank extends Command_Builder {
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('osu! Rank')
    .setDescription('Espera un momento')
  db = DbConnection.db

  constructor() {
    super({
      name: 'osu-rank',
      description: 'osu!'
    })
  }
  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })


      const usuarios = await this.db
        .select({ name: users.name, completed: users.completados })
        .from(users)
        .orderBy(desc(users.completados))

      const description = usuarios.map((val, index) =>{
        return `${index + 1}. ${val.name} - ${val.completed || 0 } completados`
      }).join('\n')


      this.embed.setDescription(description).setColor('Random')
      this.reply = (await this.reply).edit({ embeds: [this.embed]})
    } catch (error) {
      console.log(error)
    }
  }
}
