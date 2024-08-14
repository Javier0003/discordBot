import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { users } from '../../../drizzle/schemas/schema'
import { desc } from 'drizzle-orm'
import { db } from '../../utils/db'

export default class OsuRank extends Command_Builder {
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('osu! Rank')
    .setDescription('Espera un momento')

  constructor() {
    super({
      name: 'osu-rank',
      description: 'osu!',
      notUpdated: true,
    })
  }
  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })

      const usuarios = await db
        .select({ name: users.name, id: users.id, puntos: users.puntos })
        .from(users).orderBy(desc(users.puntos))

      const description = usuarios
        .map((val, index) => {
          return `${index + 1}. ${val.name} - ${val.puntos || 0} puntos`
        })
        .join('\n')

      if (description) {
        this.embed.setDescription(description).setColor('Random')
      } else {
        this.embed.setDescription('No hay nadie 😭').setColor('Red')
      }

      this.reply = (await this.reply).edit({ embeds: [this.embed] })
    } catch (error) {
      console.log(error)
    }
  }
}
