import { CacheType, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import Command from '../../structures/command-builder'
import { db } from '../../utils/db'
import { serverUsers } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'
import OptionBuilder from '../../structures/option-builder'

const options = new OptionBuilder().addUserOption({
  description: 'Usuario a desbanear',
  name: 'user',
  required: true,
}).build()

export default class UnBan extends Command<typeof options> {
  constructor() {
    super({
      name: 'unban',
      description: 'Desbaneando a un usuario',
      options: options,
      devOnly: true,
    })
  }

  public async command(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
    try {
      const userId = interaction.options.getUser('user')?.id
      if (!userId) {
        await interaction.reply({ content: 'No se encontró el usuario', flags: MessageFlags.Ephemeral })
        return
      }

      await db.update(serverUsers).set({ isVCBan: '0' }).where(eq(serverUsers.idServerUser, userId))
      await interaction.reply({ content: `<@${userId}> ha sido desbaneado`, allowedMentions: { parse: ['users'] } })
    }
    catch (error) {
      console.error('Error al desbanear al usuario:', error)
      await interaction.reply({ content: 'Hubo un error al desbanear al usuario', flags: MessageFlags.Ephemeral})
      return
    }
  }
}