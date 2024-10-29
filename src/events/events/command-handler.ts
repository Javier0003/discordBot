import { Interaction } from 'discord.js'
import getLocalCommands from '../../utils/get-local-commands'
import Event_Builder from '../../structures/event-builder'
import { CommandConfig } from '../../structures/command-builder'
import env from '../../env'

interface CommandConfigWithCallback extends CommandConfig {
  command?: (interaction: Interaction) => void
}

export default class Command_Handler extends Event_Builder<'interactionCreate'> {
  constructor() {
    super({ type: 'interactionCreate' })
  }

  public async event(interaction: Interaction): Promise<void> {
    try {
      
      if (!interaction.isChatInputCommand()) return
      const localCommands = await getLocalCommands()
      const commandObject = localCommands?.find(
        (cmd) => cmd.name === interaction.commandName
      ) as CommandConfigWithCallback

      if (!commandObject) return
      if (!commandObject.command) return

      if (commandObject.testOnly) {
        if (!(interaction.guild?.id === env.guildId)) {
          interaction.reply({
            content: 'This command cannot be ran here.',
            ephemeral: true
          })
          return
        }
      }


      if (commandObject.devOnly) {
        if (!env.dev.includes(interaction.member?.user.id || '')) {
          interaction.reply({
            content: 'Only developers are allowed to run this command.',
            ephemeral: true,
          });
          return;
        }
      }

      // if (commandObject.permissionsRequired?.length) {
      //   for (const permission of commandObject.permissionsRequired) {
      //     if (!interaction.member.permissions.has(permission)) {
      //       interaction.reply({
      //         content: 'Not enough permissions.',
      //         ephemeral: true
      //       })
      //       return
      //     }
      //   }
      // }

      //   if (commandObject.botPermissions?.length) {
      //     for (const permission of commandObject.botPermissions) {
      //       const bot = interaction.guild.members.me

      //       if (!bot.permissions.has(permission)) {
      //         interaction.reply({
      //           content: "I don't have enough permissions.",
      //           ephemeral: true
      //         })
      //         return
      //       }
      //     }
      //   }

      await commandObject.command(interaction)
    } catch (error) {
      console.log(`There was an error running this command: ${error}`)
    }
  }
}
