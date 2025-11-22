import {
  CacheType,
  ChatInputCommandInteraction,
} from 'discord.js'
import Command from '../../builders/command-builder'
import { plays, users } from '../../../drizzle/schemas/schema'
import { RepositoryObj } from '../../repositories/services-registration'

export default class OsuRank extends Command {
  private readonly userRepository: RepositoryObj['userRepository']
  private readonly playRepository: RepositoryObj['playRepository']
  constructor({userRepository, playRepository}: RepositoryObj) {
    super({
      name: 'osu-rank',
      description: 'osu!',
      notUpdated: true,
    })

    this.userRepository = userRepository
    this.playRepository = playRepository
  }

  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      this.embed.setTitle('osu! Rank').setDescription('Espera un momento')
      this.reply = await interaction.reply({ embeds: [this.embed] })

      const usuarios = await this.userRepository.getAll()

      const usersAndScores = await this.playRepository.getAll()
      
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

      this.reply = await this.reply.edit({ embeds: [this.embed] })
    } catch (error) {
      console.log(error)
    }
  }
}
