import {
  ApplicationCommandOptionType,
  CacheType,
  CommandInteraction
} from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import DbConnection from '../../structures/db-connection'
import { users } from '../../../drizzle/schemas/schema'
import { eq } from 'drizzle-orm'

export default class RemoveOsuAccount extends Command_Builder {
  private db = DbConnection.db

  constructor() {
    super({
      name: 'osu-remove-account',
      description: 'Elimina tu cuenta de osu!',
      notUpdated: true,
    })
  }

  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      await this.db.delete(users).where(eq(users.id, interaction.user.id))

      interaction.reply({content: 'Cuenta eliminada', ephemeral: true})
    } catch (error) {
      console.log(error)
    }
  }
}
