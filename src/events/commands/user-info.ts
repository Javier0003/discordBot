import {
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js'
import Command from '../../builders/command-builder'
import OptionBuilder from '../../builders/option-builder'
import OsuDaily from './osu-daily'
import { RepositoryObj } from '../../repositories/services-registration'
import UserRepository from '../../repositories/user-repository'
import PlayRepository from '../../repositories/play-repository'

const options = new OptionBuilder()
  .addUserOption({
    description: 'Usuario de osu!',
    name: 'user',
  })
  .build()

export default class InfoOsu extends Command<typeof options> {
  private _userRepository: UserRepository
  private readonly playRepository: PlayRepository
  constructor({ userRepository, playRepository }: RepositoryObj) {
    super({
      name: 'user-osu',
      description: 'información de osu!',
      notUpdated: true,
      options: options,
    })
    this.playRepository = playRepository
    this._userRepository = userRepository
  }


  public async command(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    this.embed = this.embed.setTitle('osu! Rank').setDescription('Espera un momento')

    try {
      this.reply = await interaction.reply({ embeds: [this.embed] })

      const data = await this.getOsuData(interaction)

      if (!data) {
        this.reply = await this.reply.edit({ content: 'Error al obtener los datos del usuario.', embeds: [] })
        return
      }

      let description = 'No se encontraron scores'
      if (data.userScores.length <= 0) {
        description = `User: ${data.userData!.name
          }\nPuntos: ${data.userScores.reduce(
            (sum, add) => sum + add.puntos,
            0
          )}\nPasados: ${data.userScores.length}`
      }

      this.embed = (await this.embed)
        .setTitle(`osu! Profile of: ${data.userData!.name}`)
        .setColor('Random')
        .setDescription(description)
        .addFields(
          {
            name: 'Accuracy',
            value: this.getAvgAccuracy(data.userScores as scores[])
          },
          {
            name: 'Ranks',
            value: this.getRankString(data.userScores as scores[])
          }
        )
        .setThumbnail(`https://a.ppy.sh/${data.userData!.osuId}`)

      this.reply = await this.reply.edit({ embeds: [this.embed] })


    } catch (error) {
      console.log(error)
    }
  }

  private getAvgAccuracy(scores: scores[]): string {
    if (scores.length === 0) return '0%'

    const total = scores.reduce((acc: number, score: scores) => acc + Number(score.accuracy), 0)

    return `${OsuDaily.accuracy(total / scores.length)}%`
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

  private async getOsuData(
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    const usuario = this.getOption('user')

    const selectedUser = usuario  ?? null

    if (selectedUser && selectedUser.id) {
      const userId = selectedUser.id
      const userData = await this._userRepository.getById(userId)
      const userScores = await this.playRepository.getByUserId(userId)

      return { userData, userScores }
    } else {
      const userData = await this._userRepository.getById(interaction.user.id)
      const userScores = await this.playRepository.getByUserId(interaction.user.id)

      return { userData, userScores }
    }
  }
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
