import {
  ApplicationCommandOptionType,
  CacheType,
  ChatInputCommandInteraction,
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
      // notUpdated: true,
      options: [
        {
          name: 'user',
          description: 'Usuario de osu!',
          type: ApplicationCommandOptionType.User,
          required: false
        }
      ]
    })
  }

  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.reply = interaction.reply({ embeds: [this.embed], ephemeral: false })

      await this.getOsuData(interaction)

      let description = 'No se encontraron scores'
      if (this.userScores.length !== 0) {
        description = `User: ${
          this.userData[0].name
        }\nPuntos: ${this.userScores.reduce(
          (sum, add) => sum + add.puntos,
          0
        )}\nPasados: ${this.userScores.length}`
      }

      this.embed = (await this.embed)
        .setTitle(`osu! Profile of: ${this.userData[0].name}`)
        .setColor('Random')
        .setDescription(description)
        .addFields(
          {
            name: 'Accuracy',
            value: this.getAvgAccuracy(this.userScores as scores[])
          },
          {
            name: 'Ranks',
            value: this.getRankString(this.userScores as scores[])
          }
        )
        .setThumbnail(`https://a.ppy.sh/${this.userData[0].osuId}`)

      this.reply = (await this.reply).edit({ embeds: [this.embed] })
    } catch (error) {
      console.log(error)
    }
  }

  private getAvgAccuracy(scores: scores[]): string {
    if (scores.length === 0) return '0%'
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

    if (!scores) return 'No scores'

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
  private async getOsuData(
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    try {
      if (interaction.options.data.length !== 0) {
        const user = interaction.options.get('user')?.value
        this.userData = await db
          .select()
          .from(users)
          .where(eq(users.id, user as string))
        this.userScores = await db
          .select()
          .from(plays)
          .where(eq(plays.uId, user as string))
      } else {
        this.userData = await db
          .select()
          .from(users)
          .where(eq(users.id, interaction.user.id))
        this.userScores = await db
          .select()
          .from(plays)
          .where(eq(plays.uId, interaction.user.id))
      }

      if (!this.userData.length) throw new Error('No se encontró el usuario')
      if (!this.userScores.length) throw new Error('No se encontraron scores')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      this.reply = (await this.reply)?.edit({
        content: 'No se encontró el usuario',
        embeds: []
      })
    }
  }
}

type user = {
  id: string
  name: string | null
  osuId: number
}

type scores = {
  playId: number
  mapId: number
  uId: string
  rank: string
  score: number
  accuracy: string
  puntos: number
}
