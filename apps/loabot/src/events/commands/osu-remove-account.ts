import {
  CacheType,
  ChatInputCommandInteraction,
  MessageFlags
} from 'discord.js'
import Command from '../../builders/command-builder'
import { RepositoryObj } from '../../repositories/services-registration'

export default class RemoveOsuAccount extends Command {
  private readonly userRepository: RepositoryObj['userRepository']
  constructor({userRepository}: RepositoryObj) {
    super({
      name: 'osu-remove-account',
      description: 'Elimina tu cuenta de osu!',
      notUpdated: true,
    })
    this.userRepository = userRepository
  }

  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      await this.userRepository.update(interaction.user.id, { osuId: undefined })

      interaction.reply({content: 'Cuenta eliminada', flags: MessageFlags.Ephemeral})
    } catch (error) {
      console.log(error)
    }
  }
}
