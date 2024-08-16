import {
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { plays, users } from '../../../drizzle/schemas/schema'
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
        .select({ name: users.name, id: users.id })
        .from(users)

      const usersAndScores = await db.select({ puntos: plays.puntos, uId: plays.uId }).from(plays)
      
      const playersWithPoints = usuarios.map((val) => {
        let score = 0
        usersAndScores.forEach((user) => {
          if (user.uId === val.id) {
            score += user.puntos
          }
        })
        return { name: val.name, score }
      }).sort((a, b) => b.score - a.score)

      const description = playersWithPoints
        .map((val, index) => {
          return `${index + 1}. ${val.name} - ${val.score || 0} puntos`
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
