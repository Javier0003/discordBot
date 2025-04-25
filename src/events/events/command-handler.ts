import { Interaction } from 'discord.js'
import getLocalCommands from '../../utils/get-local-commands'
import Event_Builder from '../../structures/event-builder'
import env from '../../env'
import { CommandConfig } from '../../structures/command-builder'
import { db } from '../../utils/db'
import { serverUsers } from '../../../drizzle/schemas/schema'
import { and, eq } from 'drizzle-orm'

export default class Command_Handler extends Event_Builder<'interactionCreate'> {
  constructor() {
    super({ eventType: 'interactionCreate', type: 'on' })
  }

  public async event(interaction: Interaction): Promise<void> {
    try {
      
      if (!interaction.isChatInputCommand()) return
      const localCommands = await getLocalCommands()
      const commandObject = localCommands?.find(
        (cmd) => cmd.name === interaction.commandName
      ) as CommandConfig

      if (!commandObject) return
      if (!commandObject.execute) return

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
        const userId = interaction.member?.user.id;
        if (!userId) {
          interaction.reply({
            content: 'User ID is not available.',
            ephemeral: true,
          });
          return;
        }

        const dev = await db.select().from(serverUsers).where(and(eq(serverUsers.idServerUser, userId), eq(serverUsers.isDev, '1')));
        if (dev.length === 0) {
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

      await commandObject.execute(interaction)
    } catch (error) {
      console.log(`There was an error running this command: ${error}`)
    }
  }
}
