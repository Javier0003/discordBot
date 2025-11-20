import { ActivityType, CacheType, ChatInputCommandInteraction } from 'discord.js'
import Command from '../../builders/command-builder'
import OptionBuilder from '../../builders/option-builder'
import BotStatusRepository from '../../repositories/bot-status-repository'
import LoaSingleton from '../../structures/loa-client'

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
      const reply = await interaction.deferReply()


      // const test = new BotStatusRepository();
      // await test.create({statusMessage: "Bot is running smoothly", type: 2});

      // LoaSingleton.LoA.user?.setBanner('')
      // LoaSingleton.LoA.user.set


      // interaction.reply({ allowedMentions: { parse: ['everyone'] }, content: "test", tts: true })
      await reply.edit({ content: 'Test command executed' })
    } catch (error) {
      console.log(error)
    }
  }
}
