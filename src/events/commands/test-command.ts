import { CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../structures/command-builder'
import OptionBuilder from '../../structures/option-builder'

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
      interaction.reply({ allowedMentions: { parse: ['everyone'] }, content: "test", tts: true })
    } catch (error) {
      console.log(error)
    }
  }
}
