import { CacheType, Interaction } from 'discord.js'
import Event_Builder from '../../structures/event-builder'

export default class Command_Handler extends Event_Builder<'interactionCreate'> {
  constructor() {
    super({ eventType: 'interactionCreate', type: 'on', name: 'command-handler' })
  }

  public async event(interaction: Interaction<CacheType>): Promise<void> {
    try {
      if (interaction.isChatInputCommand()) {
        await this.loa.commandHandler.executeCommand(interaction)
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (interaction.isMessageComponent()) {
        interaction.message.reply({
          content: error?.message || "Internal error, try again later.",
        })

        return
      }
      if (interaction.inGuild() && interaction.channel?.isTextBased())
        interaction.channel?.send(
          error?.message || "Internal error, try again later.",
        )
    }
  }
}