import {
  ApplicationCommandOptionType,
  CacheType,
  CommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { db } from '../../utils/db'
import { plays, users } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'

export default class InfoOsu extends Command_Builder {
  reply: Promise<InteractionResponse<boolean> | Message> | undefined
  embed: EmbedBuilder = new EmbedBuilder()
    .setTitle('osu! Rank')
    .setDescription('Espera un momento')

  constructor() {
    super({
      name: 'user-osu',
      description: 'información de osu!',
      notUpdated: true,
      options: [
        {
          name: 'user',
          description: 'Usuario de osu!',
          type: ApplicationCommandOptionType.String,
          required: false
        }
      ]
    })
  }

  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })

      const userInfo = await this.getOsuData(interaction)

      this.embed = (await this.embed)
        .setTitle(`osu! Profile of: ${userInfo?.data[0].name}`)
        .setColor('Random')
        .setDescription(
          `User: ${userInfo?.data[0].name}\nPuntos: ${userInfo?.data[0].puntos}\nPasados: ${userInfo?.scores.length}`
        )
        .addFields(
          {
            name: 'Accuracy',
            value: this.getAvgAccuracy(userInfo?.scores as scores[])
          },
          {
            name: 'Ranks',
            value: this.getRankString(userInfo?.scores as scores[])
          }
        )
        .setThumbnail(`https://a.ppy.sh/${userInfo?.data[0].osuId}`)

      this.reply = (await this.reply).edit({ embeds: [this.embed] })
    } catch (error) {
      console.log(error)
    }
  }

  private getAvgAccuracy(scores: scores[]): string {
    const total = scores.reduce((acc: number, score: scores) => {
      return acc + parseFloat(score.accuracy.toString())
    }, 0)
    const avg = total / scores.length
    return `${avg.toFixed(2)}%`
  }

  private getRankString(scores: scores[]): string {
    const ranks = {
      SS: 0,
      S: 0,
      A: 0,
      B: 0,
      C: 0,
      D: 0
    }

    scores.forEach((score: scores) => {
      switch (score.rank) {
        case 'SS':
          ranks.SS++
          break
        case 'S':
          ranks.S++
          break
        case 'A':
          ranks.A++
          break
        case 'B':
          ranks.B++
          break
        case 'C':
          ranks.C++
          break
        case 'D':
          ranks.D++
          break
        default:
          break
      }
    })

    return `SS: ${ranks.SS}\nS: ${ranks.S}\nA: ${ranks.A}\nB: ${ranks.B}\nC: ${ranks.C}\nD: ${ranks.D}`
  }

  private userData: user[] = []
  private userScores: scores[] = []
  private async getOsuData(interaction: CommandInteraction<CacheType>) {
    try {
      if (interaction.options.data.length !== 0) {
        this.userData = await db
          .select()
          .from(users)
          .where(eq(users.name, interaction.options.data[0].value as string))
      } else {
        this.userData = await db
          .select()
          .from(users)
          .where(eq(users.id, interaction.user.id))
      }

      this.userScores = await db
        .select()
        .from(plays)
        .where(eq(plays.uId, interaction.user.id))
      if (!this.userData.length) throw new Error('No se encontró el usuario')
      if (!this.userScores.length) throw new Error('No se encontraron scores')
      return {
        data: this.userData,
        scores: this.userScores
      }
    } catch (error) {
      console.log(error)
    }
  }
}

type user = {
  id: string
  name: string | null
  osuId: number
  puntos: number
}

type scores = {
  playId: number
  mapId: number
  uId: string
  rank: string
  score: number
  accuracy: string
}
