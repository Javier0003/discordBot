import { CacheType, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import Command from '../../builders/command-builder'
import OptionBuilder from '../../builders/option-builder'
import { RepositoryObj } from '../../repositories/services-registration'
import ServerUserRepository from '../../repositories/server-user-repository'

const options = new OptionBuilder().addUserOption({
  description: 'Usuario a desbanear',
  name: 'user',
  required: true,
}).build()

export default class UnBan extends Command<typeof options> {
  private readonly serverUserRepository: ServerUserRepository
  constructor({ serverUsersRepository}: RepositoryObj) {
    super({
      name: 'unban',
      description: 'Desbaneando a un usuario',
      options: options,
      devOnly: true,
    })
    this.serverUserRepository = serverUsersRepository
  }

  public async command(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    try {
      const userId = interaction.options.getUser('user')?.id
      if (!userId) {
        await interaction.reply({ content: 'No se encontró el usuario', flags: MessageFlags.Ephemeral })
        return
      }

      await this.serverUserRepository.update(userId, { isVCBan: '0' })
      await interaction.reply({ content: `<@${userId}> ha sido desbaneado`, allowedMentions: { parse: ['users'] } })
    }
    catch (error) {
      console.error('Error al desbanear al usuario:', error)
      await interaction.reply({ content: 'Hubo un error al desbanear al usuario', flags: MessageFlags.Ephemeral})
      return
    }
  }
}