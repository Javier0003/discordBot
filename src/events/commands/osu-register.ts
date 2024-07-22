import { CacheType, CommandInteraction } from 'discord.js'
import Command_Builder from '../../structures/command-builder'
import DbConnection from '../../structures/db-connection'
import { users } from '../../../drizzle/schemas/schema'

export default class OsuRegister extends Command_Builder {
  private db = DbConnection.db
  constructor() {
    super({
      name: 'osu-register',
      description: 'osu!'
    })
  }

  public async command(
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    try {
      await this.db.insert(users).values({
        id: interaction.user.id,
        name: interaction.user.globalName
      })

      interaction.reply({
        content: `Usuario registrado\n${interaction.user.globalName}`,
        ephemeral: true
      })
    } catch (error) {
      interaction.reply({ content: 'ya estas registrado', ephemeral: true })
      console.log(error)
    }
  }
}
