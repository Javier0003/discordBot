import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../builders/command-builder'
import OptionBuilder from '../../builders/option-builder'
import { RepositoryObj } from '../../repositories/services-registration'
import UserRepository from '../../repositories/user-repository'

const options = new OptionBuilder().build()
export default class TestCommand extends Command<typeof options> {
  private readonly _userRepository: UserRepository
  constructor({userRepository}: RepositoryObj) {
    super({
      name: 'test-command',
      description: 'command for testing stuff 👍',
      devOnly: true,
      testOnly: false,
      options: options,
      deleted: false,
      notUpdated: true
    })

    this._userRepository = userRepository
  }
  public async command(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const reply = await interaction.deferReply()


      const test = await this._userRepository.getAll();


      console.log(test)

      // interaction.reply({ allowedMentions: { parse: ['everyone'] }, content: "test", tts: true })
      await reply.edit({ content: 'Test command executed' })
    } catch (error) {
      console.log(error)
    }
  }
}
