import {
  CacheType,
  ChatInputCommandInteraction
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import { users } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'

export default class RemoveOsuAccount extends Command_Builder {
  constructor() {
    super({
      name: 'osu-remove-account',
      description: 'Elimina tu cuenta de osu!',
      notUpdated: true,
    })
  }

  public async command(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    try {
      await db.delete(users).where(eq(users.id, interaction.user.id))

      interaction.reply({content: 'Cuenta eliminada', ephemeral: true})
    } catch (error) {
      console.log(error)
    }
  }
}
