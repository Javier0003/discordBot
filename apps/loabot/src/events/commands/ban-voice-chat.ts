import { CacheType, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import Command from '../../builders/command-builder'
import OptionBuilder from '../../builders/option-builder'
import { RepositoryObj } from '../../repositories/services-registration'
import ServerUserRepository from '../../repositories/server-user-repository'
import UserRepository from '../../repositories/user-repository'

const options = new OptionBuilder()
  .addUserOption({ description: 'User to ban', name: 'user', required: true })
  .build()

export default class BanVoiceChat extends Command<typeof options> {
  private readonly userRepository: UserRepository
  private readonly serverUsersRepository: ServerUserRepository

  constructor({userRepository, serverUsersRepository}: RepositoryObj) {
    super({
      name: 'ban-voice-chat',
      description: 'Ban a user from the voice chat',
      devOnly: true,
      testOnly: false,
      options: options,
      deleted: false,
      notUpdated: false
    })
    this.userRepository = userRepository
    this.serverUsersRepository = serverUsersRepository
  }

  public async command(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral })

      const user = interaction.options.getUser('user', true)
      const guild = interaction.guild
      if (!guild) return

      const member = await guild.members.fetch(user.id)
      if (!member) return

      const isUserRegistered = await this.serverUsersRepository.getById(user.id)

      if (!isUserRegistered) {
        const isUserInActualUserDb = await this.userRepository.getById(user.id)
        if(!isUserInActualUserDb){
          await this.userRepository.create({ id: user.id, name: user.username, osuId: 0 })
        }

        await this.serverUsersRepository.create({ idServerUser: user.id, isVCBan: '1' })
        await interaction.editReply({ content: `User ${user.username} has been banned from the voice chat` })
        return
      }
      
      if (isUserRegistered.isVCBan === '1') {
        await interaction.editReply({ content: 'User is already banned from the voice chat' })
        return
      }

      await this.serverUsersRepository.update(user.id, { isVCBan: '1' })
      await interaction.editReply({ content: `User ${user.username} has been banned from the voice chat` })
    } catch (error) {
      console.log(error)
      await interaction.editReply({ content: 'An error occurred while banning the user from the voice chat' })
    }
  }
}