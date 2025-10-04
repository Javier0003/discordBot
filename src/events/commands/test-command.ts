import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../builders/command-builder'
import OptionBuilder from '../../builders/option-builder'

const options = new OptionBuilder().build()
export default class TestCommand extends Command<typeof options> {
  constructor() {
    super({
      name: 'test-command',
      description: 'command for testing stuff 👍',
      devOnly: true,
      testOnly: false,
      options: options,
      deleted: false,
      notUpdated: true
    })
  }
  public async command(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      interaction.deferReply()

      interaction.reply({ allowedMentions: { parse: ['everyone'] }, content: "test", tts: true })
    } catch (error) {
      console.log(error)
    }
  }
}

